import type { ColorSpace } from "../page.types.js";

export type Handle = string;

export type SerializableRenderParams = {
  scale?: number;
  width?: number;
  height?: number;
  colorSpace?: ColorSpace;
  renderFormFields?: boolean;
  transparent?: boolean;
};

export type RenderResult = {
  width: number;
  height: number;
  originalWidth: number;
  originalHeight: number;
  data: Uint8Array;
};

export type RPCRequest =
  | { id: number; type: "init"; wasmUrl?: string; wasmBinary?: ArrayBuffer }
  | { id: number; type: "loadDocument"; bytes: Uint8Array; password?: string }
  | { id: number; type: "doc.getPageCount"; doc: Handle }
  | { id: number; type: "doc.getPage"; doc: Handle; pageIndex: number }
  | { id: number; type: "doc.destroy"; doc: Handle }
  | { id: number; type: "page.getText"; page: Handle }
  | { id: number; type: "page.getOriginalSize"; page: Handle }
  | { id: number; type: "page.render"; page: Handle; options: SerializableRenderParams }
  | { id: number; type: "destroy" };

export type RPCResponse =
  | { id: number; type: "ok"; value: unknown }
  | { id: number; type: "error"; message: string; stack?: string };

export type LoadDocumentResult = { doc: Handle };
export type GetPageResult = { page: Handle; pageIndex: number };
export type GetOriginalSizeResult = { originalWidth: number; originalHeight: number };
