import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

export function formatDateTime(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function getTrustRankColor(rank: string): string {
  switch (rank) {
    case 'A':
      return 'trust-rank-a'
    case 'B':
      return 'trust-rank-b'
    case 'C':
      return 'trust-rank-c'
    case 'D':
      return 'trust-rank-d'
    default:
      return ''
  }
}

export function getTrustRankLabel(rank: string): string {
  switch (rank) {
    case 'A':
      return '高信頼'
    case 'B':
      return '中信頼'
    case 'C':
      return '低信頼'
    case 'D':
      return '要注意'
    default:
      return ''
  }
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    draft: '下書き',
    submitted: '提出済み',
    analyzing: '解析中',
    qa_pending: 'Q&A待ち',
    qa_completed: 'Q&A完了',
    evaluated: '評価完了',
    accepted: '採用',
    rejected: '不採用',
    candidate: '採用候補',
    consider: '検討',
    hold: '保留',
  }
  return labels[status] || status
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'accepted':
    case 'candidate':
      return 'badge-success'
    case 'rejected':
      return 'badge-error'
    case 'hold':
    case 'qa_pending':
      return 'badge-warning'
    default:
      return 'badge-info'
  }
}
