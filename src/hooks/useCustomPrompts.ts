import { useState, useEffect } from "react";

export interface CustomPrompt {
  id: string;
  title: string;
  prompt: string;
  icon: string;
  color: string;
  order_index: number;
}

export function useCustomPrompts() {
  const [prompts, setPrompts] = useState<CustomPrompt[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPrompts = async () => {
    try {
      const res = await fetch("/api/custom-prompts");
      const data = await res.json();
      if (data.prompts) {
        setPrompts(data.prompts);
      }
    } catch (error) {
      console.error("Error fetching prompts:", error);
    }
  };

  const createPrompt = async (
    title: string,
    prompt: string,
    icon?: string,
    color?: string
  ) => {
    setLoading(true);
    try {
      const res = await fetch("/api/custom-prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, prompt, icon, color }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create prompt");
      }
      
      const data = await res.json();
      if (data.prompt) {
        setPrompts((prev) => [...prev, data.prompt]);
        return data.prompt;
      } else {
        throw new Error("No prompt returned from API");
      }
    } catch (error) {
      console.error("Error creating prompt:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updatePrompt = async (
    id: string,
    title: string,
    prompt: string,
    icon?: string,
    color?: string
  ) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/custom-prompts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, prompt, icon, color }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update prompt");
      }
      
      const data = await res.json();
      if (data.prompt) {
        setPrompts((prev) =>
          prev.map((p) => (p.id === id ? data.prompt : p))
        );
        return data.prompt;
      }
    } catch (error) {
      console.error("Error updating prompt:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deletePrompt = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/custom-prompts/${id}`, {
        method: "DELETE",
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete prompt");
      }
      
      setPrompts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error deleting prompt:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrompts();
  }, []);

  return {
    prompts,
    loading,
    createPrompt,
    updatePrompt,
    deletePrompt,
    refreshPrompts: fetchPrompts,
  };
}
