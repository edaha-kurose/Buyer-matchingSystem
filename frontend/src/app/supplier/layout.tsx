'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  FileText, 
  Coins, 
  Bell,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
  X
} from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { name: 'ダッシュボード', href: '/supplier/dashboard', icon: LayoutDashboard },
  { name: '提案管理', href: '/supplier/proposals', icon: FileText },
  { name: 'ポイント管理', href: '/supplier/points', icon: Coins },
  { name: '通知', href: '/supplier/notifications', icon: Bell },
  { name: '設定', href: '/supplier/settings', icon: Settings },
]

export default function SupplierLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-slate-200
        transform transition-transform duration-200 ease-in-out
        lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200">
            <Link href="/supplier/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-slate-800">サプライヤー</span>
            </Link>
            <button 
              className="lg:hidden p-1 hover:bg-slate-100 rounded"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors
                    ${isActive 
                      ? 'bg-teal-50 text-teal-700 font-medium' 
                      : 'text-slate-600 hover:bg-slate-100'}
                  `}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* User section */}
          <div className="p-3 border-t border-slate-200">
            <div className="px-3 py-2 mb-2">
              <p className="text-sm font-medium text-slate-800">山田太郎</p>
              <p className="text-xs text-slate-500">supplier@example.com</p>
            </div>
            <Link
              href="/login"
              className="flex items-center gap-3 px-3 py-2.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              ログアウト
            </Link>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center gap-4">
              <button 
                className="lg:hidden p-2 hover:bg-slate-100 rounded-lg"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </button>
              <Link 
                href="/"
                className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="text-sm">トップに戻る</span>
              </Link>
            </div>
            <div className="flex items-center gap-3">
              {/* ポイント残高 */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-teal-50 text-teal-700 rounded-full">
                <Coins className="w-4 h-4" />
                <span className="font-medium">1,500 pt</span>
              </div>
              {/* 通知 */}
              <button className="relative p-2 hover:bg-slate-100 rounded-lg">
                <Bell className="w-5 h-5 text-slate-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
