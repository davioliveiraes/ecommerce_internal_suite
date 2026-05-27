export interface AuthUser {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  is_staff: boolean
}

export interface LoginPayload {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  token_type: 'Bearer'
  user: AuthUser
}
