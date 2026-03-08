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
      contact_leads: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          lead_type: string | null
          message: string | null
          phone: string | null
          project_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id?: string
          lead_type?: string | null
          message?: string | null
          phone?: string | null
          project_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          lead_type?: string | null
          message?: string | null
          phone?: string | null
          project_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contact_leads_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_services: {
        Row: {
          active: boolean | null
          category: string
          created_at: string | null
          description: string | null
          icon_name: string | null
          id: string
          price_label: string | null
          sort_order: number | null
          title: string
        }
        Insert: {
          active?: boolean | null
          category: string
          created_at?: string | null
          description?: string | null
          icon_name?: string | null
          id?: string
          price_label?: string | null
          sort_order?: number | null
          title: string
        }
        Update: {
          active?: boolean | null
          category?: string
          created_at?: string | null
          description?: string | null
          icon_name?: string | null
          id?: string
          price_label?: string | null
          sort_order?: number | null
          title?: string
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          active: boolean
          email: string
          id: string
          subscribed_at: string
        }
        Insert: {
          active?: boolean
          email: string
          id?: string
          subscribed_at?: string
        }
        Update: {
          active?: boolean
          email?: string
          id?: string
          subscribed_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          developer_status: string | null
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          developer_status?: string | null
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          developer_status?: string | null
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      project_images: {
        Row: {
          alt_text: string | null
          created_at: string
          id: string
          image_url: string
          project_id: string
          sort_order: number | null
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          id?: string
          image_url: string
          project_id: string
          sort_order?: number | null
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          id?: string
          image_url?: string
          project_id?: string
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "project_images_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_units: {
        Row: {
          area_m2: number | null
          available: boolean
          created_at: string
          floor: string | null
          id: string
          price: number | null
          price_currency: string
          project_id: string
          typology: Database["public"]["Enums"]["unit_typology"]
          unit_name: string
        }
        Insert: {
          area_m2?: number | null
          available?: boolean
          created_at?: string
          floor?: string | null
          id?: string
          price?: number | null
          price_currency?: string
          project_id: string
          typology?: Database["public"]["Enums"]["unit_typology"]
          unit_name: string
        }
        Update: {
          area_m2?: number | null
          available?: boolean
          created_at?: string
          floor?: string | null
          id?: string
          price?: number | null
          price_currency?: string
          project_id?: string
          typology?: Database["public"]["Enums"]["unit_typology"]
          unit_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_units_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          amenities: string[] | null
          cover_image_url: string | null
          created_at: string
          cuota_estimativa: number | null
          delivery_date: string | null
          description: string | null
          developer_id: string | null
          developer_name: string | null
          entidad_financiera: string | null
          estimated_yield: number | null
          featured: boolean | null
          financing_available: boolean | null
          id: string
          latitude: number | null
          location_city: string
          location_zone: string | null
          longitude: number | null
          phase_construccion_date: string | null
          phase_en_pozo_date: string | null
          phase_entrega_date: string | null
          phase_preventa_date: string | null
          plazo_maximo: number | null
          precio_financiable: number | null
          price_currency: string
          price_from: number | null
          programa_financiacion: string | null
          project_type: Database["public"]["Enums"]["project_type"]
          slug: string
          status: Database["public"]["Enums"]["project_status"]
          subsidio_estado: boolean | null
          tipo_financiacion: string | null
          title: string
          updated_at: string
        }
        Insert: {
          amenities?: string[] | null
          cover_image_url?: string | null
          created_at?: string
          cuota_estimativa?: number | null
          delivery_date?: string | null
          description?: string | null
          developer_id?: string | null
          developer_name?: string | null
          entidad_financiera?: string | null
          estimated_yield?: number | null
          featured?: boolean | null
          financing_available?: boolean | null
          id?: string
          latitude?: number | null
          location_city: string
          location_zone?: string | null
          longitude?: number | null
          phase_construccion_date?: string | null
          phase_en_pozo_date?: string | null
          phase_entrega_date?: string | null
          phase_preventa_date?: string | null
          plazo_maximo?: number | null
          precio_financiable?: number | null
          price_currency?: string
          price_from?: number | null
          programa_financiacion?: string | null
          project_type?: Database["public"]["Enums"]["project_type"]
          slug: string
          status?: Database["public"]["Enums"]["project_status"]
          subsidio_estado?: boolean | null
          tipo_financiacion?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          amenities?: string[] | null
          cover_image_url?: string | null
          created_at?: string
          cuota_estimativa?: number | null
          delivery_date?: string | null
          description?: string | null
          developer_id?: string | null
          developer_name?: string | null
          entidad_financiera?: string | null
          estimated_yield?: number | null
          featured?: boolean | null
          financing_available?: boolean | null
          id?: string
          latitude?: number | null
          location_city?: string
          location_zone?: string | null
          longitude?: number | null
          phase_construccion_date?: string | null
          phase_en_pozo_date?: string | null
          phase_entrega_date?: string | null
          phase_preventa_date?: string | null
          plazo_maximo?: number | null
          precio_financiable?: number | null
          price_currency?: string
          price_from?: number | null
          programa_financiacion?: string | null
          project_type?: Database["public"]["Enums"]["project_type"]
          slug?: string
          status?: Database["public"]["Enums"]["project_status"]
          subsidio_estado?: boolean | null
          tipo_financiacion?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      service_requests: {
        Row: {
          created_at: string | null
          id: string
          notes: string | null
          service_id: string | null
          service_title: string
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          notes?: string | null
          service_id?: string | null
          service_title: string
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          notes?: string | null
          service_id?: string | null
          service_title?: string
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_requests_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "marketplace_services"
            referencedColumns: ["id"]
          },
        ]
      }
      user_favorites: {
        Row: {
          created_at: string
          id: string
          project_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          project_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          project_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_favorites_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          created_at: string | null
          id: string
          preferred_cities: string[] | null
          preferred_project_types: string[] | null
          preferred_typologies: string[] | null
          preferred_zones: string[] | null
          price_currency: string | null
          price_max: number | null
          price_min: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          preferred_cities?: string[] | null
          preferred_project_types?: string[] | null
          preferred_typologies?: string[] | null
          preferred_zones?: string[] | null
          price_currency?: string | null
          price_max?: number | null
          price_min?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          preferred_cities?: string[] | null
          preferred_project_types?: string[] | null
          preferred_typologies?: string[] | null
          preferred_zones?: string[] | null
          price_currency?: string | null
          price_max?: number | null
          price_min?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_matched_leads_for_developer: {
        Args: { _developer_id: string }
        Returns: {
          created_at: string
          email: string
          full_name: string
          lead_id: string
          lead_type: string
          match_count: number
          phone: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user" | "developer"
      project_status:
        | "preventa"
        | "en_pozo"
        | "en_construccion"
        | "entrega_inmediata"
      project_type: "departamentos" | "casas" | "barrio_cerrado" | "mixto"
      unit_typology:
        | "monoambiente"
        | "1_dormitorio"
        | "2_dormitorios"
        | "3_dormitorios"
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
      app_role: ["admin", "moderator", "user", "developer"],
      project_status: [
        "preventa",
        "en_pozo",
        "en_construccion",
        "entrega_inmediata",
      ],
      project_type: ["departamentos", "casas", "barrio_cerrado", "mixto"],
      unit_typology: [
        "monoambiente",
        "1_dormitorio",
        "2_dormitorios",
        "3_dormitorios",
      ],
    },
  },
} as const
