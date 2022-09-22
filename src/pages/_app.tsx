import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <title>DND playground</title>
        <meta name="description" content="Learn Drag add Drop" />
        <meta property="og:type" key="type" content="website" />
        <meta property="og:site_name" key="site_name" content="dnd-playground" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no"
        />
      </Head>
      <Component {...pageProps} />;
    </>
  );
}

export default MyApp;
