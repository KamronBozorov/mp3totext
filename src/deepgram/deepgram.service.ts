import { createClient } from '@deepgram/sdk';
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as docx from 'docx';

@Injectable()
export class DeepgramService {
  private deepgram: any;

  constructor() {
    this.deepgram = createClient(process.env.DEEPGRAM_API_KEY);
  }
  async transcribe(filePath: string) {
    try {
      const response = await this.deepgram.listen.prerecorded.transcribeFile(
        fs.createReadStream(filePath),
        { model: 'nova-3', language: 'en-US', punctuate: true, diarize: true },
      );

      if (response.error) {
        console.error('Deepgram xatosi:', response.error);
        throw new Error(response.error.message || 'Transkripsiya xatosi');
      }

      console.log('Natija:', JSON.stringify(response.result, null, 2));
      return response.result;
    } catch (err) {
      console.error('Umumiy xato:', err);
      throw err;
    }
  }
}
