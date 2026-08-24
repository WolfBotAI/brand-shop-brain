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
      demo_bookings: {
        Row: {
          company: string | null
          confirmation_sent_at: string | null
          created_at: string
          email: string
          first_name: string
          ghl_appointment_id: string | null
          ghl_contact_id: string | null
          ghl_opportunity_id: string | null
          id: string
          last_name: string | null
          notes: string | null
          phone: string
          reminder_1h_sent_at: string | null
          reminder_24h_sent_at: string | null
          reminder_48h_sent_at: string | null
          role: string | null
          slot_end: string | null
          slot_start: string
          status: string
          timezone: string
          updated_at: string
        }
        Insert: {
          company?: string | null
          confirmation_sent_at?: string | null
          created_at?: string
          email: string
          first_name: string
          ghl_appointment_id?: string | null
          ghl_contact_id?: string | null
          ghl_opportunity_id?: string | null
          id?: string
          last_name?: string | null
          notes?: string | null
          phone: string
          reminder_1h_sent_at?: string | null
          reminder_24h_sent_at?: string | null
          reminder_48h_sent_at?: string | null
          role?: string | null
          slot_end?: string | null
          slot_start: string
          status?: string
          timezone?: string
          updated_at?: string
        }
        Update: {
          company?: string | null
          confirmation_sent_at?: string | null
          created_at?: string
          email?: string
          first_name?: string
          ghl_appointment_id?: string | null
          ghl_contact_id?: string | null
          ghl_opportunity_id?: string | null
          id?: string
          last_name?: string | null
          notes?: string | null
          phone?: string
          reminder_1h_sent_at?: string | null
          reminder_24h_sent_at?: string | null
          reminder_48h_sent_at?: string | null
          role?: string | null
          slot_end?: string | null
          slot_start?: string
          status?: string
          timezone?: string
          updated_at?: string
        }
        Relationships: []
      }
      distributor_catalogs: {
        Row: {
          catalog_name: string
          created_at: string
          id: string
          pricing_rules: Json
          selected_products: Json
          shipping_config: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          catalog_name?: string
          created_at?: string
          id?: string
          pricing_rules?: Json
          selected_products?: Json
          shipping_config?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          catalog_name?: string
          created_at?: string
          id?: string
          pricing_rules?: Json
          selected_products?: Json
          shipping_config?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          created_at: string
          customer_email: string
          customer_name: string
          fulfillment_details: Json | null
          id: string
          items: Json
          shipping_address: Json | null
          shipping_details: Json | null
          status: string
          store_id: string
          total: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_email: string
          customer_name?: string
          fulfillment_details?: Json | null
          id?: string
          items?: Json
          shipping_address?: Json | null
          shipping_details?: Json | null
          status?: string
          store_id: string
          total?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_email?: string
          customer_name?: string
          fulfillment_details?: Json | null
          id?: string
          items?: Json
          shipping_address?: Json | null
          shipping_details?: Json | null
          status?: string
          store_id?: string
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "public_storefronts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_fees: {
        Row: {
          created_at: string
          decoration_fee_default: number
          decoration_methods: Json
          default_shipping_fee: number
          id: string
          owner_markup_percent: number
          platform_surcharge_percent: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          decoration_fee_default?: number
          decoration_methods?: Json
          default_shipping_fee?: number
          id?: string
          owner_markup_percent?: number
          platform_surcharge_percent?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          decoration_fee_default?: number
          decoration_methods?: Json
          default_shipping_fee?: number
          id?: string
          owner_markup_percent?: number
          platform_surcharge_percent?: number
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          accounting_config: Json | null
          avatar_url: string | null
          business_name: string | null
          company_logo_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          location_id: string | null
          phone: string | null
          tenant_id: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          accounting_config?: Json | null
          avatar_url?: string | null
          business_name?: string | null
          company_logo_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          location_id?: string | null
          phone?: string | null
          tenant_id?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          accounting_config?: Json | null
          avatar_url?: string | null
          business_name?: string | null
          company_logo_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          location_id?: string | null
          phone?: string | null
          tenant_id?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      routing_rules: {
        Row: {
          category: string
          created_at: string
          decoration_type: string
          decorator: string
          id: string
          priority: number
          supplier: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          decoration_type: string
          decorator: string
          id?: string
          priority?: number
          supplier: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          decoration_type?: string
          decorator?: string
          id?: string
          priority?: number
          supplier?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ss_catalog_cache: {
        Row: {
          base_category: string
          brand_name: string
          colors: Json
          description: string
          pricing: Json
          raw_categories: string
          sizes: Json
          style_id: number
          style_image_url: string | null
          title: string
          total_skus: number
          updated_at: string
        }
        Insert: {
          base_category?: string
          brand_name?: string
          colors?: Json
          description?: string
          pricing?: Json
          raw_categories?: string
          sizes?: Json
          style_id: number
          style_image_url?: string | null
          title?: string
          total_skus?: number
          updated_at?: string
        }
        Update: {
          base_category?: string
          brand_name?: string
          colors?: Json
          description?: string
          pricing?: Json
          raw_categories?: string
          sizes?: Json
          style_id?: number
          style_image_url?: string | null
          title?: string
          total_skus?: number
          updated_at?: string
        }
        Relationships: []
      }
      stores: {
        Row: {
          accounting_config: Json | null
          ai_chat_enabled: boolean
          ai_voice_enabled: boolean
          ai_voice_number: string | null
          brand_vertical: string
          catalog_id: string | null
          client_name: string
          created_at: string
          custom_domain: string | null
          domain: string | null
          expires_at: string | null
          external_store_id: string | null
          id: string
          logo_url: string | null
          metadata: Json | null
          slug: string | null
          status: string
          store_name: string
          store_type: string
          tenant_id: string | null
          theme_config: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          accounting_config?: Json | null
          ai_chat_enabled?: boolean
          ai_voice_enabled?: boolean
          ai_voice_number?: string | null
          brand_vertical?: string
          catalog_id?: string | null
          client_name?: string
          created_at?: string
          custom_domain?: string | null
          domain?: string | null
          expires_at?: string | null
          external_store_id?: string | null
          id?: string
          logo_url?: string | null
          metadata?: Json | null
          slug?: string | null
          status?: string
          store_name: string
          store_type?: string
          tenant_id?: string | null
          theme_config?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          accounting_config?: Json | null
          ai_chat_enabled?: boolean
          ai_voice_enabled?: boolean
          ai_voice_number?: string | null
          brand_vertical?: string
          catalog_id?: string | null
          client_name?: string
          created_at?: string
          custom_domain?: string | null
          domain?: string | null
          expires_at?: string | null
          external_store_id?: string | null
          id?: string
          logo_url?: string | null
          metadata?: Json | null
          slug?: string | null
          status?: string
          store_name?: string
          store_type?: string
          tenant_id?: string | null
          theme_config?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      vision_jobs: {
        Row: {
          created_at: string
          customer: string
          error_flag: string | null
          extracted_fields: Json | null
          id: string
          source: string
          status: string
          subject: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          customer?: string
          error_flag?: string | null
          extracted_fields?: Json | null
          id?: string
          source?: string
          status?: string
          subject: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          customer?: string
          error_flag?: string | null
          extracted_fields?: Json | null
          id?: string
          source?: string
          status?: string
          subject?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      public_storefronts: {
        Row: {
          ai_chat_enabled: boolean | null
          ai_voice_enabled: boolean | null
          ai_voice_number: string | null
          id: string | null
          logo_url: string | null
          metadata: Json | null
          slug: string | null
          status: string | null
          store_name: string | null
          store_type: string | null
          theme_config: Json | null
        }
        Insert: {
          ai_chat_enabled?: boolean | null
          ai_voice_enabled?: boolean | null
          ai_voice_number?: string | null
          id?: string | null
          logo_url?: string | null
          metadata?: never
          slug?: string | null
          status?: string | null
          store_name?: string | null
          store_type?: string | null
          theme_config?: Json | null
        }
        Update: {
          ai_chat_enabled?: boolean | null
          ai_voice_enabled?: boolean | null
          ai_voice_number?: string | null
          id?: string | null
          logo_url?: string | null
          metadata?: never
          slug?: string | null
          status?: string | null
          store_name?: string | null
          store_type?: string | null
          theme_config?: Json | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
