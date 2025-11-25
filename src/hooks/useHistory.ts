import { useState, useEffect } from "react";

export interface HistoryItem {
  id: string;
  title: string;
  transcription_text: string;
  created_at: string;
}

export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/history");
      const data = await res.json();
      if (data.history) {
        setHistory(data.history);
      }
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteHistoryItem = async (id: string) => {
    try {
      const res = await fetch(`/api/history/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete history item");
      }

      setHistory((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting history item:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return {
    history,
    loading,
    deleteHistoryItem,
    refreshHistory: fetchHistory,
  };
}
