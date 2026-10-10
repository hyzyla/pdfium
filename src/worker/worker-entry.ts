import { PDFiumLibrary } from "../library.js";
import PDFiumModule from "../vendor/pdfium.esm.js";
import { WorkerDispatcher } from "./dispatcher.js";
import type { RPCRequest, RPCResponse } from "./protocol.js";

type InitData = { wasmUrl?: string; wasmBinary?: ArrayBuffer };

let resolveInit: ((data: InitData) => void) | null = null;
const initReady = new Promise<InitData>((resolve) => {
  resolveInit = resolve;
});

const dispatcher = new WorkerDispatcher(async () => {
  const init = await initReady;
  return PDFiumLibrary.initBase({
    vendor: PDFiumModule,
    // instantiateWasm bypasses the vendor's findWasmBinary URL resolution,
    // which would otherwise crash inside a blob worker. We do our own
    // streaming instantiation here, with a fetch+compile fallback for servers
    // that serve pdfium.wasm with the wrong Content-Type.
    instantiateWasm: ((imports: WebAssembly.Imports, success: unknown) => {
      const cb = success as (instance: WebAssembly.Instance, module: WebAssembly.Module) => void;
      void instantiate(init, imports).then(({ instance, module }) => cb(instance, module));
      return {} as WebAssembly.Exports;
    }) as never,
  });
});

async function instantiate(
  init: InitData,
  imports: WebAssembly.Imports,
): Promise<{ instance: WebAssembly.Instance; module: WebAssembly.Module }> {
  if (init.wasmBinary) {
    const result = await WebAssembly.instantiate(init.wasmBinary, imports);
    return result as unknown as { instance: WebAssembly.Instance; module: WebAssembly.Module };
  }
  if (!init.wasmUrl) {
    throw new Error("Worker init: wasmUrl or wasmBinary is required");
  }
  try {
    const result = await WebAssembly.instantiateStreaming(fetch(init.wasmUrl), imports);
    return { instance: result.instance, module: result.module };
  } catch {
    const response = await fetch(init.wasmUrl);
    const bytes = await response.arrayBuffer();
    const result = await WebAssembly.instantiate(bytes, imports);
    return result as unknown as { instance: WebAssembly.Instance; module: WebAssembly.Module };
  }
}

self.addEventListener("message", async (event: MessageEvent<RPCRequest>) => {
  const req = event.data;
  if (req.type === "init") {
    if (!resolveInit) {
      const response: RPCResponse = { id: req.id, type: "error", message: "Worker already initialized" };
      (self as unknown as Worker).postMessage(response);
      return;
    }
    resolveInit({ wasmUrl: req.wasmUrl, wasmBinary: req.wasmBinary });
    resolveInit = null;
    const response: RPCResponse = { id: req.id, type: "ok", value: null };
    (self as unknown as Worker).postMessage(response);
    return;
  }
  try {
    const { value, transfer } = await dispatcher.dispatch(req);
    const response: RPCResponse = { id: req.id, type: "ok", value };
    (self as unknown as Worker).postMessage(response, transfer);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const stack = err instanceof Error ? err.stack : undefined;
    const response: RPCResponse = { id: req.id, type: "error", message, stack };
    (self as unknown as Worker).postMessage(response);
  }
});
