import { Inter } from 'next/font/google';
import './globals.css'; // Ensure the global CSS does not include .gradient-title-text
import { AuthProvider } from './Providers';
import NavBar from '../components/NavBar';
import Head from 'next/head';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Dream Oracles | Free Dream Interpretation AI',
  description: 'Find out what your dreams mean using cutting-edge AI technology. Explore our Jung, Freud, and Islamic AI models for dream interpretations.',
  url: 'https://dreamoracles.com',
  robots: 'index, follow',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <style>{`
          .gradient-title-text {
            background: linear-gradient(180deg, #ffffff, #8585A3);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            font-family: 'Gill Sans', sans-serif;
          }
        `}</style>
      </Head>
      <body>
        <AuthProvider>
          <NavBar />
          <div className="main-content">
            {children}
          </div>
        </AuthProvider>
        <Script strategy="afterInteractive" src="https://www.googletagmanager.com/gtag/js?id=G-1TF2VESNGX"/>
        <Script strategy="afterInteractive" id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-1TF2VESNGX');
          `}
        </Script>
      </body>
    </html>
  );
}
