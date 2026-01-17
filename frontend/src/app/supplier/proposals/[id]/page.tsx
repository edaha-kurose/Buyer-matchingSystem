'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  ChevronLeft,
  Clock,
  CheckCircle,
  MessageSquare,
  FileText,
  TrendingUp,
  Send,
  Building2,
  User,
  Calendar,
  ArrowRight,
  Shield,
  AlertTriangle
} from 'lucide-react'

// ダミーデータ
const proposal = {
  id: 1,
  title: 'クラウドセキュリティソリューション提案',
  description: '御社のクラウド環境におけるセキュリティ強化を目的とした包括的なソリューションをご提案いたします。ゼロトラストアーキテクチャの導入により、社内外からのアクセスを適切に制御し、情報漏洩リスクを大幅に低減します。',
  status: 'under_review',
  buyer: {
    company: 'ABC株式会社',
    contact: '田中部長',
    department: '情報システム部'
  },
  dates: {
    created: '2026/01/15',
    submitted: '2026/01/15 10:30',
    lastUpdated: '2026/01/16 14:30'
  },
  pointsUsed: 300,
  evaluation: {
    overallScore: 85,
    reliabilityRank: 'A',
    summary: '本提案は、具体的な導入実績と数値に基づいた効果予測が示されており、信頼性の高い内容となっています。特にセキュリティ対策のアプローチは業界標準に沿っており、実現可能性が高いと評価されます。',
    keyPoints: [
      { category: '技術的実現性', score: 88, note: '提案技術は実績があり実現性が高い' },
      { category: 'コスト妥当性', score: 82, note: '市場価格と比較して適正' },
      { category: '提案内容の具体性', score: 90, note: '導入スケジュールが明確' },
      { category: '会社信頼性', score: 78, note: '類似案件の実績あり' },
    ],
    factCheck: {
      companyRegistration: { status: 'verified', note: '法人登記確認済み' },
      claims: [
        { claim: '導入実績50社以上', status: 'verified', note: 'ウェブサイト・プレスリリースで確認' },
        { claim: 'コスト30%削減', status: 'unverified', note: '根拠資料の提出が推奨' },
      ]
    }
  }
}

const progressHistory = [
  { status: 'under_review', label: 'バイヤー検討中', date: '2026/01/16 14:30', note: 'ABC株式会社 田中部長が提案を確認中です', by: 'システム' },
  { status: 'ai_evaluated', label: 'AI評価完了', date: '2026/01/15 12:00', note: 'AIによる評価が完了しました（スコア: 85）', by: 'AI' },
  { status: 'submitted', label: '提案提出', date: '2026/01/15 10:30', note: '提案を提出しました', by: '山田太郎' },
]

const comments = [
  { 
    id: 1, 
    content: 'ご提案ありがとうございます。導入スケジュールについて詳しくお聞かせください。特に、既存システムとの連携期間はどの程度を想定されていますか？',
    user: '田中部長',
    role: 'buyer',
    date: '2026/01/16 14:30'
  },
  { 
    id: 2, 
    content: 'お問い合わせありがとうございます。既存システムとの連携については、通常2-3週間程度を想定しております。詳細なスケジュールは添付の資料をご確認ください。',
    user: '山田太郎',
    role: 'supplier',
    date: '2026/01/16 15:45'
  },
  { 
    id: 3, 
    content: '承知しました。来週の社内会議で検討させていただきます。追加の質問がある場合は改めてご連絡いたします。',
    user: '田中部長',
    role: 'buyer',
    date: '2026/01/16 16:00'
  },
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

export default function ProposalDetailPage() {
  const [newComment, setNewComment] = useState('')
  const [activeTab, setActiveTab] = useState<'overview' | 'evaluation' | 'comments' | 'progress'>('overview')

  const status = statusConfig[proposal.status] || statusConfig.draft

  const handleSubmitComment = () => {
    if (!newComment.trim()) return
    alert(`コメントを送信しました: ${newComment}`)
    setNewComment('')
  }

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link 
        href="/supplier/proposals"
        className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        提案一覧に戻る
      </Link>

      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${status.color} ${status.bgColor}`}>
                {status.label}
              </span>
              {proposal.evaluation && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                  <TrendingUp className="w-4 h-4" />
                  スコア {proposal.evaluation.overallScore}
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">{proposal.title}</h1>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500">
              <span className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4" />
                {proposal.buyer.company}
              </span>
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                {proposal.buyer.contact}（{proposal.buyer.department}）
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                提出: {proposal.dates.submitted}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500">使用ポイント</p>
            <p className="text-xl font-bold text-slate-800">{proposal.pointsUsed} pt</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex gap-4 overflow-x-auto">
          {[
            { id: 'overview', label: '概要', icon: FileText },
            { id: 'evaluation', label: 'AI評価', icon: TrendingUp },
            { id: 'comments', label: `コメント (${comments.length})`, icon: MessageSquare },
            { id: 'progress', label: '進捗履歴', icon: Clock },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm whitespace-nowrap transition-colors
                ${activeTab === tab.id 
                  ? 'border-teal-600 text-teal-600' 
                  : 'border-transparent text-slate-500 hover:text-slate-700'}
              `}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="font-semibold text-slate-800 mb-4">提案内容</h2>
              <p className="text-slate-600 whitespace-pre-wrap">{proposal.description}</p>
              
              <div className="mt-6 pt-6 border-t border-slate-200">
                <h3 className="font-medium text-slate-800 mb-3">添付資料</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <FileText className="w-5 h-5 text-slate-400" />
                    <span className="text-sm text-slate-700">提案資料_v1.pdf</span>
                    <span className="text-xs text-slate-500">2.4 MB</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <FileText className="w-5 h-5 text-slate-400" />
                    <span className="text-sm text-slate-700">費用見積書.xlsx</span>
                    <span className="text-xs text-slate-500">156 KB</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Evaluation Tab */}
          {activeTab === 'evaluation' && proposal.evaluation && (
            <div className="space-y-4">
              {/* Summary */}
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-slate-800">AI評価サマリー</h2>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                    proposal.evaluation.reliabilityRank === 'A' ? 'bg-green-100 text-green-700' :
                    proposal.evaluation.reliabilityRank === 'B' ? 'bg-blue-100 text-blue-700' :
                    proposal.evaluation.reliabilityRank === 'C' ? 'bg-amber-100 text-amber-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    信頼度ランク: {proposal.evaluation.reliabilityRank}
                  </span>
                </div>
                <p className="text-slate-600">{proposal.evaluation.summary}</p>
              </div>

              {/* Score Breakdown */}
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="font-semibold text-slate-800 mb-4">評価スコア詳細</h2>
                <div className="space-y-4">
                  {proposal.evaluation.keyPoints.map((point, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-700">{point.category}</span>
                        <span className={`font-bold ${
                          point.score >= 80 ? 'text-green-600' :
                          point.score >= 60 ? 'text-amber-600' : 'text-red-600'
                        }`}>
                          {point.score}
                        </span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            point.score >= 80 ? 'bg-green-500' :
                            point.score >= 60 ? 'bg-amber-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${point.score}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{point.note}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fact Check */}
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  ファクトチェック結果
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-slate-800">法人登記確認済み</p>
                      <p className="text-xs text-slate-500">{proposal.evaluation.factCheck.companyRegistration.note}</p>
                    </div>
                  </div>
                  {proposal.evaluation.factCheck.claims.map((claim, i) => (
                    <div 
                      key={i}
                      className={`flex items-center gap-3 p-3 rounded-lg ${
                        claim.status === 'verified' ? 'bg-green-50' : 'bg-amber-50'
                      }`}
                    >
                      {claim.status === 'verified' 
                        ? <CheckCircle className="w-5 h-5 text-green-600" />
                        : <AlertTriangle className="w-5 h-5 text-amber-600" />
                      }
                      <div>
                        <p className="text-sm font-medium text-slate-800">{claim.claim}</p>
                        <p className="text-xs text-slate-500">{claim.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Comments Tab */}
          {activeTab === 'comments' && (
            <div className="bg-white rounded-xl border border-slate-200">
              <div className="p-4 border-b border-slate-200">
                <h2 className="font-semibold text-slate-800">コメント</h2>
              </div>
              <div className="divide-y divide-slate-100">
                {comments.map((comment) => (
                  <div key={comment.id} className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        comment.role === 'buyer' ? 'bg-blue-100' : 'bg-teal-100'
                      }`}>
                        <User className={`w-5 h-5 ${
                          comment.role === 'buyer' ? 'text-blue-600' : 'text-teal-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-slate-800">{comment.user}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            comment.role === 'buyer' ? 'bg-blue-100 text-blue-600' : 'bg-teal-100 text-teal-600'
                          }`}>
                            {comment.role === 'buyer' ? 'バイヤー' : 'サプライヤー'}
                          </span>
                          <span className="text-xs text-slate-500">{comment.date}</span>
                        </div>
                        <p className="text-slate-600">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-slate-200">
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="コメントを入力..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <button
                    onClick={handleSubmitComment}
                    className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Progress Tab */}
          {activeTab === 'progress' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="font-semibold text-slate-800 mb-6">進捗履歴</h2>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200" />
                <div className="space-y-6">
                  {progressHistory.map((item, i) => (
                    <div key={i} className="relative flex gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                        i === 0 ? 'bg-teal-600' : 'bg-slate-200'
                      }`}>
                        <Clock className={`w-4 h-4 ${i === 0 ? 'text-white' : 'text-slate-500'}`} />
                      </div>
                      <div className="flex-1 pb-6">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-slate-800">{item.label}</span>
                          <span className="text-xs text-slate-500">{item.date}</span>
                        </div>
                        <p className="text-sm text-slate-600">{item.note}</p>
                        <p className="text-xs text-slate-400 mt-1">By: {item.by}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Quick Info */}
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h3 className="font-semibold text-slate-800 mb-4">提案情報</h3>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm text-slate-500">ステータス</dt>
                <dd className={`font-medium ${status.color}`}>{status.label}</dd>
              </div>
              <div>
                <dt className="text-sm text-slate-500">提出日時</dt>
                <dd className="font-medium text-slate-800">{proposal.dates.submitted}</dd>
              </div>
              <div>
                <dt className="text-sm text-slate-500">最終更新</dt>
                <dd className="font-medium text-slate-800">{proposal.dates.lastUpdated}</dd>
              </div>
              <div>
                <dt className="text-sm text-slate-500">使用ポイント</dt>
                <dd className="font-medium text-slate-800">{proposal.pointsUsed} pt</dd>
              </div>
            </dl>
          </div>

          {/* Contact Info */}
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h3 className="font-semibold text-slate-800 mb-4">提案先情報</h3>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm text-slate-500">会社名</dt>
                <dd className="font-medium text-slate-800">{proposal.buyer.company}</dd>
              </div>
              <div>
                <dt className="text-sm text-slate-500">部署</dt>
                <dd className="font-medium text-slate-800">{proposal.buyer.department}</dd>
              </div>
              <div>
                <dt className="text-sm text-slate-500">担当者</dt>
                <dd className="font-medium text-slate-800">{proposal.buyer.contact}</dd>
              </div>
            </dl>
          </div>

          {/* Next Steps */}
          {proposal.status === 'under_review' && (
            <div className="bg-teal-50 rounded-xl p-4">
              <h3 className="font-semibold text-teal-800 mb-2">次のステップ</h3>
              <p className="text-sm text-teal-700 mb-3">
                バイヤー様が提案を検討中です。コメントで追加情報を提供することで、採用の可能性が高まります。
              </p>
              <button 
                onClick={() => setActiveTab('comments')}
                className="text-sm text-teal-700 font-medium flex items-center gap-1 hover:text-teal-800"
              >
                コメントを追加
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
