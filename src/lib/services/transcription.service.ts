export class TranscriptionService {
  static async transcribeFromUrl(url: string): Promise<{ text?: string; error?: string }> {
    const res = await fetch("/api/transcribe/url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    return res.json();
  }

  static async transcribeFromFile(file: File): Promise<{ text?: string; error?: string }> {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/transcribe", {
      method: "POST",
      body: formData,
    });
    return res.json();
  }
}
