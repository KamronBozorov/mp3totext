import { Module } from '@nestjs/common';
import { DeepgramService } from './deepgram.service';
import { AudioPreprocessorService } from 'src/common/untils/audio-preprocessor.service';

@Module({
  providers: [DeepgramService, AudioPreprocessorService],
  exports: [DeepgramService],
})
export class DeepgramModule {}
