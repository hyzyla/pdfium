import { type PDFiumDocument, PDFiumLibrary } from "@hyzyla/pdfium";
import { useQuery } from "@tanstack/react-query";
import wasmUrl from "@hyzyla/pdfium/pdfium.wasm?url";
import { useEffect, useRef } from "react";

const useDocument = () => {
  return useQuery({
    queryKey: ["document"],
    queryFn: async () => {
      const response = await fetch("/sample.pdf");
      const arrayBuffer = await response.arrayBuffer();
      const library = await PDFiumLibrary.init({
        wasmUrl: wasmUrl,
      });
      const document = await library.loadDocument(new Uint8Array(arrayBuffer));
      return document;
    },
  });
};

function useRenderPage(
  document: PDFiumDocument,
  options: {
    pageNumber: number;
    scale: number;
  },
) {
  return useQuery({
    queryKey: ["renderPage", options],
    queryFn: async () => {
      const page = document.getPage(options.pageNumber);
      const data = await page.render({
        render: "bitmap",
        scale: options.scale,
      });
      return data;
    },
  });
}

function PDFPageDemo(props: { document: PDFiumDocument; pageNumber: number }) {
  const { data: result, status } = useRenderPage(props.document, {
    pageNumber: props.pageNumber,
    scale: 3,
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (status === "success" && canvasRef.current && result && result.data.length > 0) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        const imageData = new ImageData(new Uint8ClampedArray(result.data), result.width, result.height);
        ctx.putImageData(imageData, 0, 0);
      }
    }
  }, [status, result]);

  if (status === "pending") {
    return <div>Loading...</div>;
  }
  if (status === "error") {
    return <div>Error</div>;
  }

  return (
    <canvas
      ref={canvasRef}
      width={result.width}
      height={result.height}
      style={{ border: "1px solid black", maxWidth: "100%" }}
    />
  );
}

function PDFDocumentDemo() {
  const { data, status } = useDocument();
  console.log(data, status);
  if (status === "pending") {
    return <div>Loading...</div>;
  }
  if (status === "error") {
    return <div>Error</div>;
  }

  return (
    <>
      <h1 style={{ fontFamily: "sans-serif" }}>PDF viewer</h1>
      <PDFPageDemo document={data} pageNumber={1} />
    </>
  );
}

export default PDFDocumentDemo;
