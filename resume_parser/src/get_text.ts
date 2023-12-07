import fs from 'fs'
import pdf from 'pdf-parse'
import mammoth from 'mammoth'

async function extractText(filePath: string): Promise<string> {
  const [, fileExtension] = filePath.split('.').reverse()

  if (fileExtension.toLowerCase() === 'pdf') {
    return extractTextFromPdf(filePath)
  } else if (fileExtension.toLowerCase() === 'docx') {
    return extractTextFromDocx(filePath)
  } else {
    return 'Unsupported file type'
  }
}

async function extractTextFromPdf(pdfPath: string): Promise<string> {
  const dataBuffer = fs.readFileSync(pdfPath)
  const data = await pdf(dataBuffer)
  return data.text
}

async function extractTextFromDocx(docxPath: string): Promise<string> {
  const dataBuffer = fs.readFileSync(docxPath)
  const result = await mammoth.extractRawText({ arrayBuffer: dataBuffer })
  return result.value
}

async function main() {
  const filePath = '../Sidney-Nelson.resume copy.pdf' // Replace with the path to your PDF or DOCX file
  const extractedText = await extractText(filePath)

  console.log('Extracted Text:')
  console.log(extractedText)
}

main()
