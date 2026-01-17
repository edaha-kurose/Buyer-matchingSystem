'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Plus, 
  Search, 
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageSquare,
  TrendingUp,
  ChevronRight,
  FileText
} from 'lucide-react'

// ダミーデータ
const proposals = [
  { 
    id: 1, 
    title: 'クラウドセキュリティソリューション提案', 
    status: 'under_review', 
    buyer: 'ABC株式会社',
    buyerContact: '田中部長',
    date: '2026/01/15',
    updatedAt: '2026/01/16 14:30',
    score: 85,
    comments: 3,
    pointsUsed: 300
  },
  { 
    id: 2, 
    title: 'AI-OCRシステム導入提案', 
    status: 'ai_evaluated', 
    buyer: 'XYZ商事',
    buyerContact: '佐藤課長',
    date: '2026/01/14',
    updatedAt: '2026/01/15 10:00',
    score: 72,
    comments: 1,
    pointsUsed: 300
  },
  { 
    id: 3, 
    title: 'DXコンサルティングサービス', 
    status: 'submitted', 
    buyer: '123工業',
    buyerContact: null,
    date: '2026/01/13',
    updatedAt: '2026/01/13 16:45',
    score: null,
    comments: 0,
    pointsUsed: 300
  },
  { 
    id: 4, 
    title: 'ERPシステム刷新提案', 
    status: 'accepted', 
    buyer: 'DEF物流',
    buyerContact: '山本次長',
    date: '2026/01/10',
    updatedAt: '2026/01/14 09:00',
    score: 91,
    comments: 8,
    pointsUsed: 300
  },
  { 
    id: 5, 
    title: 'データ分析基盤構築', 
    status: 'rejected', 
    buyer: 'GHI製造',
    buyerContact: '鈴木部長',
    date: '2026/01/08',
    updatedAt: '2026/01/12 15:30',
    score: 45,
    comments: 2,
    pointsUsed: 300
  },
  { 
    id: 6, 
    title: 'IoTセンサー導入提案', 
    status: 'draft', 
    buyer: null,
    buyerContact: null,
    date: '2026/01/16',
    updatedAt: '2026/01/16 11:00',
    score: null,
    comments: 0,
    pointsUsed: 0
  },
]

const statusConfig: Record<string, { label: string; color: string; bgColor: string; icon: any }> = {
  draft: { label: '下書き', color: 'text-slate-600', bgColor: 'bg-slate-100', icon: FileText },
  submitted: { label: '提出済み', color: 'text-blue-600', bgColor: 'bg-blue-100', icon: Clock },
  ai_processing: { label: 'AI処理中', color: 'text-amber-600', bgColor: 'bg-amber-100', icon: Clock },
  ai_evaluated: { label: 'AI評価完了', color: 'text-purple-600', bgColor: 'bg-purple-100', icon: AlertCircle },
  under_review: { label: '検討中', color: 'text-teal-600', bgColor: 'bg-teal-100', icon: AlertCircle },
  accepted: { label: '採用', color: 'text-green-600', bgColor: 'bg-green-100', icon: CheckCircle },
  rejected: { label: '不採用', color: 'text-red-600', bgColor: 'bg-red-100', icon: XCircle },
}

const statusFilters = [
  { value: 'all', label: 'すべて' },
  { value: 'active', label: '進行中' },
  { value: 'draft', label: '下書き' },
  { value: 'accepted', label: '採用' },
  { value: 'rejected', label: '不採用' },
]

export default function ProposalsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredProposals = proposals.filter(p => {
    if (searchQuery && !p.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    if (statusFilter === 'all') return true
    if (statusFilter === 'active') {
      return ['submitted', 'ai_processing', 'ai_evaluated', 'under_review'].includes(p.status)
    }
    return p.status === statusFilter
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">提案管理</h1>
          <p className="text-slate-600">提出した提案の進捗状況を確認・管理できます</p>
        </div>
        <Link
          href="/supplier/proposals/new"
          className="inline-flex items-center justify-center gap-2 bg-teal-600 text-white px-4 py-2.5 rounded-lg hover:bg-teal-700 transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          新規提案を作成
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="提案を検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
          {statusFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setStatusFilter(filter.value)}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors
                ${statusFilter === filter.value 
                  ? 'bg-teal-600 text-white' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}
              `}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Proposals List */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {filteredProposals.length === 0 ? (
          <div className="p-8 text-center">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600">該当する提案がありません</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredProposals.map((proposal) => {
              const status = statusConfig[proposal.status] || statusConfig.draft
              const StatusIcon = status.icon
              return (
                <Link
                  key={proposal.id}
                  href={`/supplier/proposals/${proposal.id}`}
                  className="block p-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.color} ${status.bgColor}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {status.label}
                        </span>
                        {proposal.score && (
                          <span className="inline-flex items-center gap-1 text-sm">
                            <TrendingUp className="w-4 h-4 text-slate-400" />
                            <span className={`font-medium ${
                              proposal.score >= 80 ? 'text-green-600' :
                              proposal.score >= 60 ? 'text-amber-600' : 'text-red-600'
                            }`}>
                              スコア {proposal.score}
                            </span>
                          </span>
                        )}
                      </div>
                      <h3 className="font-medium text-slate-800 mb-1">{proposal.title}</h3>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                        {proposal.buyer && (
                          <span>提案先: {proposal.buyer}</span>
                        )}
                        {proposal.buyerContact && (
                          <span>担当: {proposal.buyerContact}</span>
                        )}
                        <span>提出日: {proposal.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {proposal.comments > 0 && (
                        <div className="flex items-center gap-1 text-slate-500">
                          <MessageSquare className="w-4 h-4" />
                          <span className="text-sm">{proposal.comments}</span>
                        </div>
                      )}
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="flex items-center justify-between text-sm text-slate-500">
        <span>{filteredProposals.length} 件の提案</span>
        <span>合計使用ポイント: {proposals.filter(p => p.status !== 'draft').reduce((sum, p) => sum + p.pointsUsed, 0).toLocaleString()} pt</span>
      </div>
    </div>
  )
}
