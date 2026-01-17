import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AIプレゼン自動スクリーニングシステム',
  description: 'サプライヤーからの提案を自動的にスクリーニングし、バイヤーの提案受付業務を効率化するAIシステム',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  )
}
