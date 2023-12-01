import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from './Providers'
import NavBar from '../components/NavBar'
import StarBackground from "@/components/StarBackground";

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Dream Oracles',
  description: 'Application using AI to interpret dreams',
}

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      <NavBar>
            {children}
        </NavBar>
    </AuthProvider>
  )
}
