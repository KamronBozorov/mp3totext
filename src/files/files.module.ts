import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { BullModule } from '@nestjs/bull';
import { DeepgramModule } from 'src/deepgram/deepgram.module';
import { TranscribeProcessor } from 'src/common/queue/transcribe.process';
import { AudioPreprocessorService } from 'src/common/untils/audio-preprocessor.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'transcribe',
    }),
    DeepgramModule,
  ],
  controllers: [FilesController],
  providers: [FilesService, TranscribeProcessor, AudioPreprocessorService],
})
export class FilesModule {}
