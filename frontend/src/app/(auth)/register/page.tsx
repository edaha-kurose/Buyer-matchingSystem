'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  FileText,
  Eye,
  EyeOff,
  ArrowRight,
  ChevronLeft,
  Check,
  Gift
} from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    companyName: '',
    userType: 'supplier' as 'buyer' | 'supplier',
    agreeTerms: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // バリデーション
    if (formData.password !== formData.confirmPassword) {
      setError('パスワードが一致しません')
      return
    }

    if (formData.password.length < 8) {
      setError('パスワードは8文字以上で設定してください')
      return
    }

    if (!formData.agreeTerms) {
      setError('利用規約に同意してください')
      return
    }

    setIsLoading(true)

    // デモ用: 実際のAPI呼び出しは省略
    await new Promise(resolve => setTimeout(resolve, 1500))

    // ユーザータイプに応じてリダイレクト
    if (formData.userType === 'supplier') {
      router.push('/supplier/dashboard')
    } else {
      router.push('/buyer/dashboard')
    }
    
    setIsLoading(false)
  }

  const passwordStrength = () => {
    const { password } = formData
    if (!password) return { level: 0, text: '' }
    if (password.length < 8) return { level: 1, text: '弱い' }
    if (password.length < 12) return { level: 2, text: '普通' }
    return { level: 3, text: '強い' }
  }

  const strength = passwordStrength()

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left Panel - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24 py-12">
        <div className="w-full max-w-md mx-auto">
          {/* Back Link */}
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors mb-8"
          >
            <ChevronLeft className="w-4 h-4" />
            トップに戻る
          </Link>

          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-800">AIスクリーニング</span>
          </div>

          <h1 className="text-2xl font-bold text-slate-800 mb-2">新規登録</h1>
          <p className="text-slate-600 mb-8">アカウントを作成して始めましょう</p>

          {/* User Type Toggle */}
          <div className="flex p-1 bg-slate-100 rounded-lg mb-6">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, userType: 'supplier' }))}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                formData.userType === 'supplier' 
                  ? 'bg-white text-slate-800 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              サプライヤー
            </button>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, userType: 'buyer' }))}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                formData.userType === 'buyer' 
                  ? 'bg-white text-slate-800 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              バイヤー
            </button>
          </div>

          {/* Supplier Welcome Bonus */}
          {formData.userType === 'supplier' && (
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-teal-50 to-teal-100 rounded-xl mb-6">
              <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center">
                <Gift className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-teal-800">新規登録ボーナス</p>
                <p className="text-sm text-teal-600">今なら<strong>300ポイント</strong>（1提案分）をプレゼント！</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  お名前
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="山田 太郎"
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  会社名
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="株式会社〇〇"
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                メールアドレス
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@company.com"
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                パスワード
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="8文字以上"
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {formData.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3].map((level) => (
                      <div 
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          strength.level >= level 
                            ? level === 1 ? 'bg-red-400' : level === 2 ? 'bg-amber-400' : 'bg-green-400'
                            : 'bg-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs ${
                    strength.level === 1 ? 'text-red-600' : 
                    strength.level === 2 ? 'text-amber-600' : 'text-green-600'
                  }`}>
                    パスワード強度: {strength.text}
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                パスワード（確認）
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="パスワードを再入力"
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              {formData.confirmPassword && formData.password === formData.confirmPassword && (
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <Check className="w-3 h-3" /> パスワードが一致しました
                </p>
              )}
            </div>

            <div className="flex items-start gap-2">
              <input 
                type="checkbox" 
                id="agreeTerms"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                className="w-4 h-4 mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
              />
              <label htmlFor="agreeTerms" className="text-sm text-slate-600">
                <Link href="/terms" className="text-blue-600 hover:text-blue-700">利用規約</Link>
                および
                <Link href="/privacy" className="text-blue-600 hover:text-blue-700">プライバシーポリシー</Link>
                に同意します
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  アカウント作成中...
                </>
              ) : (
                <>
                  アカウントを作成
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-slate-600">
            既にアカウントをお持ちの方は{' '}
            <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              ログイン
            </Link>
          </p>
        </div>
      </div>

      {/* Right Panel - Illustration */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-teal-600 to-teal-700 items-center justify-center p-12">
        <div className="max-w-md text-white">
          <h2 className="text-3xl font-bold mb-4">
            {formData.userType === 'supplier' 
              ? '提案チャンスを最大化' 
              : 'AIで提案受付を効率化'}
          </h2>
          <p className="text-teal-100 mb-8">
            {formData.userType === 'supplier' 
              ? 'ポイント制で手軽に提案。AI評価であなたの提案品質をフィードバック。採用率を高めるヒントが得られます。'
              : '面倒な提案対応をAIが自動化。信頼性チェック済みのサマリーで、本当に価値のある提案だけに時間を使えます。'}
          </p>
          <div className="space-y-4">
            {formData.userType === 'supplier' ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">📝</div>
                  <span>1提案300ptで手軽に提案</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">🤖</div>
                  <span>AI評価でフィードバック</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">💬</div>
                  <span>バイヤーと直接やり取り</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">📊</div>
                  <span>進捗をリアルタイム追跡</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">⏱️</div>
                  <span>提案対応時間80%削減</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">✅</div>
                  <span>AIファクトチェック機能</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">📋</div>
                  <span>3行サマリーで即座に判断</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">🔍</div>
                  <span>条件に合う提案を自動抽出</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
