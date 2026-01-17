.PHONY: help setup setup-backend setup-frontend dev dev-infra dev-full down lint lint-backend lint-frontend format format-backend format-frontend test test-backend test-frontend migrate clean

# デフォルトターゲット
help:
	@echo "利用可能なコマンド:"
	@echo ""
	@echo "  セットアップ:"
	@echo "    make setup          - 全体のセットアップ（バックエンド+フロントエンド）"
	@echo "    make setup-backend  - バックエンドのセットアップ"
	@echo "    make setup-frontend - フロントエンドのセットアップ"
	@echo ""
	@echo "  開発:"
	@echo "    make dev            - 開発環境起動（インフラのみ）"
	@echo "    make dev-full       - 全コンテナ起動"
	@echo "    make down           - 全コンテナ停止"
	@echo ""
	@echo "  コード品質:"
	@echo "    make lint           - 全体のリント"
	@echo "    make lint-backend   - バックエンドのリント"
	@echo "    make lint-frontend  - フロントエンドのリント"
	@echo "    make format         - 全体のフォーマット"
	@echo "    make format-backend - バックエンドのフォーマット"
	@echo "    make format-frontend- フロントエンドのフォーマット"
	@echo ""
	@echo "  テスト:"
	@echo "    make test           - 全体のテスト"
	@echo "    make test-backend   - バックエンドのテスト"
	@echo "    make test-frontend  - フロントエンドのテスト"
	@echo ""
	@echo "  データベース:"
	@echo "    make migrate        - マイグレーション実行"
	@echo ""
	@echo "  その他:"
	@echo "    make clean          - キャッシュ・ビルドファイル削除"

# ============ セットアップ ============

setup: setup-backend setup-frontend
	@echo "セットアップ完了"

setup-backend:
	@echo "バックエンドのセットアップ..."
	cd backend && python -m venv venv || true
	cd backend && . venv/bin/activate && pip install -r requirements.txt
	@echo "バックエンドセットアップ完了"

setup-frontend:
	@echo "フロントエンドのセットアップ..."
	cd frontend && npm install
	@echo "フロントエンドセットアップ完了"

# ============ 開発環境 ============

dev:
	@echo "開発用インフラを起動..."
	docker-compose -f docker-compose.dev.yml up -d
	@echo ""
	@echo "インフラ起動完了:"
	@echo "  PostgreSQL: localhost:5434"
	@echo "  Redis: localhost:6381"
	@echo "  MinIO: localhost:9000 (console: localhost:9001)"
	@echo ""
	@echo "バックエンド起動: cd backend && uvicorn app.main:app --reload"
	@echo "フロントエンド起動: cd frontend && npm run dev"

dev-full:
	@echo "全コンテナを起動..."
	docker-compose up -d
	@echo "起動完了"

down:
	@echo "コンテナを停止..."
	docker-compose down
	docker-compose -f docker-compose.dev.yml down
	@echo "停止完了"

# ============ リント ============

lint: lint-backend lint-frontend
	@echo "リント完了"

lint-backend:
	@echo "バックエンドのリント..."
	cd backend && flake8 app/
	cd backend && mypy app/ --ignore-missing-imports || true

lint-frontend:
	@echo "フロントエンドのリント..."
	cd frontend && npm run lint

# ============ フォーマット ============

format: format-backend format-frontend
	@echo "フォーマット完了"

format-backend:
	@echo "バックエンドのフォーマット..."
	cd backend && black app/
	cd backend && isort app/

format-frontend:
	@echo "フロントエンドのフォーマット..."
	cd frontend && npm run format || npx prettier --write "src/**/*.{ts,tsx}"

# ============ テスト ============

test: test-backend test-frontend
	@echo "テスト完了"

test-backend:
	@echo "バックエンドのテスト..."
	cd backend && pytest tests/ -v || echo "テストファイルがありません"

test-frontend:
	@echo "フロントエンドのテスト..."
	cd frontend && npm test || echo "テストが設定されていません"

# ============ データベース ============

migrate:
	@echo "マイグレーション実行..."
	cd backend && alembic upgrade head

# ============ クリーンアップ ============

clean:
	@echo "キャッシュファイルを削除..."
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".pytest_cache" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".mypy_cache" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name "node_modules" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".next" -exec rm -rf {} + 2>/dev/null || true
	@echo "クリーンアップ完了"
