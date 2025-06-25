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

      const uploadsDir = path.join(__dirname, '../../..', 'FS', 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const filePath = path.join(uploadsDir, fileName);
      fs.writeFileSync(filePath, file.buffer);

      await this.queueTranscription(filePath);
    }
  }

  async queueTranscription(filePath: string) {
    await this.transcribeQueue.add('transcribe-mp3', { filePath });
  }
}
