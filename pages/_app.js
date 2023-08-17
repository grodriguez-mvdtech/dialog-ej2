import "../public/styles/reset.css";
import "../public/styles/global.css";
import "../public/styles/fluent.css";
import "../public/styles/icons.css";

import Head from "next/head";
import Layout from "../components/layout/Layout";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}
