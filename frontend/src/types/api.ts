/**
 * API型定義
 * バックエンドのPydanticスキーマと同期
 */

// ============ User ============

export interface User {
  id: number
  email: string
  name: string
  role: 'admin' | 'buyer' | 'supplier'
  is_active: boolean
  organization_id?: number
  created_at?: string
}

export interface UserCreate {
  email: string
  password: string
  name: string
  role: 'buyer' | 'supplier'
}

export interface LoginRequest {
  username: string
  password: string
}

export interface Token {
  access_token: string
  token_type: string
  user: User
}

// ============ Proposal ============

export type ProposalStatus =
  | 'draft'
  | 'submitted'
  | 'analyzing'
  | 'qa_pending'
  | 'qa_completed'
  | 'evaluated'
  | 'under_review'
  | 'meeting'
  | 'accepted'
  | 'rejected'
  | 'on_hold'

export interface Proposal {
  id: number
  title: string
  description?: string
  status: ProposalStatus
  points_used: number
  created_at: string
  updated_at: string
  supplier_org_id?: number
  buyer_name?: string
  ai_score?: number
  comment_count: number
}

export interface ProposalCreate {
  title: string
  description?: string
  buyer_config_id?: number
}

export interface ProposalDetail extends Proposal {
  extracted_info?: Record<string, unknown>
  evaluation?: Evaluation
  documents?: Document[]
}

export interface Evaluation {
  overall_score?: number
  ai_summary?: string
  reliability_rank?: string
  category_scores?: Record<string, number>
}

export interface Document {
  id: number
  filename: string
  file_type: string
  file_size: number
  uploaded_at: string
}

// ============ Points ============

export interface PointBalance {
  balance: number
  total_purchased: number
  total_used: number
}

export interface PointTransaction {
  id: number
  transaction_type: string
  amount: number
  balance_after: number
  description?: string
  created_at: string
}

export interface PointPackage {
  id: number
  name: string
  points: number
  price: number
  bonus_points: number
}

// ============ Comments ============

export interface Comment {
  id: number
  content: string
  user_name: string
  user_role: string
  is_internal: boolean
  created_at: string
  replies: Comment[]
}

export interface CommentCreate {
  content: string
  parent_id?: number
}

// ============ Notifications ============

export interface Notification {
  id: number
  title: string
  message: string
  link?: string
  is_read: boolean
  notification_type?: string
  created_at: string
}

// ============ Dashboard ============

export interface DashboardStats {
  total_proposals: number
  active_proposals: number
  accepted_proposals: number
  rejected_proposals: number
  point_balance: number
  unread_notifications: number
}

// ============ Common ============

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  skip: number
  limit: number
  has_more: boolean
}

export interface MessageResponse {
  message: string
  success: boolean
}

export interface ErrorResponse {
  detail: string
  error_code?: string
}
