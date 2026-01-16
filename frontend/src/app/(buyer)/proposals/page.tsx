'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  FileText, 
  Search,
  Filter,
  ArrowRight,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react'
import Link from 'next/link'
import { cn, getStatusLabel, getStatusColor, getTrustRankColor } from '@/lib/utils'

// ダミーデータ
const proposals = [
  {
    id: 1,
    title: '新型IoTセンサーの提案',
    company: 'ABC株式会社',
    description: '製造現場向けIoTセンサー。従来比30%のコスト削減を実現。',
    trustRank: 'A',
    trustScore: 87,
    totalScore: 87,
    status: 'candidate',
    createdAt: '2026-01-15',
  },
  {
    id: 2,
    title: 'クラウド監視サービス',
    company: 'XYZ Technologies',
    description: '24時間365日の監視体制。異常検知から通知まで自動化。',
    trustRank: 'B',
    trustScore: 72,
    totalScore: 75,
    status: 'consider',
    createdAt: '2026-01-14',
  },
  {
    id: 3,
    title: '製造ライン自動化システム',
    company: 'テック工業',
    description: '最新AI技術による品質検査自動化。不良率90%削減実績。',
    trustRank: 'A',
    trustScore: 91,
    totalScore: 92,
    status: 'candidate',
    createdAt: '2026-01-13',
  },
  {
    id: 4,
    title: '物流最適化ソリューション',
    company: 'ロジスティクス社',
    description: '配送ルート最適化による配送コスト20%削減。',
    trustRank: 'C',
    trustScore: 58,
    totalScore: 62,
    status: 'hold',
    createdAt: '2026-01-12',
  },
  {
    id: 5,
    title: 'ERPシステム導入支援',
    company: 'システム開発株式会社',
    description: '業務効率化のためのERP導入コンサルティング。',
    trustRank: 'B',
    trustScore: 78,
    totalScore: 80,
    status: 'qa_pending',
    createdAt: '2026-01-11',
  },
]

const statusFilters = [
  { value: 'all', label: 'すべて' },
  { value: 'candidate', label: '採用候補' },
  { value: 'consider', label: '検討' },
  { value: 'hold', label: '保留' },
  { value: 'qa_pending', label: 'Q&A待ち' },
]

export default function ProposalsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredProposals = proposals.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.company.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="min-h-screen">
      <Header title="提案一覧" />
      
      <div className="p-6 space-y-6">
        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-subtle" />
            <input
              type="text"
              placeholder="提案名、会社名で検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
            {statusFilters.map((filter) => (
              <Button
                key={filter.value}
                variant={statusFilter === filter.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter(filter.value)}
                className="whitespace-nowrap"
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Proposals List */}
        <div className="space-y-4">
          {filteredProposals.map((proposal) => (
            <Link 
              key={proposal.id}
              href={`/buyer/proposals/${proposal.id}`}
            >
              <Card className="card-hover cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <FileText className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-text">{proposal.title}</h3>
                          <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', getStatusColor(proposal.status))}>
                            {getStatusLabel(proposal.status)}
                          </span>
                        </div>
                        <p className="text-sm text-text-muted mt-1">{proposal.company}</p>
                        <p className="text-sm text-text-subtle mt-2 line-clamp-2">{proposal.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 lg:gap-8">
                      {/* Trust Rank */}
                      <div className="text-center">
                        <div className={cn(
                          'w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold',
                          getTrustRankColor(proposal.trustRank)
                        )}>
                          {proposal.trustRank}
                        </div>
                        <p className="text-xs text-text-subtle mt-1">信頼度</p>
                      </div>
                      
                      {/* Score */}
                      <div className="text-center">
                        <div className="text-2xl font-bold text-text">{proposal.totalScore}</div>
                        <p className="text-xs text-text-subtle">スコア</p>
                      </div>
                      
                      <ArrowRight className="w-5 h-5 text-text-subtle hidden lg:block" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {filteredProposals.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-text-subtle mx-auto mb-4" />
            <h3 className="text-lg font-medium text-text mb-2">提案が見つかりません</h3>
            <p className="text-text-muted">検索条件を変更してお試しください</p>
          </div>
        )}
      </div>
    </div>
  )
}
