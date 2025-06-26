import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { generateTranscriptDocx } from 'src/common/helpers/doc-helper';
import { DeepgramService } from 'src/deepgram/deepgram.service';

@Processor('transcribe')
export class TranscribeProcessor {
  constructor(private readonly deepgramService: DeepgramService) {}
  @Process('transcribe-mp3')
  async handle(job: Job) {
    const buffer = Buffer.from(job.data.buffer);

    const result = await this.deepgramService.transcribe(buffer);

    await generateTranscriptDocx(result, 'transcript.docx');

    return result;
  }
}
