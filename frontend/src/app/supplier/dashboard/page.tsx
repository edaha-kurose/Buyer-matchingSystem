'use client'

import Link from 'next/link'
import { 
  FileText, 
  Coins, 
  CheckCircle, 
  Clock,
  XCircle,
  ArrowRight,
  Plus,
  TrendingUp
} from 'lucide-react'

// ダミーデータ
const stats = {
  totalProposals: 12,
  activeProposals: 5,
  acceptedProposals: 3,
  rejectedProposals: 4,
  pointBalance: 1500,
}

const recentProposals = [
  { id: 1, title: 'クラウドセキュリティソリューション提案', status: 'under_review', buyer: 'ABC株式会社', date: '2026/01/15', score: 85 },
  { id: 2, title: 'AI-OCRシステム導入提案', status: 'ai_evaluated', buyer: 'XYZ商事', date: '2026/01/14', score: 72 },
  { id: 3, title: 'DXコンサルティングサービス', status: 'submitted', buyer: '123工業', date: '2026/01/13', score: null },
  { id: 4, title: 'ERPシステム刷新提案', status: 'accepted', buyer: 'DEF物流', date: '2026/01/10', score: 91 },
]

const statusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  draft: { label: '下書き', color: 'text-slate-600', bgColor: 'bg-slate-100' },
  submitted: { label: '提出済み', color: 'text-blue-600', bgColor: 'bg-blue-100' },
  ai_processing: { label: 'AI処理中', color: 'text-amber-600', bgColor: 'bg-amber-100' },
  ai_evaluated: { label: 'AI評価完了', color: 'text-purple-600', bgColor: 'bg-purple-100' },
  under_review: { label: '検討中', color: 'text-teal-600', bgColor: 'bg-teal-100' },
  accepted: { label: '採用', color: 'text-green-600', bgColor: 'bg-green-100' },
  rejected: { label: '不採用', color: 'text-red-600', bgColor: 'bg-red-100' },
}

export default function SupplierDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">ダッシュボード</h1>
          <p className="text-slate-600">提案の進捗状況とポイント残高を確認できます</p>
        </div>
        <Link
          href="/supplier/proposals/new"
          className="inline-flex items-center justify-center gap-2 bg-teal-600 text-white px-4 py-2.5 rounded-lg hover:bg-teal-700 transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          新規提案を作成
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-800">{stats.totalProposals}</p>
          <p className="text-sm text-slate-500">総提案数</p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-800">{stats.activeProposals}</p>
          <p className="text-sm text-slate-500">進行中</p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-800">{stats.acceptedProposals}</p>
          <p className="text-sm text-slate-500">採用</p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-800">{stats.rejectedProposals}</p>
          <p className="text-sm text-slate-500">不採用</p>
        </div>

        <div className="col-span-2 lg:col-span-1 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl p-4 text-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Coins className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold">{stats.pointBalance.toLocaleString()} pt</p>
          <p className="text-sm text-teal-100">ポイント残高</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Proposals */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200">
          <div className="flex items-center justify-between p-4 border-b border-slate-200">
            <h2 className="font-semibold text-slate-800">最近の提案</h2>
            <Link 
              href="/supplier/proposals" 
              className="text-sm text-teal-600 hover:text-teal-700 flex items-center gap-1"
            >
              すべて見る
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {recentProposals.map((proposal) => {
              const status = statusConfig[proposal.status] || statusConfig.draft
              return (
                <Link 
                  key={proposal.id}
                  href={`/supplier/proposals/${proposal.id}`}
                  className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-800 truncate">{proposal.title}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm text-slate-500">{proposal.buyer}</span>
                      <span className="text-sm text-slate-400">{proposal.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    {proposal.score && (
                      <div className="flex items-center gap-1 text-sm">
                        <TrendingUp className="w-4 h-4 text-slate-400" />
                        <span className="font-medium text-slate-700">{proposal.score}</span>
                      </div>
                    )}
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${status.color} ${status.bgColor}`}>
                      {status.label}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Quick Actions & Info */}
        <div className="space-y-4">
          {/* Point Info */}
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h3 className="font-semibold text-slate-800 mb-4">ポイント情報</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">現在の残高</span>
                <span className="font-bold text-slate-800">{stats.pointBalance.toLocaleString()} pt</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">提案1件あたり</span>
                <span className="font-medium text-slate-800">300 pt</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">残り提案可能数</span>
                <span className="font-medium text-teal-600">{Math.floor(stats.pointBalance / 300)} 件</span>
              </div>
            </div>
            <Link
              href="/supplier/points"
              className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-teal-50 text-teal-700 px-4 py-2.5 rounded-lg hover:bg-teal-100 transition-colors font-medium"
            >
              <Coins className="w-5 h-5" />
              ポイントを購入
            </Link>
          </div>

          {/* Tips */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
            <h3 className="font-semibold text-blue-800 mb-2">💡 ヒント</h3>
            <p className="text-sm text-blue-700">
              提案のAIスコアが80点以上の場合、バイヤーに優先的に表示されます。
              提案資料は具体的な数値や実績を含めると高評価になりやすいです。
            </p>
          </div>

          {/* Support */}
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h3 className="font-semibold text-slate-800 mb-2">サポート</h3>
            <p className="text-sm text-slate-600 mb-3">
              ご不明点やお困りのことがございましたらお気軽にお問い合わせください。
            </p>
            <button className="text-sm text-teal-600 hover:text-teal-700 font-medium">
              お問い合わせ →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
