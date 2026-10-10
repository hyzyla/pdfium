import type {
  GetOriginalSizeResult,
  GetPageResult,
  Handle,
  LoadDocumentResult,
  RenderResult,
  RPCRequest,
  RPCResponse,
  SerializableRenderParams,
} from "./protocol.js";

type DistributiveOmit<T, K extends keyof never> = T extends unknown ? Omit<T, K> : never;
export type RPCRequestBody = DistributiveOmit<RPCRequest, "id">;

type Pending = {
  resolve: (value: unknown) => void;
  reject: (reason: unknown) => void;
};

export class WorkerChannel {
  private nextId = 1;
  private readonly pending = new Map<number, Pending>();
  private readonly worker: Worker;
  private readonly objectUrl: string | null;

  constructor(worker: Worker, objectUrl: string | null) {
    this.worker = worker;
    this.objectUrl = objectUrl;
    this.worker.addEventListener("message", (event: MessageEvent<RPCResponse>) => {
      const res = event.data;
      const entry = this.pending.get(res.id);
      if (!entry) return;
      this.pending.delete(res.id);
      if (res.type === "ok") {
        entry.resolve(res.value);
      } else {
        const error = new Error(res.message);
        if (res.stack) error.stack = res.stack;
        entry.reject(error);
      }
    });
    this.worker.addEventListener("error", (event) => {
      const error = event.error instanceof Error ? event.error : new Error(event.message || "Worker error");
      for (const [id, entry] of this.pending) {
        this.pending.delete(id);
        entry.reject(error);
      }
    });
  }

  call<T>(req: RPCRequestBody, transfer: Transferable[] = []): Promise<T> {
    const id = this.nextId++;
    const message = { id, ...req } as RPCRequest;
    return new Promise<T>((resolve, reject) => {
      this.pending.set(id, { resolve: resolve as (value: unknown) => void, reject });
      this.worker.postMessage(message, transfer);
    });
  }

  terminate(): void {
    this.worker.terminate();
    if (this.objectUrl) URL.revokeObjectURL(this.objectUrl);
    for (const [id, entry] of this.pending) {
      this.pending.delete(id);
      entry.reject(new Error("Worker terminated"));
    }
  }
}

export type PDFiumWorkerRenderParams = SerializableRenderParams;
export type PDFiumWorkerRenderResult = RenderResult;

export class PDFiumWorkerPage {
  readonly number: number;
  private readonly handle: Handle;
  private readonly channel: WorkerChannel;

  constructor(channel: WorkerChannel, handle: Handle, pageIndex: number) {
    this.channel = channel;
    this.handle = handle;
    this.number = pageIndex;
  }

  getText(): Promise<string> {
    return this.channel.call<string>({ type: "page.getText", page: this.handle });
  }

  getOriginalSize(): Promise<GetOriginalSizeResult> {
    return this.channel.call<GetOriginalSizeResult>({ type: "page.getOriginalSize", page: this.handle });
  }

  render(options: PDFiumWorkerRenderParams = {}): Promise<PDFiumWorkerRenderResult> {
    return this.channel.call<PDFiumWorkerRenderResult>({
      type: "page.render",
      page: this.handle,
      options,
    });
  }

  async close(): Promise<void> {
    await this.channel.call<null>({ type: "page.close", page: this.handle });
  }
}

export class PDFiumWorkerDocument {
  private readonly handle: Handle;
  private readonly channel: WorkerChannel;

  constructor(channel: WorkerChannel, handle: Handle) {
    this.channel = channel;
    this.handle = handle;
  }

  getPageCount(): Promise<number> {
    return this.channel.call<number>({ type: "doc.getPageCount", doc: this.handle });
  }

  async getPage(pageIndex: number): Promise<PDFiumWorkerPage> {
    const result = await this.channel.call<GetPageResult>({
      type: "doc.getPage",
      doc: this.handle,
      pageIndex,
    });
    return new PDFiumWorkerPage(this.channel, result.page, result.pageIndex);
  }

  async *pages(): AsyncGenerator<PDFiumWorkerPage> {
    const count = await this.getPageCount();
    for (let i = 0; i < count; i++) {
      yield await this.getPage(i);
    }
  }

  async destroy(): Promise<void> {
    await this.channel.call<null>({ type: "doc.destroy", doc: this.handle });
  }
}

export class PDFiumWorkerClientBase {
  protected readonly channel: WorkerChannel;

  constructor(channel: WorkerChannel) {
    this.channel = channel;
  }

  async loadDocument(bytes: Uint8Array, password?: string): Promise<PDFiumWorkerDocument> {
    // Transferring moves the whole underlying buffer to the worker without a
    // copy. When the bytes are only part of a larger or shared buffer, copy
    // them instead, so the rest of that buffer stays usable.
    const whole = bytes.buffer instanceof ArrayBuffer && bytes.byteLength === bytes.buffer.byteLength;
    const payload = whole ? bytes : bytes.slice();
    const result = await this.channel.call<LoadDocumentResult>({ type: "loadDocument", bytes: payload, password }, [
      payload.buffer as ArrayBuffer,
    ]);
    return new PDFiumWorkerDocument(this.channel, result.doc);
  }

  async destroy(): Promise<void> {
    try {
      await this.channel.call<null>({ type: "destroy" });
    } finally {
      this.channel.terminate();
    }
  }
}

export type PDFiumWorkerSpawnInternalOptions = {
  workerSource: string;
  init: { wasmUrl?: string; wasmBinary?: ArrayBuffer };
};

export async function spawnWorkerChannel(opts: PDFiumWorkerSpawnInternalOptions): Promise<WorkerChannel> {
  const blob = new Blob([opts.workerSource], { type: "text/javascript" });
  const objectUrl = URL.createObjectURL(blob);
  const worker = new Worker(objectUrl, { type: "module" });
  const channel = new WorkerChannel(worker, objectUrl);
  // Transfer wasmBinary's buffer to avoid copying it across the boundary.
  const transfer = opts.init.wasmBinary ? [opts.init.wasmBinary] : [];
  await channel.call<null>({ type: "init", ...opts.init }, transfer);
  return channel;
}
