import type { PDFiumDocument } from "../document.js";
import type { PDFiumLibrary } from "../library.js";
import type { PDFiumPage } from "../page.js";
import type { PDFiumPageRenderParams } from "../page.types.js";
import type {
  GetOriginalSizeResult,
  GetPageResult,
  Handle,
  LoadDocumentResult,
  RenderResult,
  RPCRequest,
} from "./protocol.js";

export type DispatchResult = { value: unknown; transfer: Transferable[] };

export type LibraryFactory = () => Promise<PDFiumLibrary>;

export class WorkerDispatcher {
  private library: PDFiumLibrary | null = null;
  private initPromise: Promise<PDFiumLibrary> | null = null;
  private nextHandleId = 1;
  private readonly documents = new Map<Handle, PDFiumDocument>();
  private readonly pages = new Map<Handle, PDFiumPage>();
  private readonly pagesByDoc = new Map<Handle, Set<Handle>>();
  private readonly factory: LibraryFactory;

  constructor(factory: LibraryFactory) {
    this.factory = factory;
  }

  private makeHandle(prefix: string): Handle {
    return `${prefix}_${this.nextHandleId++}`;
  }

  private async ensureLibrary(): Promise<PDFiumLibrary> {
    if (this.library) return this.library;
    if (this.initPromise) return this.initPromise;
    this.initPromise = (async () => {
      const lib = await this.factory();
      this.library = lib;
      return lib;
    })();
    return this.initPromise;
  }

  private getDoc(handle: Handle): PDFiumDocument {
    const doc = this.documents.get(handle);
    if (!doc) throw new Error(`Unknown document handle: ${handle}`);
    return doc;
  }

  private getPage(handle: Handle): PDFiumPage {
    const page = this.pages.get(handle);
    if (!page) throw new Error(`Unknown page handle: ${handle}`);
    return page;
  }

  private disposeDocument(handle: Handle): void {
    const doc = this.documents.get(handle);
    if (!doc) return;
    const docPages = this.pagesByDoc.get(handle);
    if (docPages) {
      for (const pageHandle of docPages) this.pages.delete(pageHandle);
      this.pagesByDoc.delete(handle);
    }
    doc.destroy();
    this.documents.delete(handle);
  }

  async dispatch(req: RPCRequest): Promise<DispatchResult> {
    switch (req.type) {
      case "init": {
        // Init is handled by the worker entry layer, not by the dispatcher,
        // because each flavor (base64/url/cdn) has its own bootstrap path.
        throw new Error("init message must be handled by the worker entry, not the dispatcher");
      }
      case "loadDocument": {
        const lib = await this.ensureLibrary();
        const doc = await lib.loadDocument(req.bytes, req.password ?? "");
        const handle = this.makeHandle("d");
        this.documents.set(handle, doc);
        this.pagesByDoc.set(handle, new Set());
        return { value: { doc: handle } satisfies LoadDocumentResult, transfer: [] };
      }
      case "doc.getPageCount": {
        return { value: this.getDoc(req.doc).getPageCount(), transfer: [] };
      }
      case "doc.getPage": {
        const page = this.getDoc(req.doc).getPage(req.pageIndex);
        const handle = this.makeHandle("p");
        this.pages.set(handle, page);
        this.pagesByDoc.get(req.doc)?.add(handle);
        return { value: { page: handle, pageIndex: req.pageIndex } satisfies GetPageResult, transfer: [] };
      }
      case "doc.destroy": {
        this.disposeDocument(req.doc);
        return { value: null, transfer: [] };
      }
      case "page.getText": {
        return { value: this.getPage(req.page).getText(), transfer: [] };
      }
      case "page.getOriginalSize": {
        return { value: this.getPage(req.page).getOriginalSize() satisfies GetOriginalSizeResult, transfer: [] };
      }
      case "page.render": {
        // Custom render functions can't cross postMessage; force "bitmap".
        const renderParams: PDFiumPageRenderParams = { ...req.options, render: "bitmap" };
        const result = await this.getPage(req.page).render(renderParams);
        const value: RenderResult = {
          width: result.width,
          height: result.height,
          originalWidth: result.originalWidth,
          originalHeight: result.originalHeight,
          data: result.data,
        };
        return { value, transfer: [result.data.buffer] };
      }
      case "destroy": {
        for (const handle of this.documents.keys()) this.disposeDocument(handle);
        this.library?.destroy();
        this.library = null;
        this.initPromise = null;
        return { value: null, transfer: [] };
      }
    }
  }

  // Test/diagnostic helpers
  liveDocumentCount(): number {
    return this.documents.size;
  }

  livePageCount(): number {
    return this.pages.size;
  }
}
