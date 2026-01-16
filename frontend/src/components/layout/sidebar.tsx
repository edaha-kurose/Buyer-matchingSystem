'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  FileText, 
  CheckSquare, 
  Settings, 
  LogOut,
  ChevronLeft,
  Menu
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarProps {
  userRole?: 'buyer' | 'supplier'
}

const buyerMenuItems = [
  { href: '/buyer/dashboard', label: 'ダッシュボード', icon: Home },
  { href: '/buyer/proposals', label: '提案一覧', icon: FileText },
  { href: '/buyer/evaluations', label: '評価結果', icon: CheckSquare },
  { href: '/buyer/settings', label: '設定', icon: Settings },
]

const supplierMenuItems = [
  { href: '/supplier/dashboard', label: 'ダッシュボード', icon: Home },
  { href: '/supplier/submissions', label: '提案管理', icon: FileText },
  { href: '/supplier/qa', label: 'Q&A', icon: CheckSquare },
  { href: '/supplier/settings', label: '設定', icon: Settings },
]

export function Sidebar({ userRole = 'buyer' }: SidebarProps) {
  const pathname = usePathname()
  const menuItems = userRole === 'buyer' ? buyerMenuItems : supplierMenuItems

  return (
    <aside className="w-64 bg-white border-r border-border h-screen sticky top-0 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-text">AIスクリーニング</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-text-muted hover:bg-muted hover:text-text'
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-border">
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-muted hover:bg-muted hover:text-text transition-colors w-full">
          <LogOut className="w-5 h-5" />
          ログアウト
        </button>
      </div>
    </aside>
  )
}
