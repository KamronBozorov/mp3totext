import { createClient } from '@deepgram/sdk';
import { Injectable } from '@nestjs/common';
import * as retry from 'async-retry';
import * as fs from 'fs';
import { join } from 'path';
import { AudioPreprocessorService } from 'src/common/untils/audio-preprocessor.service';

@Injectable()
export class DeepgramService {
  private deepgram: any;

  constructor(private readonly audioPreProcessor: AudioPreprocessorService) {
    this.deepgram = createClient(process.env.DEEPGRAM_API_KEY);
  }
  async transcribeSegment(filePath: string) {
    try {
      return await retry(
        async () => {
          console.log('Men deepgramdan chiqib keldim');
          console.log(filePath);
          const audioStream = fs.createReadStream(filePath);
          const result = await this.deepgram.listen.prerecorded.transcribeFile(
            audioStream,
            {
              model: 'nova-3',
              language: 'en-US',
              punctuate: true,
              diarize: true,
              smart_format: true,
            },
          );

          if (result.error) {
            throw new Error(result.error.message || 'Transkripsiya xatosi');
          }

          return result.result.results.channels[0].alternatives[0].paragraphs
            .paragraphs;
        },
        {
          retries: 3,
          factor: 2,
          minTimeout: 1000,
          maxTimeout: 5000,
        },
      );
    } catch (err) {
      console.error(`Segment transkripsiya xatosi (${filePath}):`, err);
      throw err;
    }
  }

  async transcribe(buffer: Buffer) {
    try {
      console.log('Men trans danman');

      const tempDir = join(__dirname, '../../..', 'FS', 'temp_segments');

      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      const segmentFiles = await this.audioPreProcessor.convertion(
        buffer,
        tempDir,
      );

      const transcriptions: any = [];
      console.log(segmentFiles);
      for (const filePath of segmentFiles) {
        console.info(`Transcribing segment: ${filePath}`);
        const transcript = await this.transcribeSegment(filePath);
        transcriptions.push(...transcript);
      }

      console.log(transcriptions);
      fs.writeFileSync(
        'transcription.json',
        JSON.stringify(transcriptions, null, 2),
      );

      fs.rmSync(tempDir, { recursive: true, force: true });

      return transcriptions;
    } catch (err) {
      console.error('Umumiy xato:', err);
      throw err;
    }
  }
}

//const transcription = JSON.stringify(
//  response.result.results.channels[0].alternatives[0].paragraphs
//    .paragraphs,
//  null,
//  2,
//);
