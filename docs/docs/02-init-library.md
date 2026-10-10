# Initialize Library

Before working with the package, you need to create an instance of PDFiumLibrary. You can do this once for the entire application and reuse the library instance throughout the application's lifetime.

```typescript
import { PDFiumLibrary } from "@hyzyla/pdfium";

const library = await PDFiumLibrary.init();

// ... do something with the library

library.destroy();
```

## Node.js

For Node.js, there is no need to provide any additional settings to load the .wasm file; it will be automatically loaded from your `node_modules` folder.

```typescript
import { PDFiumLibrary } from "@hyzyla/pdfium";

const library = await PDFiumLibrary.init();
```

## Node.js with a bundler

The Node.js build reads `pdfium.wasm` from its own folder in `node_modules`. When a bundler moves your server code, as Next.js or esbuild can, that file may be left behind. The `@hyzyla/pdfium/inline` entry point avoids this: it also runs in Node.js, and the wasm is embedded in its JavaScript as base64.

```typescript
import { PDFiumLibrary } from "@hyzyla/pdfium/inline";

const library = await PDFiumLibrary.init({ disableBase64Warning: true });
```

It adds about 7 MB of JavaScript to your server bundle.

### Next.js

Next.js bundles server code, and the bundled code looks for `pdfium.wasm` at a path that doesn't exist on the server. Tell Next.js not to bundle the package:

```js
// next.config.mjs
export default {
  serverExternalPackages: ["@hyzyla/pdfium"],
};
```

In Next.js 14 this option is called `experimental.serverComponentsExternalPackages`. The `@hyzyla/pdfium/inline` entry point also works in Next.js, with no configuration.

## Browser

In the browser, you need to provide the URL to the `.wasm` binary or the binary itself, as an `ArrayBuffer` or `Uint8Array`, as an argument to the init method. Typically, you will use a bundler like Webpack or Rollup, which allows you to import the `.wasm` file directly as an asset URL. Here is an example of how you can do this with Vite:

```typescript
import { PDFiumLibrary } from "@hyzyla/pdfium";
import wasmUrl from "@hyzyla/pdfium/pdfium.wasm?url"; // URL to the .wasm file

const library = await PDFiumLibrary.init({
  wasmUrl: wasmUrl,
});
```

:::info
This method is recommended for production use, as it allows you to load the .wasm file from your own servers without any additional overhead.
:::

## Browser - quick setup

If you need to quickly test the library in the browser, you can use special entry points that load the `.wasm` file from a CDN or from a base64-encoded string. This approach is not recommended for production use, as it may introduce additional overhead and security risks, but it can be useful for quick testing and prototyping.

#### Load .wasm from CDN (security risk and slower loading):

```typescript
import { PDFiumLibrary } from "@hyzyla/pdfium/browser/cdn";

const library = await PDFiumLibrary.init();
```

#### Load .wasm from base64 encoded string (bigger bundle size):

```typescript
import { PDFiumLibrary } from "@hyzyla/pdfium/inline";

const library = await PDFiumLibrary.init();
```

## Electron

In the main process, use the package as in Node.js:

```typescript
import { PDFiumLibrary } from "@hyzyla/pdfium";

const library = await PDFiumLibrary.init();
```

A renderer counts as a browser, even with Node.js integration turned on, so pass the wasm as described in [Browser](#browser), or use `@hyzyla/pdfium/inline`.
