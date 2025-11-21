export class GenerationService {
  static async generateResponse(text: string): Promise<{ response?: string; error?: string }> {
    const res = await fetch("/api/generate/response", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    return res.json();
  }

  static async generateTasks(text: string): Promise<{ tasks?: string; error?: string }> {
    const res = await fetch("/api/generate/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    return res.json();
  }

  static async generateSummary(text: string): Promise<{ summary?: string; error?: string }> {
    const res = await fetch("/api/generate/summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    return res.json();
  }
}
