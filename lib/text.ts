
export function sanitizeText(text: string): string {
  return text
    .replace(/\s+/g, " ") 
    .replace(/(\w)-\s+(\w)/g, "$1$2")
    .trim();
}

export function chunkText(
  text: string, 
  chunkSize: number = 800, 
  overlap: number = 100
): string[] {
  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    const end = start + chunkSize;
    
    let chunk = text.slice(start, end);
    
    chunks.push(chunk);
    
    start += chunkSize - overlap;
  }

  return chunks;
}