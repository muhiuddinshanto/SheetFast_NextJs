import Head from 'next/head';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
    return (
        <>
            <Head>
                <title>SheetFast Order Dashboard</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/epic.png" type="image/svg+xml" />
            </Head>
            <Component {...pageProps} />
        </>
    );
}
