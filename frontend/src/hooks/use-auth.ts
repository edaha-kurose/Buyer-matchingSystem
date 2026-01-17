/**
 * 認証カスタムフック
 */
'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { apiPost, apiGet, apiPostForm, setAccessToken, clearAccessToken, getAccessToken } from '@/lib/api-client'
import type { User, UserCreate, Token, LoginRequest } from '@/types/api'

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null
}

export function useAuth() {
  const router = useRouter()
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  })

  // 初期化時にユーザー情報を取得
  useEffect(() => {
    const initAuth = async () => {
      const token = getAccessToken()
      if (!token) {
        setState((prev) => ({ ...prev, isLoading: false }))
        return
      }

      try {
        const user = await apiGet<User>('/api/v1/auth/me')
        setState({
          user,
          isLoading: false,
          isAuthenticated: true,
          error: null,
        })
      } catch {
        clearAccessToken()
        setState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
          error: null,
        })
      }
    }

    initAuth()
  }, [])

  // ログイン
  const login = useCallback(async (email: string, password: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const formData = new FormData()
      formData.append('username', email)
      formData.append('password', password)

      const response = await apiPostForm<Token>('/api/v1/auth/login', formData)
      setAccessToken(response.access_token)

      setState({
        user: response.user,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      })

      // ロールに応じてリダイレクト
      if (response.user.role === 'buyer') {
        router.push('/dashboard')
      } else if (response.user.role === 'supplier') {
        router.push('/supplier/dashboard')
      } else {
        router.push('/')
      }

      return response
    } catch (error) {
      const message = error instanceof Error ? error.message : 'ログインに失敗しました'
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: message,
      }))
      throw error
    }
  }, [router])

  // 登録
  const register = useCallback(async (data: UserCreate) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const user = await apiPost<User>('/api/v1/auth/register', data)
      setState((prev) => ({ ...prev, isLoading: false }))

      // 登録後にログインページへ
      router.push('/login')

      return user
    } catch (error) {
      const message = error instanceof Error ? error.message : '登録に失敗しました'
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: message,
      }))
      throw error
    }
  }, [router])

  // ログアウト
  const logout = useCallback(async () => {
    try {
      await apiPost('/api/v1/auth/logout')
    } catch {
      // ログアウトAPIが失敗してもクライアント側はクリア
    } finally {
      clearAccessToken()
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      })
      router.push('/login')
    }
  }, [router])

  // トークンリフレッシュ
  const refreshToken = useCallback(async () => {
    try {
      const response = await apiPost<Token>('/api/v1/auth/refresh')
      setAccessToken(response.access_token)
      setState((prev) => ({ ...prev, user: response.user }))
      return response
    } catch (error) {
      clearAccessToken()
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      })
      throw error
    }
  }, [])

  return {
    ...state,
    login,
    register,
    logout,
    refreshToken,
  }
}
