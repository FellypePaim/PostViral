export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      user_settings: {
        Row: {
          id: string;
          user_id: string;
          gemini_api_key: string | null;
          preferred_image_model: string;
          display_name: string | null;
          avatar_url: string | null;
          plan: string;
          plan_expires_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          gemini_api_key?: string | null;
          preferred_image_model?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          plan?: string;
          plan_expires_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          gemini_api_key?: string | null;
          preferred_image_model?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          plan?: string;
          plan_expires_at?: string | null;
          created_at?: string;
        };
      };
      collections: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          created_at?: string;
        };
      };
      carousels: {
        Row: {
          id: string;
          user_id: string;
          title: string | null;
          topic: string | null;
          post_style: string;
          slide_count: number;
          thumbnail: string | null;
          collection_id: string | null;
          slides_data: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title?: string | null;
          topic?: string | null;
          post_style?: string;
          slide_count?: number;
          thumbnail?: string | null;
          collection_id?: string | null;
          slides_data?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string | null;
          topic?: string | null;
          post_style?: string;
          slide_count?: number;
          thumbnail?: string | null;
          collection_id?: string | null;
          slides_data?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      templates: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          preview_url: string | null;
          config: Json;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          preview_url?: string | null;
          config: Json;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          preview_url?: string | null;
          config?: Json;
          is_active?: boolean;
          created_at?: string;
        };
      };
      training_profiles: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          instagram_handle: string | null;
          niche: string | null;
          target_audience: string | null;
          tone_of_voice: string | null;
          content_type: string | null;
          extra_instructions: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          instagram_handle?: string | null;
          niche?: string | null;
          target_audience?: string | null;
          tone_of_voice?: string | null;
          content_type?: string | null;
          extra_instructions?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          instagram_handle?: string | null;
          niche?: string | null;
          target_audience?: string | null;
          tone_of_voice?: string | null;
          content_type?: string | null;
          extra_instructions?: string | null;
          created_at?: string;
        };
      };
      calendars: {
        Row: {
          id: string;
          user_id: string;
          niche: string;
          period: number;
          content_types: string[] | null;
          days_data: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          niche: string;
          period?: number;
          content_types?: string[] | null;
          days_data?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          niche?: string;
          period?: number;
          content_types?: string[] | null;
          days_data?: Json | null;
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
