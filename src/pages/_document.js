import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
      {/* <link href="https://fonts.googleapis.com/css2?family=Changa+One&family=Changa:wght@500&family=Lato:wght@400;700&family=Nunito+Sans:wght@800&display=swap" rel="stylesheet"/> */}
      {/* <link href="../public/styles.css" rel="stylesheet"></link> */}
      <link href="https://fonts.googleapis.com/css2?family=Changa+One&family=Changa:wght@500&family=Lalezar&family=Lato:wght@400;700&family=Nunito+Sans:wght@800&display=swap" rel="stylesheet" />
      <link rel="icon" href="/logo.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}