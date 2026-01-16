/** @type {import('next').NextConfig} */
const nextConfig = {
  // 出力設定
  output: 'standalone',
  
  // 画像最適化
  images: {
    domains: ['localhost'],
  },
  
  // 環境変数
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'AIプレゼン自動スクリーニング',
  },
}

export default nextConfig
