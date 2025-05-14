export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      adoption_requests: {
        Row: {
          id: string
          pet_id: string
          requester_id: string
          owner_id: string
          status: 'pending' | 'accepted' | 'rejected'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          pet_id: string
          requester_id: string
          owner_id: string
          status: 'pending' | 'accepted' | 'rejected'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          pet_id?: string
          requester_id?: string
          owner_id?: string
          status?: 'pending' | 'accepted' | 'rejected'
          created_at?: string
          updated_at?: string
        }
      }
      pets: {
        Row: {
          id: string
          name: string
          breed: string | null
          description: string
          city: string
          state: string
          created_at: string
          species: 'dog' | 'cat' | 'bird' | 'other'
          status: 'available' | 'adopted'
          contact_whatsapp: string
          is_litter: boolean
          litter_size: number | null
          males_count: number | null
          females_count: number | null
          birth_date: string | null
          owner_id: string
        }
        Insert: {
          id?: string
          name: string
          breed?: string | null
          description: string
          city: string
          state: string
          created_at?: string
          species: 'dog' | 'cat' | 'bird' | 'other'
          status: 'available' | 'adopted'
          contact_whatsapp: string
          is_litter: boolean
          litter_size?: number | null
          males_count?: number | null
          females_count?: number | null
          birth_date?: string | null
          owner_id: string
        }
        Update: {
          id?: string
          name?: string
          breed?: string | null
          description?: string
          city?: string
          state?: string
          created_at?: string
          species?: 'dog' | 'cat' | 'bird' | 'other'
          status?: 'available' | 'adopted'
          contact_whatsapp?: string
          is_litter?: boolean
          litter_size?: number | null
          males_count?: number | null
          females_count?: number | null
          birth_date?: string | null
          owner_id?: string
        }
      }
      users: {
        Row: {
          id: string
          name: string
          email: string
          whatsapp: string | null
          created_at: string
        }
        Insert: {
          id: string
          name: string
          email: string
          whatsapp?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          whatsapp?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 