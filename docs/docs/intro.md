---
sidebar_position: 1
---

# Introduction

@hyzyla/pdfium is a Node.js wrapper for the [PDFium](https://pdfium.googlesource.com/pdfium/) library:

- ⬇️ [pdfium](https://pdfium.googlesource.com/pdfium/) - an open-source library for PDF manipulation and rendering, developed by Google and used in Google Chrome browser.
- ⬇️ [pdfium-lib](https://github.com/paulocoutinhox/pdfium-lib) - project by [Paulo Coutinho](https://github.com/paulocoutinhox) to compile PDFium library to multiple platforms, including WebAssembly.
- 📍 [@hyzyla/pdfium](https://github.com/hyzyla/pdfium) - (you are here) Node.js wrapper for the WebAssembly build of PDFium library.

# Features

- 📦 **Zero dependencies** - PDFium library is compiled to WebAssembly and bundled with the package.
- 🚀 **Fast** - PDFium can be faster than [PDF.js](https://mozilla.github.io/pdf.js/), because it's
  originally written in C++ and compiled to WebAssembly, while PDF.js is entirely written in JavaScript.
- 🔒 **Type-safe** - TypeScript definitions are included.

# Use cases

Main use case for this library is to render PDF files to images, but if you need to do something else with PDF files that is supported by PDFium, but not included in this library, feel free to open an issue or a pull request on
[GitHub](https://github.com/hyzyla/pdfium).
