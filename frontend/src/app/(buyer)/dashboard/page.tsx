'use client'

import { Header } from '@/components/layout/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  ArrowRight,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

// ダミーデータ
const stats = [
  { label: '新着提案', value: 12, icon: FileText, color: 'text-primary' },
  { label: '採用候補', value: 5, icon: CheckCircle, color: 'text-teal' },
  { label: 'Q&A待ち', value: 3, icon: Clock, color: 'text-amber-dark' },
  { label: '今月採用', value: 2, icon: TrendingUp, color: 'text-teal' },
]

const recentProposals = [
  {
    id: 1,
    title: '新型IoTセンサーの提案',
    company: 'ABC株式会社',
    trustRank: 'A',
    score: 87,
    status: 'candidate',
  },
  {
    id: 2,
    title: 'クラウド監視サービス',
    company: 'XYZ Technologies',
    trustRank: 'B',
    score: 72,
    status: 'consider',
  },
  {
    id: 3,
    title: '製造ライン自動化システム',
    company: 'テック工業',
    trustRank: 'A',
    score: 91,
    status: 'candidate',
  },
]

export default function BuyerDashboard() {
  return (
    <div className="min-h-screen">
      <Header title="ダッシュボード" />
      
      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="card-hover">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-text-muted">{stat.label}</p>
                    <p className="text-3xl font-bold text-text mt-1">{stat.value}</p>
                  </div>
                  <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center bg-muted', stat.color)}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Proposals */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>採用候補の提案</CardTitle>
            <Link href="/buyer/proposals">
              <Button variant="ghost" className="gap-2">
                すべて見る
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProposals.map((proposal) => (
                <Link 
                  key={proposal.id}
                  href={`/buyer/proposals/${proposal.id}`}
                  className="block"
                >
                  <div className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary hover:bg-primary-50/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium text-text">{proposal.title}</h4>
                        <p className="text-sm text-text-muted">{proposal.company}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className={cn(
                          'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
                          proposal.trustRank === 'A' ? 'bg-teal/10 text-teal' : 'bg-primary/10 text-primary'
                        )}>
                          信頼度 {proposal.trustRank}
                        </div>
                        <p className="text-sm text-text-muted mt-1">スコア: {proposal.score}点</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-text-subtle" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-text">Q&A待ちの提案があります</h3>
                  <p className="text-sm text-text-muted mt-1">
                    3件の提案でサプライヤーからの回答待ちです
                  </p>
                  <Link href="/buyer/proposals?status=qa_pending">
                    <Button variant="link" className="px-0 mt-2">
                      確認する →
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-teal/10 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-teal" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-text">条件設定を最適化しましょう</h3>
                  <p className="text-sm text-text-muted mt-1">
                    評価条件を調整して、より精度の高いスクリーニングを
                  </p>
                  <Link href="/buyer/settings">
                    <Button variant="link" className="px-0 mt-2">
                      設定を見る →
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
