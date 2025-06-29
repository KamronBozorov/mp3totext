import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(FilesInterceptor('file', 4))
  uploadFile(
    @UploadedFiles()
    files: Array<Express.Multer.File>,
  ) {
    return this.filesService.uploadFile(files);
  }
}
