
export interface DocumentVector {
  id: string;
  content: string;
  embedding: number[];
  metadata?: Record<string, any>;
}

const globalForVectors = global as unknown as { vectorStore: DocumentVector[] };
export const vectorStore = globalForVectors.vectorStore || [];
if (process.env.NODE_ENV !== "production") globalForVectors.vectorStore = vectorStore;

function cosineSimilarity(vecA: number[], vecB: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export function addVectors(vectors: DocumentVector[]) {
  vectorStore.push(...vectors);
  console.log(`✅ Added ${vectors.length} vectors to store. Total: ${vectorStore.length}`);
}

export function queryVectors(queryEmbedding: number[], topK: number = 3): DocumentVector[] {
  return vectorStore
    .map((doc) => ({
      ...doc,
      similarity: cosineSimilarity(queryEmbedding, doc.embedding),
    }))
    .sort((a, b) => b.similarity - a.similarity) // Sort descending
    .slice(0, topK); // Take top K
}