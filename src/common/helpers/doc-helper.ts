import { Document, Packer, Paragraph, TextRun } from 'docx';
import { writeFileSync } from 'fs';
import * as path from 'path';

interface Sentence {
  text: string;
  start: number;
  end: number;
}

interface Block {
  sentences: Sentence[];
  speaker: number;
  num_words: number;
  start: number;
  end: number;
}

export async function generateTranscriptDocx(
  transcripts: Block[],
  filename: string,
) {
  const paragraphs: Paragraph[] = [];

  for (const block of transcripts) {
    // Har bir speaker uchun sarlavha qo‘shamiz
    paragraphs.push(
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: `Speaker ${block.speaker}:`,
            bold: true,
            break: 1,
          }),
        ],
      }),
    );

    for (const sentence of block.sentences) {
      paragraphs.push(
        new Paragraph({
          spacing: { after: 100 },
          children: [
            new TextRun({
              text: sentence.text,
              font: 'Arial',
              size: 24, // 12pt
            }),
          ],
        }),
      );
    }
  }

  const doc = new Document({
    sections: [
      {
        children: paragraphs,
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const filePath = path.join(
    __dirname,
    '../../..',
    'FS',
    'results',
    `${filename}`,
  );
  console.log(filePath);

  writeFileSync(filePath, buffer);
  return filePath;
}
