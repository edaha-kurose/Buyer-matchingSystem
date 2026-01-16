# Backend Dockerfile
FROM python:3.11-slim

WORKDIR /app

# システム依存関係のインストール
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Pythonパッケージのインストール
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# アプリケーションコードのコピー
COPY . .

# ポート公開
EXPOSE 8000

# 起動コマンド
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
