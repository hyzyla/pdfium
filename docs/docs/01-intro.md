# Introduction

@hyzyla/pdfium is a TypeScript/JavaScript wrapper for the [PDFium](https://pdfium.googlesource.com/pdfium/) library:

- ⬇️ [pdfium](https://pdfium.googlesource.com/pdfium/) - an open-source library for PDF manipulation and rendering, developed by Google and used in Google Chrome browser.
- ⬇️ [pdfium-lib](https://github.com/paulocoutinhox/pdfium-lib) - project by [Paulo Coutinho](https://github.com/paulocoutinhox) to compile PDFium library to multiple platforms, including WebAssembly.
- 📍 [@hyzyla/pdfium](https://github.com/hyzyla/pdfium) - (you are here) TypeScript/JavaScript wrapper for the WebAssembly build of PDFium library.

# Features

- 📦 **Zero dependencies** - PDFium library is compiled to WebAssembly and bundled with the package.
- 🔒 **Type-safe** - TypeScript definitions are included.
- 🗼 **Works in browser and Node.js**

# Supported environments

- Node.js 18.3 or newer, tested on 18, 20, 22, 24 and 26.
- Chrome and Edge 85+, Firefox 79+ and Safari 15+. The tests run in Chrome, Firefox and WebKit, with the package bundled by Vite, bundled by webpack, and loaded without a bundler.
- `@hyzyla/pdfium/worker` starts a module worker, which Firefox supports from version 114.

On older versions the library throws an error when it loads, because PDFium's WebAssembly build checks the runtime version.

# Use cases

Main use case for this library is to render PDF files to images, but if you need to do something else with PDF files that is supported by PDFium, but not included in this library, feel free to open an issue or a pull request on
[GitHub](https://github.com/hyzyla/pdfium).

Examples how to render PDF files to images can be found on 👉 ["Render PDF to image"](/docs/03-render-pdf.md) page.

# Installation

```sh
# yarn add @hyzyla/pdfium
# pnpm install @hyzyla/pdfium
npm install @hyzyla/pdfium
```
