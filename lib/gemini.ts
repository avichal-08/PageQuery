import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const embeddingModel = genAI.getGenerativeModel({ 
  model: "text-embedding-004" 
});

const chatModel = genAI.getGenerativeModel({ 
  model: "gemini-2.5-flash" 
});

export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  const embeddings: number[][] = [];
  for (const text of texts) {
    const result = await embeddingModel.embedContent(text);
    embeddings.push(result.embedding.values);
  }
  return embeddings;
}

export async function generateAnswerStream(context: string, question: string) {
  const prompt = `
    You are a helpful assistant. Use the context below to answer the question.
    Format your answer in Markdown.
    Context:
    ${context}
    
    Question: 
    ${question}
  `;

  const result = await chatModel.generateContentStream(prompt);
  
  return result.stream;
}