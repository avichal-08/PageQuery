import { generateEmbeddings, generateAnswerStream } from "@/lib/gemini";
import { queryVectors } from "@/lib/vector";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    const embeddings = await generateEmbeddings([query]);
    const relevantDocs = queryVectors(embeddings[0], 3);
    const context = relevantDocs.map((d) => d.content).join("\n\n---\n\n");

    const geminiStream = await generateAnswerStream(context, query);

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        
        try {
          for await (const chunk of geminiStream) {
            const text = chunk.text();
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
        } catch (e) {
          console.error("Stream Error:", e);
          controller.error(e);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}