import { Sidebar } from '@/components/layout/sidebar'

export default function BuyerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar userRole="buyer" />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
