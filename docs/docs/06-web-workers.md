# Web Workers

Rendering PDFs is CPU-heavy. Doing it on the main thread freezes the UI for the duration of every render — fine for one page, painful for documents with dozens of pages, unacceptable in apps with animations or interactive UI. The fix is to move PDFium into a [Web Worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API).

`@hyzyla/pdfium/worker` is a single-import worker entrypoint. The library spawns and manages the worker; you tell it where to find `pdfium.wasm`, then call methods on a Promise-based API that mirrors the in-process one.

## 60-second start

```typescript
import { PDFiumWorkerClient } from "@hyzyla/pdfium/worker";
import wasmUrl from "@hyzyla/pdfium/pdfium.wasm?url"; // Vite

const pdfium = await PDFiumWorkerClient.spawn({ wasmUrl });

const bytes = new Uint8Array(await (await fetch("/my.pdf")).arrayBuffer());
const doc = await pdfium.loadDocument(bytes);

const page = await doc.getPage(0);
const { data, width, height } = await page.render({ scale: 2 });

await doc.destroy();
await pdfium.destroy();
```

That's the whole API. Two differences from the in-process `PDFiumLibrary`:

- **Every method is async** — calls dispatch over `postMessage`.
- **No custom `render` callbacks** — JS functions can't cross the worker boundary. Render returns raw bitmap bytes; convert them on the main thread (see [Render result handling](#render-result-handling)).

## Spawning the worker

`spawn()` accepts exactly one of two options.

### `wasmUrl` — the common case

```typescript
PDFiumWorkerClient.spawn({ wasmUrl: "https://my-cdn.example/pdfium.wasm" });
```

The worker fetches the WASM with `WebAssembly.instantiateStreaming` — download and compile run in parallel for the fastest cold start. If your server doesn't send `Content-Type: application/wasm`, the worker silently falls back to fetch + compile.

`wasmUrl` is fetched inside the worker, where `self.location` is a `blob:` URL. That has implications for what you can pass:

- **Absolute URLs** (`https://example.com/pdfium.wasm`) — always work.
- **Root-relative paths** (`/pdfium.wasm`) — work fine; resolved against the page's origin.
- **Truly relative paths** (`pdfium.wasm`, `./pdfium.wasm`) — won't work; the worker's blob URL is not a meaningful base for relative resolution.

Bundler `?url` helpers and `new URL("...", import.meta.url)` produce root-relative or absolute URLs, both of which are safe.

### `wasmBinary` — when you already have the bytes

```typescript
PDFiumWorkerClient.spawn({ wasmBinary: arrayBuffer });
```

Use this when you fetched the WASM yourself (custom auth, IndexedDB cache, embedded in your bundle). The buffer is **transferred** to the worker — its bytes move without a copy, but the original `ArrayBuffer` becomes detached on the main thread.

## Bundler recipes

### Vite

```typescript
import wasmUrl from "@hyzyla/pdfium/pdfium.wasm?url";
import { PDFiumWorkerClient } from "@hyzyla/pdfium/worker";

const pdfium = await PDFiumWorkerClient.spawn({ wasmUrl });
```

`?url` tells Vite to emit the WASM as a static asset and resolve the import to its absolute URL.

### Webpack 5

```typescript
import { PDFiumWorkerClient } from "@hyzyla/pdfium/worker";

const wasmUrl = new URL("@hyzyla/pdfium/pdfium.wasm", import.meta.url).toString();
const pdfium = await PDFiumWorkerClient.spawn({ wasmUrl });
```

Webpack 5's [asset modules](https://webpack.js.org/guides/asset-modules/) recognize this pattern and emit the asset automatically. If you've added a custom rule for `.wasm` in `module.rules`, it'll override this — remove or scope it.

### Next.js (App Router)

```typescript
"use client";

import wasmUrl from "@hyzyla/pdfium/pdfium.wasm?url";
import { PDFiumWorkerClient } from "@hyzyla/pdfium/worker";

let pdfiumPromise: Promise<PDFiumWorkerClient> | null = null;
function getPdfium() {
  if (!pdfiumPromise) pdfiumPromise = PDFiumWorkerClient.spawn({ wasmUrl });
  return pdfiumPromise;
}
```

Workers and `Worker` only exist in the browser, so this has to live in a `"use client"` component. The lazy singleton avoids spawning a worker on every render.

### esbuild

```typescript
import { PDFiumWorkerClient } from "@hyzyla/pdfium/worker";
import wasmUrl from "@hyzyla/pdfium/pdfium.wasm";

const pdfium = await PDFiumWorkerClient.spawn({ wasmUrl });
```

Build with `--loader:.wasm=file` (CLI) or `loader: { ".wasm": "file" }` (JS API). esbuild copies the WASM into your output dir; the import resolves to its public path.

### No bundler

Host `pdfium.wasm` somewhere on your origin and pass an absolute URL:

```typescript
import { PDFiumWorkerClient } from "https://esm.sh/@hyzyla/pdfium/worker";

const pdfium = await PDFiumWorkerClient.spawn({
  wasmUrl: new URL("/static/pdfium.wasm", location.origin).toString(),
});
```

## How it works

1. `spawn()` creates a Web Worker from a small bundled blob (~290 KB) containing the dispatcher and the PDFium JS glue.
2. The client sends an `init` message (with `wasmUrl` or transferred `wasmBinary`) and waits for the worker's ack.
3. The worker instantiates WASM via `WebAssembly.instantiateStreaming` (URL) or `WebAssembly.instantiate` (binary).
4. PDFium objects — handles, documents, pages — live entirely inside the worker. The client holds opaque handle strings.
5. `pdfium.destroy()` releases active documents, tears down the library, and terminates the worker.

## Render result handling

`page.render()` returns raw bitmap bytes (BGRA in memory order, or grayscale). To turn it into something paintable:

```typescript
const { data, width, height } = await page.render({ scale: 2 });

const canvas = new OffscreenCanvas(width, height);
const ctx = canvas.getContext("2d")!;
const imageData = new ImageData(new Uint8ClampedArray(data.buffer), width, height);
ctx.putImageData(imageData, 0, 0);

const pngBlob = await canvas.convertToBlob({ type: "image/png" });
```

The pixel buffer is sent as a [transferable](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Transferable_objects) — no copy regardless of size. After `page.render()` resolves, the worker no longer holds the buffer; it belongs to the main thread.

## Custom worker patterns

If `PDFiumWorkerClient` doesn't fit — different message protocol, custom batching, integration with an existing worker pool, strict CSP that blocks blob workers — skip the wrapper and use `PDFiumLibrary` directly inside your own worker file.

### Single custom worker

```typescript
// my-pdf-worker.ts
import { PDFiumLibrary } from "@hyzyla/pdfium";
import wasmUrl from "@hyzyla/pdfium/pdfium.wasm?url";

const libPromise = PDFiumLibrary.init({ wasmUrl });

self.addEventListener("message", async (event) => {
  const { id, type, payload } = event.data;
  const lib = await libPromise;
  try {
    if (type === "renderFirstPage") {
      const doc = await lib.loadDocument(payload.bytes);
      const page = doc.getPage(0);
      const { data, width, height } = await page.render({ scale: payload.scale });
      doc.destroy();
      self.postMessage({ id, ok: { data, width, height } }, [data.buffer]);
    }
  } catch (err) {
    self.postMessage({ id, error: String(err) });
  }
});
```

You get full control of the protocol (cancellation, progress events, batched calls), and your bundler emits a real-file worker — works under strict CSP without `blob:` in `worker-src`, shows up in DevTools with a real source path.

### Worker pool for parallel rendering

When rendering many pages in parallel (PDF viewer thumbnails, batch processing), one worker becomes the bottleneck. The pattern:

1. Compile the WASM **once** on the main thread.
2. Send the compiled `WebAssembly.Module` to N workers (it's structured-cloneable).
3. Each worker uses `instantiateWasm` to skip its own compilation, reusing the shared module.

```typescript
// main.ts
import wasmUrl from "@hyzyla/pdfium/pdfium.wasm?url";

const wasmBytes = await fetch(wasmUrl).then(r => r.arrayBuffer());
const wasmModule = await WebAssembly.compile(wasmBytes); // compile ONCE

const workers: Worker[] = Array.from({ length: 4 }, () => {
  const w = new Worker(new URL("./my-render-worker.ts", import.meta.url), { type: "module" });
  w.postMessage({ type: "init", wasmModule });
  return w;
});

// Distribute pages round-robin across workers
const renders = await Promise.all(
  pageIndexes.map((pageIndex, i) =>
    sendRenderJob(workers[i % workers.length], pageIndex, bytes)
  )
);
```

```typescript
// my-render-worker.ts
import { PDFiumLibrary } from "@hyzyla/pdfium";

let libPromise: Promise<PDFiumLibrary> | null = null;

self.addEventListener("message", async (event) => {
  if (event.data.type === "init") {
    libPromise = PDFiumLibrary.init({
      instantiateWasm: ((imports, success) => {
        WebAssembly.instantiate(event.data.wasmModule, imports).then(inst => {
          success(inst, event.data.wasmModule);
        });
        return {};
      }) as never,
    });
    return;
  }
  // ... handle render jobs against libPromise ...
});
```

WASM compilation is the expensive part of cold start (~100s of ms). Compiling once and sharing the `WebAssembly.Module` means N workers share that cost instead of paying it N times.

## Common gotchas

**`Cannot use 'import.meta' outside a module`** — The worker must be created with `{ type: "module" }`. The library's `spawn()` does this for you; if you bring your own worker, make sure your bundler emits a module worker.

**`WebAssembly.instantiateStreaming failed: Incorrect response MIME type`** — Your server is sending `pdfium.wasm` with `Content-Type: text/plain` or similar. The library falls back to non-streaming compile automatically; for max performance, configure the host to send `application/wasm`. Most CDNs (Vercel, Netlify, jsDelivr, Cloudflare) do this by default.

**`Refused to create a worker from 'blob:...'`** — Strict CSP. `spawn()` builds its worker from a `Blob` URL; if your CSP forbids that, either add `blob:` to `worker-src`, or [write your own worker](#custom-worker-patterns) loaded from a real file under your origin.

**Worker memory keeps growing** — `PDFiumDocument` and pages hold native memory inside WASM. Always `await doc.destroy()` when done; `pdfium.destroy()` only tears down the library and active documents at terminate time. Long-running apps that load many PDFs without destroying them will leak.

**Server-side rendering (Node.js)** — The worker entrypoint targets browser `Worker`, not Node's `worker_threads` — different message protocols and globals. To keep the Node event loop responsive while rendering, spawn a `worker_threads` worker yourself and use `@hyzyla/pdfium` inside it. The simple in-process `PDFiumLibrary.init()` works there.

## When *not* to use a worker

- **One-off renders.** If you render one page once at app startup, the worker spin-up and postMessage round-trip outweigh the benefit.
- **Trivial documents.** A 2-page document at default scale renders in tens of milliseconds — under the threshold where blocking is noticeable.
- **You already have a worker doing related work.** Spawning a second dedicated PDFium worker is wasteful; load `@hyzyla/pdfium` inside the worker you've already got.
