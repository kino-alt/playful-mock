import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google' // フォントをインポート
import './globals.css'
import { MSWProvider } from '@/src/components/MSWProvider'

// フォントの設定
const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export const metadata: Metadata = {
  title: 'Emoji Discussion Game',
  description: 'Guess the topic from emoji hints in this multiplayer game',
  generator: 'v0.app',
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      {/* className にフォント変数を追加し、
        MSWProvider がマウントされる前でもスタイルが当たるようにします 
      */}
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <MSWProvider>
          {children}
        </MSWProvider>
      </body>
    </html>
  )
}