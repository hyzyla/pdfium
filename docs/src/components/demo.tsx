import { type PDFiumDocument, PDFiumLibrary } from "@hyzyla/pdfium/browser/base64";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import React, { useCallback, useEffect, useRef, useState } from "react";

const client = new QueryClient();

function debounce<F extends (...args: Parameters<F>) => ReturnType<F>>(
  func: F,
  waitFor: number,
): (...args: Parameters<F>) => void {
  let timeout: ReturnType<typeof setTimeout>;

  return (...args: Parameters<F>): void => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), waitFor);
  };
}

function usePDFium() {
  return useQuery({
    queryKey: ["pdfium"],
    queryFn: async () => {
      const pdfium = await PDFiumLibrary.init();
      return pdfium;
    },
  });
}

function useLoadDocument(pdfium?: PDFiumLibrary) {
  return useQuery({
    queryKey: ["document"],
    queryFn: async () => {
      const response = await fetch("/sample.pdf");
      const buff = new Uint8Array(await response.arrayBuffer());
      return pdfium.loadDocument(buff);
    },
    enabled: !!pdfium,
  });
}

function useGetPageBitmap(
  document?: PDFiumDocument,
  options?: {
    pageNumber: number;
    scale: number;
  },
) {
  const pageNumber = options?.pageNumber ?? 0;
  const scale = options?.scale ?? 3;
  return useQuery({
    queryKey: ["page", pageNumber, scale],
    queryFn: async () => {
      const page = document.getPage(options.pageNumber);
      return page.render({
        render: "bitmap",
        scale: options.scale,
      });
    },
    enabled: !!document || !!scale,
  });
}

export function PDFPageViwer(props: { pdfiumDocument: PDFiumDocument; pageNumber: number; scale: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const result = useGetPageBitmap(props.pdfiumDocument, {
    pageNumber: props.pageNumber,
    scale: props.scale,
  });

  const renderData = result?.data;

  useEffect(() => {
    if (canvasRef.current && renderData) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      canvas.width = renderData.width;
      canvas.height = renderData.height;
      if (renderData.data.length === 0) {
        return;
      }
      if (ctx) {
        const copyData = new Uint8ClampedArray(renderData.data);
        const imageData = new ImageData(copyData, renderData.width, renderData.height);
        ctx.putImageData(imageData, 0, 0);
      }
    }
  }, [renderData]);

  if (result.isLoading) {
    return null;
  }

  return <canvas ref={canvasRef} />;
}

export function PDFDocumentViewer() {
  const [pageNumber, setPageNumber] = useState(0);
  const [scale, setScale] = useState("100");
  const pdfiumResult = usePDFium();
  const documentResult = useLoadDocument(pdfiumResult.data);

  const scaleNormalized = Number.parseInt(scale, 10) / 25;

  const setScaleDebounced = useCallback(
    debounce((value: string) => {
      setScale(value);
    }, 100),
    [],
  );

  if (pdfiumResult.isLoading || documentResult.isLoading) {
    return <div>Loading...</div>;
  }
  if (pdfiumResult.isError || documentResult.isError) {
    return <div>Error</div>;
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", margin: "20px", gap: "10px" }}>
      <div style={{ display: "flex", gap: "10px" }}>
        <button
          type="button"
          onClick={() => {
            setPageNumber((prev) => Math.max(0, prev - 1));
          }}
        >
          Prev
        </button>
        <button
          type="button"
          onClick={() => {
            const pageCount = documentResult.data?.getPageCount() ?? 0;
            setPageNumber((prev) => Math.min(pageCount - 1, prev + 1));
          }}
        >
          Next
        </button>
        <input type="range" min="1" max="100" onChange={(e) => setScaleDebounced(e.currentTarget.value)} />
        <span>{scaleNormalized}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", border: "1px solid black" }}>
        <PDFPageViwer pdfiumDocument={documentResult.data} pageNumber={pageNumber} scale={scaleNormalized} />
      </div>
    </div>
  );
}

export function DemoViewer() {
  return (
    <QueryClientProvider client={client}>
      <PDFDocumentViewer />
    </QueryClientProvider>
  );
}
