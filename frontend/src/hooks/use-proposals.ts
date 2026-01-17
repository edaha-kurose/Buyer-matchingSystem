/**
 * 提案関連カスタムフック
 */
'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiGet, apiPost } from '@/lib/api-client'
import type {
  Proposal,
  ProposalDetail,
  ProposalCreate,
  Comment,
  CommentCreate,
  MessageResponse,
} from '@/types/api'

// クエリキー
export const proposalKeys = {
  all: ['proposals'] as const,
  lists: () => [...proposalKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...proposalKeys.lists(), filters] as const,
  details: () => [...proposalKeys.all, 'detail'] as const,
  detail: (id: number) => [...proposalKeys.details(), id] as const,
  comments: (id: number) => [...proposalKeys.detail(id), 'comments'] as const,
}

interface UseProposalsOptions {
  status?: string
  skip?: number
  limit?: number
}

/**
 * サプライヤー向け提案一覧取得
 */
export function useSupplierProposals(options: UseProposalsOptions = {}) {
  const { status, skip = 0, limit = 20 } = options

  return useQuery({
    queryKey: proposalKeys.list({ status, skip, limit, type: 'supplier' }),
    queryFn: async () => {
      const params = new URLSearchParams()
      if (status) params.append('status', status)
      params.append('skip', String(skip))
      params.append('limit', String(limit))

      return apiGet<Proposal[]>(`/api/v1/supplier/proposals?${params}`)
    },
  })
}

/**
 * バイヤー向け提案一覧取得
 */
export function useBuyerProposals(options: UseProposalsOptions = {}) {
  const { status, skip = 0, limit = 20 } = options

  return useQuery({
    queryKey: proposalKeys.list({ status, skip, limit, type: 'buyer' }),
    queryFn: async () => {
      const params = new URLSearchParams()
      if (status) params.append('status', status)
      params.append('skip', String(skip))
      params.append('limit', String(limit))

      return apiGet<Proposal[]>(`/api/v1/proposals?${params}`)
    },
  })
}

/**
 * 提案詳細取得
 */
export function useProposalDetail(proposalId: number) {
  return useQuery({
    queryKey: proposalKeys.detail(proposalId),
    queryFn: () => apiGet<ProposalDetail>(`/api/v1/supplier/proposals/${proposalId}`),
    enabled: proposalId > 0,
  })
}

/**
 * 提案作成
 */
export function useCreateProposal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ProposalCreate) =>
      apiPost<Proposal>('/api/v1/supplier/proposals', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: proposalKeys.lists() })
    },
  })
}

/**
 * 提案提出（ポイント消費）
 */
export function useSubmitProposal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (proposalId: number) =>
      apiPost<{ success: boolean; points_used: number; remaining_balance: number }>(
        `/api/v1/supplier/proposals/${proposalId}/submit`
      ),
    onSuccess: (_, proposalId) => {
      queryClient.invalidateQueries({ queryKey: proposalKeys.detail(proposalId) })
      queryClient.invalidateQueries({ queryKey: proposalKeys.lists() })
      queryClient.invalidateQueries({ queryKey: ['points'] })
    },
  })
}

/**
 * 提案のコメント取得
 */
export function useProposalComments(proposalId: number) {
  return useQuery({
    queryKey: proposalKeys.comments(proposalId),
    queryFn: () => apiGet<Comment[]>(`/api/v1/supplier/proposals/${proposalId}/comments`),
    enabled: proposalId > 0,
  })
}

/**
 * コメント追加
 */
export function useAddComment(proposalId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CommentCreate) =>
      apiPost<MessageResponse>(`/api/v1/supplier/proposals/${proposalId}/comments`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: proposalKeys.comments(proposalId) })
    },
  })
}
