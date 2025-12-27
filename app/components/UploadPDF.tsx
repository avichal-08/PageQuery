"use client";

import { useState } from "react";

export default function UploadPDF() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<"success" | "error" | "idle">("idle");

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setStatus("idle");

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/ingest", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setStatus("success");
      setMessage(`Indexed ${data.stats.chunks} chunks (${data.stats.chars} chars)`);
    } catch (error: any) {
      console.error(error);
      setStatus("error");
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleUpload} className="flex flex-col gap-4">
        <div className="relative">
          <input
            type="file"
            name="file"
            accept="application/pdf"
            required
            className="block w-full text-sm text-gray-400
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-green-500/10 file:text-green-400
              hover:file:bg-green-500/20
              cursor-pointer focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full rounded-md px-4 py-2 text-sm font-medium transition-colors
            ${
              loading
                ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                : "bg-green-600 text-black hover:bg-green-500"
            }
          `}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-500 border-t-black" />
              Indexing...
            </span>
          ) : (
            "Upload & Index"
          )}
        </button>
      </form>

      {/* Status Message */}
      {message && (
        <div
          className={`p-3 rounded-md text-sm border ${
            status === "success"
              ? "bg-green-500/10 border-green-500/20 text-green-400"
              : "bg-red-500/10 border-red-500/20 text-red-400"
          }`}
        >
          {status === "success" ? "Done " : "Failed "}
          {message}
        </div>
      )}
    </div>
  );
}