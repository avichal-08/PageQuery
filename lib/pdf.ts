
const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.js");

export async function extractTextFromPDF(
  data: Uint8Array
): Promise<string> {

  const loadingTask = pdfjsLib.getDocument({
    data,
    useSystemFonts: true,
    disableFontFace: true,
  });

  const pdf = await loadingTask.promise;
  let fullText = "";

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    
    const pageText = content.items
      .map((item: any) => item.str)
      .join(" ");
      
    fullText += pageText + "\n\n";
  }

  return fullText;
}