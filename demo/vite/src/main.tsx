import { QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { queryClient } from "./client.ts";
import PDFDocumentDemo from "./demo.tsx";

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
