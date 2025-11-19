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
      transcriptions: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          user_id: string;
          title: string;
          description: string | null;
          audio_url: string;
          transcription_text: string | null;
          status: "pending" | "processing" | "completed" | "failed";
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          user_id: string;
          title: string;
          description?: string | null;
          audio_url: string;
          transcription_text?: string | null;
          status?: "pending" | "processing" | "completed" | "failed";
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          audio_url?: string;
          transcription_text?: string | null;
          status?: "pending" | "processing" | "completed" | "failed";
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}
