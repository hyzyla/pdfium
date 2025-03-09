import BrowserOnly from "@docusaurus/BrowserOnly";
import Layout from "@theme/Layout";
import React from "react";
import { DemoViewer } from "../components/demo.js";

export default function Demo() {
  return (
    <Layout title="Hello" description="Hello React Page">
      <BrowserOnly fallback={<div>Loading...</div>}>{() => <DemoViewer />}</BrowserOnly>
    </Layout>
  );
}
