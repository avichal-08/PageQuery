export function chunkText(
  text: string,
  chunkSize = 800,
  overlap = 150
) {
  const chunks: string[] = [];

  for (let i = 0; i < text.length; i += chunkSize - overlap) {
    chunks.push(text.slice(i, i + chunkSize));
  }

  return chunks;
}
