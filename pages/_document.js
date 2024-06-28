import Document, { Html, Head, Main, NextScript } from 'next/document';
// import { ServerStyleSheet } from 'styled-components'; // If you use styled-components

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Preload your critical CSS */}
          <link rel="preload" href="/styles/critical.css" as="style" />
          <link rel="stylesheet" href="/styles/critical.css" />
          {/* Load your non-critical CSS asynchronously */}
          <link rel="preload" href="/styles/main.css" as="style" onload="this.onload=null;this.rel='stylesheet'" />
          <noscript>
            <link rel="stylesheet" href="/styles/main.css" />
          </noscript>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
