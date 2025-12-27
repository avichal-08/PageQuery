import { NextResponse } from "next/server";
import { extractTextFromPDF } from "@/lib/pdf";
import { sanitizeText, chunkText } from "@/lib/text";
import { generateEmbeddings } from "@/lib/gemini";
import { addVectors } from "@/lib/vector";
import { v4 as uuidv4 } from "uuid";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = new Uint8Array(await file.arrayBuffer());
    const rawText = await extractTextFromPDF(buffer);

    const cleanedText = sanitizeText(rawText);

    const chunks = chunkText(cleanedText);

    const embeddings = await generateEmbeddings(chunks);

    const vectors = chunks.map((chunk, i) => ({
      id: uuidv4(),
      content: chunk,
      embedding: embeddings[i],
      metadata: { source: file.name, chunkIndex: i },
    }));

    addVectors(vectors);

    return NextResponse.json({ 
      success: true, 
      stats: {
        chars: cleanedText.length,
        chunks: chunks.length,
      }
    });

  } catch (error: any) {
    console.error("Ingestion error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}