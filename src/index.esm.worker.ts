import { PDFiumWorkerClientBase, spawnWorkerChannel } from "./worker/client-base.js";

export {
  PDFiumWorkerDocument,
  PDFiumWorkerPage,
  type PDFiumWorkerRenderParams,
  type PDFiumWorkerRenderResult,
} from "./worker/client-base.js";

declare const __WORKER_BUNDLE_SOURCE__: string;

/**
 * Pass exactly one of `wasmUrl` or `wasmBinary`.
 *
 * - `wasmUrl`: absolute URL of pdfium.wasm. Bundlers like Vite (`?url`) and
 *   Webpack 5 (`new URL(..., import.meta.url)`) produce absolute URLs in
 *   production. The worker streaming-instantiates from the URL.
 * - `wasmBinary`: raw bytes of pdfium.wasm. Useful when you already have the
 *   bytes (cached in IndexedDB, fetched via custom auth, etc.). The buffer is
 *   transferred to the worker — pass a copy if you need to keep using it.
 */
export type PDFiumWorkerClientOptions =
  | { wasmUrl: string; wasmBinary?: never }
  | { wasmUrl?: never; wasmBinary: ArrayBuffer };

export class PDFiumWorkerClient extends PDFiumWorkerClientBase {
  static async spawn(options: PDFiumWorkerClientOptions): Promise<PDFiumWorkerClient> {
    if (!options || (!options.wasmUrl && !options.wasmBinary)) {
      throw new Error("PDFiumWorkerClient.spawn: wasmUrl or wasmBinary is required");
    }
    const channel = await spawnWorkerChannel({
      workerSource: __WORKER_BUNDLE_SOURCE__,
      init: { wasmUrl: options.wasmUrl, wasmBinary: options.wasmBinary },
    });
    return new PDFiumWorkerClient(channel);
  }
}
