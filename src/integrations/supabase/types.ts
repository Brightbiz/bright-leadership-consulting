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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admin_action_log: {
        Row: {
          action: string
          created_at: string
          details: Json
          id: string
          operator_email: string | null
          operator_id: string | null
          outcome: string
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json
          id?: string
          operator_email?: string | null
          operator_id?: string | null
          outcome: string
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json
          id?: string
          operator_email?: string | null
          operator_id?: string | null
          outcome?: string
        }
        Relationships: []
      }
      ai_audit_requests: {
        Row: {
          action_label: string
          action_status: string
          actioned_at: string | null
          actioned_by: string | null
          actioned_by_email: string | null
          admin_notice_status: string
          buyer_ack_status: string
          created_at: string
          crm_attempts: number
          crm_contact_id: string | null
          crm_error: string | null
          crm_failure_ack_at: string | null
          crm_failure_ack_by_email: string | null
          crm_last_attempt_at: string | null
          crm_status: string
          duplicate_count: number
          email: string
          flagged_duplicate: boolean
          id: string
          idempotency_key: string | null
          job_title: string | null
          last_submitted_at: string
          name: string | null
          organisation: string | null
          participant_quantity: number | null
          product: string
          request_type: string
          response_id: string | null
          retain_until: string
          status: string
          updated_at: string
        }
        Insert: {
          action_label?: string
          action_status?: string
          actioned_at?: string | null
          actioned_by?: string | null
          actioned_by_email?: string | null
          admin_notice_status?: string
          buyer_ack_status?: string
          created_at?: string
          crm_attempts?: number
          crm_contact_id?: string | null
          crm_error?: string | null
          crm_failure_ack_at?: string | null
          crm_failure_ack_by_email?: string | null
          crm_last_attempt_at?: string | null
          crm_status?: string
          duplicate_count?: number
          email: string
          flagged_duplicate?: boolean
          id?: string
          idempotency_key?: string | null
          job_title?: string | null
          last_submitted_at?: string
          name?: string | null
          organisation?: string | null
          participant_quantity?: number | null
          product?: string
          request_type: string
          response_id?: string | null
          retain_until?: string
          status?: string
          updated_at?: string
        }
        Update: {
          action_label?: string
          action_status?: string
          actioned_at?: string | null
          actioned_by?: string | null
          actioned_by_email?: string | null
          admin_notice_status?: string
          buyer_ack_status?: string
          created_at?: string
          crm_attempts?: number
          crm_contact_id?: string | null
          crm_error?: string | null
          crm_failure_ack_at?: string | null
          crm_failure_ack_by_email?: string | null
          crm_last_attempt_at?: string | null
          crm_status?: string
          duplicate_count?: number
          email?: string
          flagged_duplicate?: boolean
          id?: string
          idempotency_key?: string | null
          job_title?: string | null
          last_submitted_at?: string
          name?: string | null
          organisation?: string | null
          participant_quantity?: number | null
          product?: string
          request_type?: string
          response_id?: string | null
          retain_until?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_audit_requests_response_id_fkey"
            columns: ["response_id"]
            isOneToOne: false
            referencedRelation: "ai_audit_responses"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_audit_responses: {
        Row: {
          classification: string
          created_at: string
          email: string
          id: string
          idempotency_key: string | null
          job_title: string | null
          marketing_consent: boolean
          name: string | null
          organisation: string | null
          purge_after: string
          readiness_band: string
          readiness_score: number
          routing: Json
        }
        Insert: {
          classification?: string
          created_at?: string
          email: string
          id?: string
          idempotency_key?: string | null
          job_title?: string | null
          marketing_consent?: boolean
          name?: string | null
          organisation?: string | null
          purge_after?: string
          readiness_band?: string
          readiness_score: number
          routing?: Json
        }
        Update: {
          classification?: string
          created_at?: string
          email?: string
          id?: string
          idempotency_key?: string | null
          job_title?: string | null
          marketing_consent?: boolean
          name?: string | null
          organisation?: string | null
          purge_after?: string
          readiness_band?: string
          readiness_score?: number
          routing?: Json
        }
        Relationships: []
      }
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
      audit_submission_events: {
        Row: {
          created_at: string
          email_hash: string
          id: string
          ip_hash: string
        }
        Insert: {
          created_at?: string
          email_hash: string
          id?: string
          ip_hash: string
        }
        Update: {
          created_at?: string
          email_hash?: string
          id?: string
          ip_hash?: string
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
          enquiry_type: string | null
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
          enquiry_type?: string | null
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
          enquiry_type?: string | null
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
      data_subject_request_log: {
        Row: {
          action: string
          affected: Json
          created_at: string
          email_hash: string
          id: string
          operator_id: string | null
        }
        Insert: {
          action: string
          affected?: Json
          created_at?: string
          email_hash: string
          id?: string
          operator_id?: string | null
        }
        Update: {
          action?: string
          affected?: Json
          created_at?: string
          email_hash?: string
          id?: string
          operator_id?: string | null
        }
        Relationships: []
      }
      edl_application_access_needs: {
        Row: {
          adjustment_detail: string | null
          adjustment_route: string
          application_id: string
          created_at: string
          id: string
          preferred_contact_method: string | null
        }
        Insert: {
          adjustment_detail?: string | null
          adjustment_route: string
          application_id: string
          created_at?: string
          id?: string
          preferred_contact_method?: string | null
        }
        Update: {
          adjustment_detail?: string | null
          adjustment_route?: string
          application_id?: string
          created_at?: string
          id?: string
          preferred_contact_method?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "edl_application_access_needs_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "edl_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      edl_applications: {
        Row: {
          ack_authorised: boolean
          ack_confidentiality_limits: boolean
          ack_no_recording: boolean
          anonymisable: string
          commit_applied_work: boolean
          commit_attend: boolean
          commit_challenge: boolean
          commit_confidentiality: boolean
          commit_week4: boolean
          conflict_note: string | null
          country: string
          created_at: string
          decision_already_decided: string
          decision_alternatives: string
          decision_at: string | null
          decision_at_risk: string
          decision_deadline: string
          decision_off_limits: string
          decision_statement: string
          decision_why_now: string
          decl_accurate: boolean
          decl_employer_funding_subject: boolean
          decl_no_admission_guarantee: boolean
          decl_no_outcome_guarantee: boolean
          decl_privacy_read: boolean
          expected_approval_date: string | null
          full_name: string
          funding_route: string
          gclid: string | null
          id: string
          linkedin_url: string | null
          marketing_consent: boolean
          marketing_consent_at: string | null
          offer_reserved_until: string | null
          org_legal_name: string | null
          organisation: string
          po_required: string | null
          privacy_notice_version: string
          referral_detail: string | null
          referral_source: string
          resp_approvals: string
          resp_authority: string
          resp_current: string
          resp_decision_types: string
          review_notes: string | null
          reviewer_id: string | null
          role_title: string
          sector: string
          sponsor_email: string | null
          sponsor_name: string | null
          sponsor_role: string | null
          status: Database["public"]["Enums"]["edl_application_status"]
          telephone: string
          time_zone: string
          updated_at: string
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
          vendor_onboarding_required: string | null
          work_email: string
        }
        Insert: {
          ack_authorised?: boolean
          ack_confidentiality_limits?: boolean
          ack_no_recording?: boolean
          anonymisable: string
          commit_applied_work?: boolean
          commit_attend?: boolean
          commit_challenge?: boolean
          commit_confidentiality?: boolean
          commit_week4?: boolean
          conflict_note?: string | null
          country: string
          created_at?: string
          decision_already_decided: string
          decision_alternatives: string
          decision_at?: string | null
          decision_at_risk: string
          decision_deadline: string
          decision_off_limits: string
          decision_statement: string
          decision_why_now: string
          decl_accurate?: boolean
          decl_employer_funding_subject?: boolean
          decl_no_admission_guarantee?: boolean
          decl_no_outcome_guarantee?: boolean
          decl_privacy_read?: boolean
          expected_approval_date?: string | null
          full_name: string
          funding_route: string
          gclid?: string | null
          id?: string
          linkedin_url?: string | null
          marketing_consent?: boolean
          marketing_consent_at?: string | null
          offer_reserved_until?: string | null
          org_legal_name?: string | null
          organisation: string
          po_required?: string | null
          privacy_notice_version: string
          referral_detail?: string | null
          referral_source: string
          resp_approvals: string
          resp_authority: string
          resp_current: string
          resp_decision_types: string
          review_notes?: string | null
          reviewer_id?: string | null
          role_title: string
          sector: string
          sponsor_email?: string | null
          sponsor_name?: string | null
          sponsor_role?: string | null
          status?: Database["public"]["Enums"]["edl_application_status"]
          telephone: string
          time_zone: string
          updated_at?: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          vendor_onboarding_required?: string | null
          work_email: string
        }
        Update: {
          ack_authorised?: boolean
          ack_confidentiality_limits?: boolean
          ack_no_recording?: boolean
          anonymisable?: string
          commit_applied_work?: boolean
          commit_attend?: boolean
          commit_challenge?: boolean
          commit_confidentiality?: boolean
          commit_week4?: boolean
          conflict_note?: string | null
          country?: string
          created_at?: string
          decision_already_decided?: string
          decision_alternatives?: string
          decision_at?: string | null
          decision_at_risk?: string
          decision_deadline?: string
          decision_off_limits?: string
          decision_statement?: string
          decision_why_now?: string
          decl_accurate?: boolean
          decl_employer_funding_subject?: boolean
          decl_no_admission_guarantee?: boolean
          decl_no_outcome_guarantee?: boolean
          decl_privacy_read?: boolean
          expected_approval_date?: string | null
          full_name?: string
          funding_route?: string
          gclid?: string | null
          id?: string
          linkedin_url?: string | null
          marketing_consent?: boolean
          marketing_consent_at?: string | null
          offer_reserved_until?: string | null
          org_legal_name?: string | null
          organisation?: string
          po_required?: string | null
          privacy_notice_version?: string
          referral_detail?: string | null
          referral_source?: string
          resp_approvals?: string
          resp_authority?: string
          resp_current?: string
          resp_decision_types?: string
          review_notes?: string | null
          reviewer_id?: string | null
          role_title?: string
          sector?: string
          sponsor_email?: string | null
          sponsor_name?: string | null
          sponsor_role?: string | null
          status?: Database["public"]["Enums"]["edl_application_status"]
          telephone?: string
          time_zone?: string
          updated_at?: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          vendor_onboarding_required?: string | null
          work_email?: string
        }
        Relationships: []
      }
      edl_employer_requests: {
        Row: {
          admin_question: string | null
          created_at: string
          expected_decision_date: string | null
          id: string
          invoice_required: string | null
          linked_application_id: string | null
          participant_email: string | null
          participant_name: string | null
          participant_role: string | null
          po_required: string | null
          privacy_ack: boolean
          requester_email: string
          requester_name: string
          requester_organisation: string
          requester_role: string
          status: Database["public"]["Enums"]["edl_employer_request_status"]
          updated_at: string
          vendor_onboarding_required: string | null
        }
        Insert: {
          admin_question?: string | null
          created_at?: string
          expected_decision_date?: string | null
          id?: string
          invoice_required?: string | null
          linked_application_id?: string | null
          participant_email?: string | null
          participant_name?: string | null
          participant_role?: string | null
          po_required?: string | null
          privacy_ack?: boolean
          requester_email: string
          requester_name: string
          requester_organisation: string
          requester_role: string
          status?: Database["public"]["Enums"]["edl_employer_request_status"]
          updated_at?: string
          vendor_onboarding_required?: string | null
        }
        Update: {
          admin_question?: string | null
          created_at?: string
          expected_decision_date?: string | null
          id?: string
          invoice_required?: string | null
          linked_application_id?: string | null
          participant_email?: string | null
          participant_name?: string | null
          participant_role?: string | null
          po_required?: string | null
          privacy_ack?: boolean
          requester_email?: string
          requester_name?: string
          requester_organisation?: string
          requester_role?: string
          status?: Database["public"]["Enums"]["edl_employer_request_status"]
          updated_at?: string
          vendor_onboarding_required?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "edl_employer_requests_linked_application_id_fkey"
            columns: ["linked_application_id"]
            isOneToOne: false
            referencedRelation: "edl_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      employer_offers: {
        Row: {
          accepted_at: string | null
          accepted_email: string | null
          accepted_name: string | null
          accepted_role: string | null
          admin_notes: string | null
          contact_submission_id: string | null
          created_at: string
          employer_organisation: string
          expires_at: string
          fee_gbp: number
          first_opened_at: string | null
          id: string
          invoice_contact: string | null
          issued_at: string
          issued_by: string | null
          issued_by_email: string | null
          last_opened_at: string | null
          non_standard_request: string | null
          open_count: number
          paid_at: string | null
          participant_email: string | null
          participant_name: string
          participant_role: string | null
          payment_method: string
          po_number: string | null
          programme: string
          referred_at: string | null
          signatory_email: string
          signatory_name: string
          status: string
          superseded_by: string | null
          terms_version: string
          token: string
          updated_at: string
          withdrawn_at: string | null
        }
        Insert: {
          accepted_at?: string | null
          accepted_email?: string | null
          accepted_name?: string | null
          accepted_role?: string | null
          admin_notes?: string | null
          contact_submission_id?: string | null
          created_at?: string
          employer_organisation: string
          expires_at: string
          fee_gbp?: number
          first_opened_at?: string | null
          id?: string
          invoice_contact?: string | null
          issued_at?: string
          issued_by?: string | null
          issued_by_email?: string | null
          last_opened_at?: string | null
          non_standard_request?: string | null
          open_count?: number
          paid_at?: string | null
          participant_email?: string | null
          participant_name: string
          participant_role?: string | null
          payment_method?: string
          po_number?: string | null
          programme?: string
          referred_at?: string | null
          signatory_email: string
          signatory_name: string
          status?: string
          superseded_by?: string | null
          terms_version: string
          token?: string
          updated_at?: string
          withdrawn_at?: string | null
        }
        Update: {
          accepted_at?: string | null
          accepted_email?: string | null
          accepted_name?: string | null
          accepted_role?: string | null
          admin_notes?: string | null
          contact_submission_id?: string | null
          created_at?: string
          employer_organisation?: string
          expires_at?: string
          fee_gbp?: number
          first_opened_at?: string | null
          id?: string
          invoice_contact?: string | null
          issued_at?: string
          issued_by?: string | null
          issued_by_email?: string | null
          last_opened_at?: string | null
          non_standard_request?: string | null
          open_count?: number
          paid_at?: string | null
          participant_email?: string | null
          participant_name?: string
          participant_role?: string | null
          payment_method?: string
          po_number?: string | null
          programme?: string
          referred_at?: string | null
          signatory_email?: string
          signatory_name?: string
          status?: string
          superseded_by?: string | null
          terms_version?: string
          token?: string
          updated_at?: string
          withdrawn_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employer_offers_contact_submission_id_fkey"
            columns: ["contact_submission_id"]
            isOneToOne: false
            referencedRelation: "contact_submissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employer_offers_superseded_by_fkey"
            columns: ["superseded_by"]
            isOneToOne: false
            referencedRelation: "employer_offers"
            referencedColumns: ["id"]
          },
        ]
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
          cadence_days: number
          company: string
          context: string
          created_at: string
          do_not_follow_up: boolean
          email: string | null
          id: string
          name: string
          priority: boolean
          role: string
          snooze_until: string | null
          sort_order: number
          updated_at: string
          user_id: string
        }
        Insert: {
          cadence_days?: number
          company?: string
          context?: string
          created_at?: string
          do_not_follow_up?: boolean
          email?: string | null
          id?: string
          name?: string
          priority?: boolean
          role?: string
          snooze_until?: string | null
          sort_order?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          cadence_days?: number
          company?: string
          context?: string
          created_at?: string
          do_not_follow_up?: boolean
          email?: string | null
          id?: string
          name?: string
          priority?: boolean
          role?: string
          snooze_until?: string | null
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
      admin_audit_subject_request: {
        Args: { _action: string; _email: string }
        Returns: Json
      }
      cleanup_old_rate_limits: { Args: never; Returns: undefined }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      purge_expired_ai_audit_data: { Args: never; Returns: Json }
      record_ai_audit_submission: {
        Args: {
          _action_label: string
          _classification: string
          _crm_note: string
          _email: string
          _idempotency_key: string
          _job_title: string
          _marketing_consent: boolean
          _name: string
          _organisation: string
          _participant_quantity: number
          _product: string
          _readiness_band: string
          _readiness_score: number
          _request_type: string
          _routing: Json
        }
        Returns: Json
      }
      retry_ai_audit_crm_mirror: {
        Args: { _request_id: string }
        Returns: Json
      }
      sync_existing_leads_to_crm: { Args: never; Returns: number }
    }
    Enums: {
      app_role: "admin" | "user"
      edl_application_status:
        | "submitted"
        | "under_review"
        | "clarification_required"
        | "clarification_scheduled"
        | "conflict_hold"
        | "conditionally_accepted"
        | "waitlisted"
        | "declined"
        | "withdrawn"
        | "offer_lapsed"
        | "enrolled"
      edl_employer_request_status:
        | "received"
        | "pack_issued"
        | "approver_verified"
        | "offer_issued"
        | "committed"
        | "closed"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      edl_application_status: [
        "submitted",
        "under_review",
        "clarification_required",
        "clarification_scheduled",
        "conflict_hold",
        "conditionally_accepted",
        "waitlisted",
        "declined",
        "withdrawn",
        "offer_lapsed",
        "enrolled",
      ],
      edl_employer_request_status: [
        "received",
        "pack_issued",
        "approver_verified",
        "offer_issued",
        "committed",
        "closed",
      ],
      outreach_draft_status: ["draft", "sent", "replied"],
    },
  },
} as const
