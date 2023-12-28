import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from './Providers'
import NavBar from '../components/NavBar'
import Head from 'next/head';


const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Dream Oracles',
  description: 'Application using AI to interpret dreams',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <AuthProvider>
            <NavBar />
            <div className="main-content">
              {children}
            </div>
        </AuthProvider>
        </body>
    </html>
  )
}
