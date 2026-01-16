'use client'

import Link from 'next/link'
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  ArrowRight,
  Shield,
  Zap
} from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-text">AIスクリーニング</span>
            </div>
            <nav className="flex items-center gap-4">
              <Link 
                href="/login" 
                className="text-text-muted hover:text-text transition-colors"
              >
                ログイン
              </Link>
              <Link 
                href="/register" 
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
              >
                無料で始める
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary-50 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            提案受付業務を80%効率化
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-text mb-6 leading-tight">
            AIが提案を自動スクリーニング<br />
            <span className="text-primary">採用候補だけに集中</span>できる
          </h1>
          <p className="text-xl text-text-muted mb-10 max-w-2xl mx-auto">
            サプライヤーからの提案をAIが解析・評価。
            ファクトチェック付き要約レポートで、
            詳しく聞くべき提案が一目でわかります。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/register" 
              className="inline-flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary-dark transition-colors shadow-lg"
            >
              無料で始める
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/demo" 
              className="inline-flex items-center justify-center gap-2 bg-white text-primary border-2 border-primary px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary-50 transition-colors"
            >
              デモを見る
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-text mb-4">
            主な機能
          </h2>
          <p className="text-text-muted text-center mb-12 max-w-2xl mx-auto">
            AIが提案の受付から評価までを自動化。
            あなたは採用候補の検討に集中できます。
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-background-surface p-6 rounded-2xl shadow-card card-hover">
              <div className="w-12 h-12 bg-teal/10 rounded-xl flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-teal" />
              </div>
              <h3 className="text-xl font-semibold text-text mb-2">
                資料を自動解析
              </h3>
              <p className="text-text-muted">
                PDF、PowerPoint、Wordの資料をAIが解析。
                重要な情報を自動で抽出します。
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-background-surface p-6 rounded-2xl shadow-card card-hover">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-text mb-2">
                ファクトチェック
              </h3>
              <p className="text-text-muted">
                法人情報、数値データ、実績などを
                AIが客観的に検証。信頼度を可視化。
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-background-surface p-6 rounded-2xl shadow-card card-hover">
              <div className="w-12 h-12 bg-amber/10 rounded-xl flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-amber-dark" />
              </div>
              <h3 className="text-xl font-semibold text-text mb-2">
                要約レポート
              </h3>
              <p className="text-text-muted">
                3行サマリー + 重要ポイント + 確認事項。
                詳しく聞くべきかを即座に判断。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-primary">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-white mb-2">80%</div>
              <div className="text-primary-100">時間削減</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-white mb-2">94%</div>
              <div className="text-primary-100">コスト削減</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-white mb-2">24/7</div>
              <div className="text-primary-100">自動受付</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-text mb-4">
            今すぐ始めましょう
          </h2>
          <p className="text-text-muted mb-8">
            無料トライアルで実際の効果をお試しください
          </p>
          <Link 
            href="/register" 
            className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-primary-dark transition-colors shadow-lg"
          >
            無料で始める
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="max-w-6xl mx-auto text-center text-text-muted text-sm">
          © 2026 AIプレゼン自動スクリーニングシステム
        </div>
      </footer>
    </div>
  )
}
