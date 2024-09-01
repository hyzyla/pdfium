# Initialize Library

Before working with the package, you need to create an instance of PDFiumLibrary. You can do this once for the entire application and reuse the library instance throughout the application's lifetime.



```typescript
import { PDFiumLibrary } from '@hyzyla/pdfium';

const library = await PDFiumLibrary.init();

// ... do something with the library

library.destroy();
```


## Node.js

For Node.js, there is no need to provide any additional settings to load the .wasm file; it will be automatically loaded from your `node_modules` folder.

```typescript
import { PDFiumLibrary } from '@hyzyla/pdfium';

const library = await PDFiumLibrary.init();
```

## Browser

In the browser, you need to provide the URL to the `.wasm` binary or an `ArrayBuffer` of the `.wasm` binary as an argument to the init method. Typically, you will use a bundler like Webpack or Rollup, which allows you to import the `.wasm` file directly as an asset URL. Here is an example of how you can do this with Rollup:

```typescript
import { PDFiumLibrary } from "@hyzyla/pdfium/browser/cdn";
import wasmUrl from "@hyzyla/pdfium/pdfium.wasm?url";  // URL to the .wasm file

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
import { PDFiumLibrary } from "@hyzyla/pdfium/browser/base64";

const library = await PDFiumLibrary.init();
```

