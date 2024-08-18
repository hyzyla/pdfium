import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import PDFDocumentDemo from "./demo.tsx";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./client.ts";

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <PDFDocumentDemo />
      </QueryClientProvider>
    </StrictMode>,
  );
}
