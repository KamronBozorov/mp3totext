import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { DeepgramService } from 'src/deepgram/deepgram.service';
import { generateTranscriptDocx } from 'src/common/helpers/doc-helper';

@Processor('transcribe')
export class TranscribeProcessor {
  constructor(private readonly deepgramService: DeepgramService) {}
  @Process('transcribe-mp3')
  async handle(job: Job) {
    console.log("Men queue'dan chiqib keldim");
    const buffer = Buffer.from(job.data.buffer);

    const result = await this.deepgramService.transcribe(buffer);

    console.log('Men deepgramdan chiqib keldim');
    await generateTranscriptDocx(result, 'transcript.docx');

    console.log("Men docx'dan chiqib keldim");
    return result;
  }
}
