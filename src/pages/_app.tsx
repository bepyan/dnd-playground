import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

const ALink = ({ href, title }: { href: string; title: string }) => {
  const route = useRouter();
  const isCurrent = route.pathname === href;

  return (
    <Link href={href}>
      <a
        className={
          'text-lg transition-all hover:drop-shadow-lg ' +
          (isCurrent ? 'font-bold' : 'text-gray-500')
        }
      >
        {title}
      </a>
    </Link>
  );
};

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

      <div className="mx-auto max-w-3xl pb-10">
        <div className="flex flex-wrap items-center gap-4 p-4">
          <ALink href="/" title="Drag" />
          <ALink href="/touch" title="Touch" />
          <ALink href="/resize" title="Resize" />
          <ALink href="/carousel" title="Carousel" />
          <ALink href="/dnd" title="DND" />
          <ALink href="/todo" title="TODO" />
        </div>

        <Component {...pageProps} />
      </div>
    </>
  );
}

export default MyApp;
