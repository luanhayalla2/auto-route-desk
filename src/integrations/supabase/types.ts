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
      categorias: {
        Row: {
          created_at: string
          descricao: string | null
          id: string
          nome: string
        }
        Insert: {
          created_at?: string
          descricao?: string | null
          id?: string
          nome: string
        }
        Update: {
          created_at?: string
          descricao?: string | null
          id?: string
          nome?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          matricula: string | null
          nome: string
          setor: string | null
          unidade_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          matricula?: string | null
          nome: string
          setor?: string | null
          unidade_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          matricula?: string | null
          nome?: string
          setor?: string | null
          unidade_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_unidade_id_fkey"
            columns: ["unidade_id"]
            isOneToOne: false
            referencedRelation: "unidades"
            referencedColumns: ["id"]
          },
        ]
      }
      subcategorias: {
        Row: {
          categoria_id: string
          created_at: string
          id: string
          nivel_padrao: Database["public"]["Enums"]["ticket_level"]
          nome: string
          prioridade_padrao: Database["public"]["Enums"]["ticket_priority"]
          sla_horas: number
        }
        Insert: {
          categoria_id: string
          created_at?: string
          id?: string
          nivel_padrao?: Database["public"]["Enums"]["ticket_level"]
          nome: string
          prioridade_padrao?: Database["public"]["Enums"]["ticket_priority"]
          sla_horas?: number
        }
        Update: {
          categoria_id?: string
          created_at?: string
          id?: string
          nivel_padrao?: Database["public"]["Enums"]["ticket_level"]
          nome?: string
          prioridade_padrao?: Database["public"]["Enums"]["ticket_priority"]
          sla_horas?: number
        }
        Relationships: [
          {
            foreignKeyName: "subcategorias_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_avaliacoes: {
        Row: {
          comentario: string | null
          created_at: string
          id: string
          nota_comunicacao: number
          nota_cordialidade: number
          nota_qualidade: number
          nota_rapidez: number
          nota_solucao: number
          ticket_id: string
          user_id: string
        }
        Insert: {
          comentario?: string | null
          created_at?: string
          id?: string
          nota_comunicacao: number
          nota_cordialidade: number
          nota_qualidade: number
          nota_rapidez: number
          nota_solucao: number
          ticket_id: string
          user_id: string
        }
        Update: {
          comentario?: string | null
          created_at?: string
          id?: string
          nota_comunicacao?: number
          nota_cordialidade?: number
          nota_qualidade?: number
          nota_rapidez?: number
          nota_solucao?: number
          ticket_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_avaliacoes_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: true
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_historico: {
        Row: {
          acao: string
          created_at: string
          descricao: string | null
          id: string
          metadata: Json | null
          ticket_id: string
          user_id: string | null
        }
        Insert: {
          acao: string
          created_at?: string
          descricao?: string | null
          id?: string
          metadata?: Json | null
          ticket_id: string
          user_id?: string | null
        }
        Update: {
          acao?: string
          created_at?: string
          descricao?: string | null
          id?: string
          metadata?: Json | null
          ticket_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ticket_historico_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      tickets: {
        Row: {
          atribuido_id: string | null
          categoria_id: string | null
          closed_at: string | null
          created_at: string
          descricao: string
          due_at: string | null
          id: string
          nivel: Database["public"]["Enums"]["ticket_level"]
          numero: string | null
          prioridade: Database["public"]["Enums"]["ticket_priority"]
          resolved_at: string | null
          sla_horas: number
          solicitante_id: string
          status: Database["public"]["Enums"]["ticket_status"]
          subcategoria_id: string | null
          titulo: string
          unidade_id: string | null
          updated_at: string
        }
        Insert: {
          atribuido_id?: string | null
          categoria_id?: string | null
          closed_at?: string | null
          created_at?: string
          descricao: string
          due_at?: string | null
          id?: string
          nivel?: Database["public"]["Enums"]["ticket_level"]
          numero?: string | null
          prioridade?: Database["public"]["Enums"]["ticket_priority"]
          resolved_at?: string | null
          sla_horas?: number
          solicitante_id: string
          status?: Database["public"]["Enums"]["ticket_status"]
          subcategoria_id?: string | null
          titulo: string
          unidade_id?: string | null
          updated_at?: string
        }
        Update: {
          atribuido_id?: string | null
          categoria_id?: string | null
          closed_at?: string | null
          created_at?: string
          descricao?: string
          due_at?: string | null
          id?: string
          nivel?: Database["public"]["Enums"]["ticket_level"]
          numero?: string | null
          prioridade?: Database["public"]["Enums"]["ticket_priority"]
          resolved_at?: string | null
          sla_horas?: number
          solicitante_id?: string
          status?: Database["public"]["Enums"]["ticket_status"]
          subcategoria_id?: string | null
          titulo?: string
          unidade_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tickets_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_subcategoria_id_fkey"
            columns: ["subcategoria_id"]
            isOneToOne: false
            referencedRelation: "subcategorias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_unidade_id_fkey"
            columns: ["unidade_id"]
            isOneToOne: false
            referencedRelation: "unidades"
            referencedColumns: ["id"]
          },
        ]
      }
      unidades: {
        Row: {
          cidade: string | null
          created_at: string
          id: string
          nome: string
          sigla: string
        }
        Insert: {
          cidade?: string | null
          created_at?: string
          id?: string
          nome: string
          sigla: string
        }
        Update: {
          cidade?: string | null
          created_at?: string
          id?: string
          nome?: string
          sigla?: string
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_staff: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role:
        | "admin"
        | "gestor"
        | "tecnico_n1"
        | "tecnico_n2"
        | "tecnico_n3"
        | "solicitante"
      ticket_level: "N1" | "N2" | "N3"
      ticket_priority: "baixa" | "media" | "alta" | "critica"
      ticket_status:
        | "aberto"
        | "em_andamento"
        | "aguardando_validacao"
        | "resolvido"
        | "reaberto"
        | "fechado"
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
      app_role: [
        "admin",
        "gestor",
        "tecnico_n1",
        "tecnico_n2",
        "tecnico_n3",
        "solicitante",
      ],
      ticket_level: ["N1", "N2", "N3"],
      ticket_priority: ["baixa", "media", "alta", "critica"],
      ticket_status: [
        "aberto",
        "em_andamento",
        "aguardando_validacao",
        "resolvido",
        "reaberto",
        "fechado",
      ],
    },
  },
} as const
