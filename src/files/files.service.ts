import { BadRequestException, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FilesService {
  async uploadFile(files: Array<Express.Multer.File>) {
    await this.validateFile(files);
    console.log(files);
  }

  async validateFile(files: Array<Express.Multer.File>) {
    for (const file of files) {
      if (!file.mimetype.includes('audio/mpeg')) {
        throw new BadRequestException(`${file.originalname} is not an MP3`);
      }

      if (!file.originalname.endsWith('.mp3')) {
        throw new BadRequestException(`Only .mp3 files allowed`);
      }
    }
  }
}
