'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Bell, User } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface HeaderProps {
  title: string
  showBackButton?: boolean
  backHref?: string
}

export function Header({ title, showBackButton = false, backHref }: HeaderProps) {
  const router = useRouter()

  const handleBack = () => {
    if (backHref) {
      router.push(backHref)
    } else {
      router.back()
    }
  }

  return (
    <header className="h-16 bg-white border-b border-border px-6 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-4">
        {showBackButton && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="hover:bg-muted"
            aria-label="戻る"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
        )}
        <h1 className="text-xl font-semibold text-text">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5 text-text-muted" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-rose rounded-full" />
        </Button>
        <Button variant="ghost" size="icon">
          <User className="w-5 h-5 text-text-muted" />
        </Button>
      </div>
    </header>
  )
}
