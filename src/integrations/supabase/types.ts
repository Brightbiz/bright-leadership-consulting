export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      assessment_results: {
        Row: {
          answers: Json
          assessment_type: string
          competency_scores: Json
          completed_at: string
          created_at: string
          id: string
          max_score: number
          percentage: number
          total_score: number
          user_id: string
        }
        Insert: {
          answers?: Json
          assessment_type: string
          competency_scores?: Json
          completed_at?: string
          created_at?: string
          id?: string
          max_score?: number
          percentage?: number
          total_score?: number
          user_id: string
        }
        Update: {
          answers?: Json
          assessment_type?: string
          competency_scores?: Json
          completed_at?: string
          created_at?: string
          id?: string
          max_score?: number
          percentage?: number
          total_score?: number
          user_id?: string
        }
        Relationships: []
      }
      checklist_results: {
        Row: {
          checked_items: string[]
          created_at: string
          id: string
          score: number
          updated_at: string
          user_id: string
        }
        Insert: {
          checked_items?: string[]
          created_at?: string
          id?: string
          score?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          checked_items?: string[]
          created_at?: string
          id?: string
          score?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          company: string | null
          created_at: string
          email: string
          id: string
          is_read: boolean
          message: string
          name: string
          phone: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          id?: string
          is_read?: boolean
          message: string
          name: string
          phone?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          is_read?: boolean
          message?: string
          name?: string
          phone?: string | null
        }
        Relationships: []
      }
      crm_contacts: {
        Row: {
          company: string | null
          created_at: string
          deal_stage: string | null
          email: string
          estimated_value: number | null
          id: string
          job_title: string | null
          last_contacted_at: string | null
          name: string | null
          next_follow_up: string | null
          notes: string | null
          phone: string | null
          source: string
          source_record_id: string | null
          source_table: string | null
          status: string
          tags: string[]
          updated_at: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          deal_stage?: string | null
          email: string
          estimated_value?: number | null
          id?: string
          job_title?: string | null
          last_contacted_at?: string | null
          name?: string | null
          next_follow_up?: string | null
          notes?: string | null
          phone?: string | null
          source?: string
          source_record_id?: string | null
          source_table?: string | null
          status?: string
          tags?: string[]
          updated_at?: string
        }
        Update: {
          company?: string | null
          created_at?: string
          deal_stage?: string | null
          email?: string
          estimated_value?: number | null
          id?: string
          job_title?: string | null
          last_contacted_at?: string | null
          name?: string | null
          next_follow_up?: string | null
          notes?: string | null
          phone?: string | null
          source?: string
          source_record_id?: string | null
          source_table?: string | null
          status?: string
          tags?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      lead_magnet_downloads: {
        Row: {
          downloaded_at: string
          email: string
          id: string
          lead_magnet_name: string
          name: string | null
        }
        Insert: {
          downloaded_at?: string
          email: string
          id?: string
          lead_magnet_name?: string
          name?: string | null
        }
        Update: {
          downloaded_at?: string
          email?: string
          id?: string
          lead_magnet_name?: string
          name?: string | null
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          email: string
          id: string
          source: string
          subscribed_at: string
        }
        Insert: {
          email: string
          id?: string
          source?: string
          subscribed_at?: string
        }
        Update: {
          email?: string
          id?: string
          source?: string
          subscribed_at?: string
        }
        Relationships: []
      }
      outreach_drafts: {
        Row: {
          body: string
          company: string
          created_at: string
          crm_contact_id: string | null
          id: string
          is_follow_up: boolean
          parent_draft_id: string | null
          recipient_id: string | null
          recipient_name: string
          recipient_role: string
          replied_at: string | null
          reply_sentiment: string | null
          reply_text: string | null
          sent_at: string | null
          status: Database["public"]["Enums"]["outreach_draft_status"]
          subject: string
          updated_at: string
          user_id: string
        }
        Insert: {
          body: string
          company?: string
          created_at?: string
          crm_contact_id?: string | null
          id?: string
          is_follow_up?: boolean
          parent_draft_id?: string | null
          recipient_id?: string | null
          recipient_name: string
          recipient_role: string
          replied_at?: string | null
          reply_sentiment?: string | null
          reply_text?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["outreach_draft_status"]
          subject: string
          updated_at?: string
          user_id: string
        }
        Update: {
          body?: string
          company?: string
          created_at?: string
          crm_contact_id?: string | null
          id?: string
          is_follow_up?: boolean
          parent_draft_id?: string | null
          recipient_id?: string | null
          recipient_name?: string
          recipient_role?: string
          replied_at?: string | null
          reply_sentiment?: string | null
          reply_text?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["outreach_draft_status"]
          subject?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "outreach_drafts_crm_contact_id_fkey"
            columns: ["crm_contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "outreach_drafts_parent_draft_id_fkey"
            columns: ["parent_draft_id"]
            isOneToOne: false
            referencedRelation: "outreach_drafts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "outreach_drafts_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "outreach_recipients"
            referencedColumns: ["id"]
          },
        ]
      }
      outreach_recipients: {
        Row: {
          company: string
          context: string
          created_at: string
          email: string | null
          id: string
          name: string
          priority: boolean
          role: string
          sort_order: number
          updated_at: string
          user_id: string
        }
        Insert: {
          company?: string
          context?: string
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          priority?: boolean
          role?: string
          sort_order?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          company?: string
          context?: string
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          priority?: boolean
          role?: string
          sort_order?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          created_at: string
          form_type: string
          id: string
          ip_address: string
        }
        Insert: {
          created_at?: string
          form_type: string
          id?: string
          ip_address: string
        }
        Update: {
          created_at?: string
          form_type?: string
          id?: string
          ip_address?: string
        }
        Relationships: []
      }
      readiness_quiz_results: {
        Row: {
          answers: Json
          created_at: string
          email: string
          id: string
          name: string | null
          recommended_tier: string
          total_score: number
        }
        Insert: {
          answers?: Json
          created_at?: string
          email: string
          id?: string
          name?: string | null
          recommended_tier: string
          total_score?: number
        }
        Update: {
          answers?: Json
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          recommended_tier?: string
          total_score?: number
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      workbook_responses: {
        Row: {
          completed: boolean
          created_at: string
          current_section: number
          email: string
          id: string
          name: string | null
          section_data: Json
          updated_at: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          current_section?: number
          email: string
          id?: string
          name?: string | null
          section_data?: Json
          updated_at?: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          current_section?: number
          email?: string
          id?: string
          name?: string | null
          section_data?: Json
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_old_rate_limits: { Args: never; Returns: undefined }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      sync_existing_leads_to_crm: { Args: never; Returns: number }
    }
    Enums: {
      app_role: "admin" | "user"
      outreach_draft_status: "draft" | "sent" | "replied"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      outreach_draft_status: ["draft", "sent", "replied"],
    },
  },
} as const
