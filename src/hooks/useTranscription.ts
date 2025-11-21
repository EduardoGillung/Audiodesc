import { useState } from "react";
import { TranscriptionService } from "@/lib/services/transcription.service";

export function useTranscription() {
  const [loading, setLoading] = useState(false);

  const transcribeUrl = async (url: string) => {
    setLoading(true);
    try {
      const data = await TranscriptionService.transcribeFromUrl(url);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const transcribeFile = async (file: File) => {
    setLoading(true);
    try {
      const data = await TranscriptionService.transcribeFromFile(file);
      return data;
    } finally {
      setLoading(false);
    }
  };

  return { transcribeUrl, transcribeFile, loading };
}
