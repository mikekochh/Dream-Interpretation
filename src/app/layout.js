import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from './Providers'
import NavBar from '../components/NavBar'
import Head from 'next/head';
import Script from 'next/script';
import { UserProvider } from '@/context/UserContext';
import StarBackground from '@/components/StarBackground';


const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Dream Oracles',
  description: 'Find out what your dreams mean using cutting-edge AI technology.',
  url: 'https://dreamoracles.co',
  robots: 'index, follow',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        
      </Head>
      <body>
        <AuthProvider>
          <UserProvider>
            <NavBar />
            <div className="main-content">
              <StarBackground>
                {children}
              </StarBackground>
            </div>
          </UserProvider>
        </AuthProvider>
      </body>
      <Script strategy="afterInteractive" src="https://www.googletagmanager.com/gtag/js?id=G-1TF2VESNGX"/>
      <Script strategy="afterInteractive" id="google-analytics">
        {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-1TF2VESNGX');
        `}
      </Script>

    </html>
  )
}
