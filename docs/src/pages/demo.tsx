import React from "react";
import Layout from "@theme/Layout";
import BrowserOnly from "@docusaurus/BrowserOnly";
import { DemoViewer } from "../components/demo";

export default function Demo() {
  return (
    <Layout title="Hello" description="Hello React Page">
      <BrowserOnly fallback={<div>Loading...</div>}>{() => <DemoViewer />}</BrowserOnly>
    </Layout>
  );
}
