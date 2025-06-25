import * as fs from 'fs';
import { Document, Packer, Paragraph, TextRun } from 'docx';

export class DocGenerator {
  constructor() {}

  generateDoc() {
    const doc = new Document({
      styles: {
        default: {
          document: {
            run: {
              // size 12.5
              size: 12.5,
              font: 'Arial',
            },
          },
        },
      },
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun('Hello World'),
                new TextRun({
                  text: 'Foo Bar',
                  bold: true,
                }),
                new TextRun({
                  text: '\tGithub is the best',
                  bold: true,
                }),
              ],
            }),
          ],
        },
      ],
    });

    Packer.toBuffer(doc).then((buffer) => {
      fs.writeFileSync('My Document.docx', buffer);
    });
  }
}
