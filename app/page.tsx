import UploadPDF from "./components/UploadPDF";
import ChatBox from "./components/ChatBox";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0b0f0c] text-gray-100">
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">

        <header className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">
            <span className="text-green-400">Page</span>Query
          </h1>
          <p className="text-gray-400 max-w-2xl">
            Query pre-indexed books using Retrieval-Augmented Generation.
            Answers are grounded. No hallucinations. No fluff.
          </p>
        </header>

        <div className="h-px bg-gradient-to-r from-transparent via-green-500/40 to-transparent" />

        <section className="rounded-xl border border-green-500/20 bg-[#0f1512] p-6 space-y-4">
          <h2 className="text-lg font-semibold text-green-400">
            Upload a Book (PDF)
          </h2>
          <UploadPDF />
        </section>

        <section className="rounded-xl border border-green-500/20 bg-[#0f1512] p-6 space-y-4">
          <h2 className="text-lg font-semibold text-green-400">
            Ask Questions
          </h2>
          <ChatBox />
        </section>

        <footer className="pt-8 text-sm text-gray-500 text-center">
          Built with Next.js · Gemini · RAG
        </footer>

      </div>
    </main>
  );
}
