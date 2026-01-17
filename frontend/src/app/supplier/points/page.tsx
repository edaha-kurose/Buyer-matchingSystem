'use client'

import { useState } from 'react'
import { 
  Coins, 
  CreditCard, 
  History,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Gift,
  Sparkles
} from 'lucide-react'

// ポイントパッケージ
const pointPackages = [
  { id: 1, name: 'スタートパック', points: 500, price: 500, bonus: 0, popular: false },
  { id: 2, name: 'スタンダード', points: 1000, price: 1000, bonus: 50, popular: false },
  { id: 3, name: 'プレミアム', points: 3000, price: 3000, bonus: 300, popular: true },
  { id: 4, name: 'ビジネス', points: 5000, price: 5000, bonus: 750, popular: false },
  { id: 5, name: 'エンタープライズ', points: 10000, price: 10000, bonus: 2000, popular: false },
]

// 取引履歴
const transactions = [
  { id: 1, type: 'purchase', amount: 3300, description: 'プレミアムパック購入', date: '2026/01/15 14:30', balance: 4800 },
  { id: 2, type: 'proposal', amount: -300, description: '提案提出: クラウドセキュリティソリューション', date: '2026/01/15 10:15', balance: 1500 },
  { id: 3, type: 'proposal', amount: -300, description: '提案提出: AI-OCRシステム導入', date: '2026/01/14 16:45', balance: 1800 },
  { id: 4, type: 'bonus', amount: 100, description: '新規登録ボーナス', date: '2026/01/10 09:00', balance: 2100 },
  { id: 5, type: 'purchase', amount: 2000, description: 'スタンダードパック購入', date: '2026/01/10 08:55', balance: 2000 },
]

export default function PointsPage() {
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null)
  const currentBalance = 1500

  const handlePurchase = () => {
    if (!selectedPackage) return
    const pkg = pointPackages.find(p => p.id === selectedPackage)
    alert(`${pkg?.name}（${pkg?.points}pt + ボーナス${pkg?.bonus}pt）を購入します。\n※デモのため実際の決済は行われません。`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">ポイント管理</h1>
        <p className="text-slate-600">ポイントの購入と利用履歴を確認できます</p>
      </div>

      {/* Current Balance */}
      <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-teal-100 mb-1">現在のポイント残高</p>
            <p className="text-4xl font-bold">{currentBalance.toLocaleString()} <span className="text-xl">pt</span></p>
            <p className="text-teal-100 mt-2">
              あと <span className="font-bold text-white">{Math.floor(currentBalance / 300)}</span> 件の提案が可能です
            </p>
          </div>
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
            <Coins className="w-8 h-8" />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Purchase Section */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            ポイントを購入
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pointPackages.map((pkg) => (
              <button
                key={pkg.id}
                onClick={() => setSelectedPackage(pkg.id)}
                className={`
                  relative text-left p-4 rounded-xl border-2 transition-all
                  ${selectedPackage === pkg.id 
                    ? 'border-teal-500 bg-teal-50' 
                    : 'border-slate-200 bg-white hover:border-slate-300'}
                `}
              >
                {pkg.popular && (
                  <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    人気
                  </span>
                )}
                <p className="font-semibold text-slate-800">{pkg.name}</p>
                <p className="text-2xl font-bold text-slate-800 mt-2">
                  {pkg.points.toLocaleString()} <span className="text-sm font-normal">pt</span>
                </p>
                {pkg.bonus > 0 && (
                  <p className="text-sm text-teal-600 flex items-center gap-1 mt-1">
                    <Gift className="w-4 h-4" />
                    +{pkg.bonus}pt ボーナス
                  </p>
                )}
                <p className="text-slate-600 mt-2">¥{pkg.price.toLocaleString()}</p>
                {selectedPackage === pkg.id && (
                  <CheckCircle className="absolute top-3 right-3 w-5 h-5 text-teal-600" />
                )}
              </button>
            ))}
          </div>

          {selectedPackage && (
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-slate-600">選択中のパッケージ</p>
                  <p className="font-semibold text-slate-800">
                    {pointPackages.find(p => p.id === selectedPackage)?.name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-slate-800">
                    ¥{pointPackages.find(p => p.id === selectedPackage)?.price.toLocaleString()}
                  </p>
                  <p className="text-sm text-teal-600">
                    {(pointPackages.find(p => p.id === selectedPackage)?.points || 0) + 
                     (pointPackages.find(p => p.id === selectedPackage)?.bonus || 0)} pt 獲得
                  </p>
                </div>
              </div>
              <button 
                onClick={handlePurchase}
                className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors"
              >
                購入手続きへ進む
              </button>
              <p className="text-xs text-slate-500 mt-2 text-center">
                ※ クレジットカード決済をご利用いただけます
              </p>
            </div>
          )}

          {/* Pricing Info */}
          <div className="bg-blue-50 rounded-xl p-4">
            <h3 className="font-semibold text-blue-800 mb-2">📌 ポイントについて</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• 1ポイント = 1円（税込）</li>
              <li>• 提案1件の提出に300ポイント必要です</li>
              <li>• まとめ買いでボーナスポイントが付きます</li>
              <li>• ポイントの有効期限は購入から1年間です</li>
            </ul>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="p-4 border-b border-slate-200">
            <h2 className="font-semibold text-slate-800 flex items-center gap-2">
              <History className="w-5 h-5" />
              取引履歴
            </h2>
          </div>
          <div className="max-h-[500px] overflow-y-auto">
            {transactions.map((tx) => (
              <div key={tx.id} className="p-4 border-b border-slate-100 last:border-0">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      tx.amount > 0 ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {tx.amount > 0 
                        ? <ArrowUpRight className="w-4 h-4 text-green-600" />
                        : <ArrowDownRight className="w-4 h-4 text-red-600" />
                      }
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800 line-clamp-1">
                        {tx.description}
                      </p>
                      <p className="text-xs text-slate-500">{tx.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      tx.amount > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()} pt
                    </p>
                    <p className="text-xs text-slate-500">残高: {tx.balance.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-slate-200">
            <button className="w-full text-center text-sm text-teal-600 hover:text-teal-700 font-medium py-2">
              すべての履歴を見る
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
