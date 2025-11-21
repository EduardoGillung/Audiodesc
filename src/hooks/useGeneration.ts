import { useState } from "react";
import { GenerationService } from "@/lib/services/generation.service";

export function useGeneration() {
  const [loading, setLoading] = useState(false);

  const generateResponse = async (text: string) => {
    setLoading(true);
    try {
      const data = await GenerationService.generateResponse(text);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const generateTasks = async (text: string) => {
    setLoading(true);
    try {
      const data = await GenerationService.generateTasks(text);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const generateSummary = async (text: string) => {
    setLoading(true);
    try {
      const data = await GenerationService.generateSummary(text);
      return data;
    } finally {
      setLoading(false);
    }
  };

  return { generateResponse, generateTasks, generateSummary, loading };
}
