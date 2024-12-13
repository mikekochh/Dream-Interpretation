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
  description: 'Turn your dreams into insights with our cutting-edge dream interpretation AI technology. Visualize your dreams and join the community of dreamers.',
  url: 'https://dreamoracles.co',
  robots: 'index, follow',
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
};


// 

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/icon.png" type="image/png" />
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
