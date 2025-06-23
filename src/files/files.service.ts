import { InjectQueue } from '@nestjs/bullmq';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FilesService {
  constructor(@InjectQueue('transcribe') private transcribeQueue: Queue) {}

  async uploadFile(files: Array<Express.Multer.File>) {
    for (const file of files) {
      if (!file.mimetype.includes('audio/mpeg')) {
        throw new BadRequestException(`${file.originalname} is not an MP3`);
      }

      if (!file.originalname.endsWith('.mp3')) {
        throw new BadRequestException(`Only .mp3 files allowed`);
      }

      const fileName = uuidv4() + '.mp3';

      const filePath = path.join(
        __dirname,
        '../../..',
        'FS',
        'uploads',
        fileName,
      );

      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, file.buffer);
      }

      await this.queueTranscription(filePath);
    }
  }

  async queueTranscription(filename: string) {
    await this.transcribeQueue.add('transcribe-mp3', { filename });
  }
}
