import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { DeepgramService } from 'src/deepgram/deepgram.service';
import { DocGenerator } from 'src/helpers/doc-helper';

@Processor('transcribe')
export class TranscribeProcessor {
  constructor(private readonly deepgramService: DeepgramService) {}
  @Process('transcribe-mp3')
  async handle(job: Job) {
    const filePath = job.data.filePath;

    const result = await this.deepgramService.transcribe(filePath);

    const res = JSON.stringify(
      result.results.channels[0].alternatives,
      null,
      2,
    );

    new DocGenerator().generateDoc();

    return res;
  }
}
