# AIプレゼン自動スクリーニングシステム

サプライヤーからの提案を自動的にスクリーニングし、バイヤーの提案受付業務を効率化するAIシステムです。

## 🚀 特徴

- **📄 資料自動解析**: PDF、PowerPoint、Wordの資料をAIが解析
- **🔍 ファクトチェック**: 法人情報、数値データを客観的に検証
- **📋 要約レポート**: 3行サマリー + 重要ポイント + 確認事項
- **⚡ 80%時間削減**: 提案受付業務の効率化
- **💰 94%コスト削減**: 1件あたり¥8,000→¥445

## 🛠 技術スタック

### フロントエンド
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui
- TanStack Query
- Zustand

### バックエンド
- FastAPI (Python 3.11+)
- SQLAlchemy 2.0
- PostgreSQL 15
- Redis 7

### AI/ML
- OpenAI GPT-4o
- LangChain

### インフラ
- Docker + Docker Compose
- MinIO (S3互換ストレージ)

## 📁 プロジェクト構成

```
ai-screening-system/
├── frontend/               # Next.js フロントエンド
│   ├── src/
│   │   ├── app/           # App Router ページ
│   │   ├── components/    # UIコンポーネント
│   │   ├── hooks/         # カスタムフック
│   │   └── lib/           # ユーティリティ
│   └── package.json
│
├── backend/               # FastAPI バックエンド
│   ├── app/
│   │   ├── api/          # APIエンドポイント
│   │   ├── models/       # DBモデル
│   │   ├── schemas/      # Pydanticスキーマ
│   │   └── services/     # ビジネスロジック
│   └── requirements.txt
│
├── docs/                  # ドキュメント
│   └── 提案資料*.md
│
├── docker-compose.yml     # Docker設定
└── README.md
```

## 🚀 セットアップ

### 前提条件
- Docker & Docker Compose
- Node.js 20+
- Python 3.11+

### 1. リポジトリのクローン
```bash
git clone https://github.com/edaha-kurose/Buyer-matchingSystem.git
cd Buyer-matchingSystem
```

### 2. 環境変数の設定
```bash
cp .env.example .env
# .envファイルを編集してAPIキーなどを設定
```

### 3. Dockerコンテナの起動
```bash
docker-compose up -d
```

### 4. アクセス
- フロントエンド: http://localhost:3000
- バックエンドAPI: http://localhost:8000
- API ドキュメント: http://localhost:8000/docs
- DB管理 (Adminer): http://localhost:8080

## 📝 開発

### フロントエンド開発
```bash
cd frontend
npm install
npm run dev
```

### バックエンド開発
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## 📚 ドキュメント

- [設計仕様書](./aiプレゼン自動スクリーニング_完全設計仕様.md)
- [提案資料](./docs/提案資料_AIプレゼン自動スクリーニング_共同開発のご提案.md)

## 📅 実装ロードマップ

| Phase | 期間 | 内容 |
|-------|------|------|
| Phase 0 | Week 1 | 環境構築 |
| Phase 1 | Week 2-3 | 認証・基本機能 |
| Phase 2 | Week 4-5 | 提案管理 |
| Phase 3 | Week 6-8 | AI処理・要約機能 |
| Phase 4 | Week 9-10 | Q&A・評価機能 |
| Phase 5 | Week 11-12 | 仕上げ・テスト |

## 📄 ライセンス

MIT License

## 👥 コントリビューション

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

© 2026 AIプレゼン自動スクリーニングシステム
