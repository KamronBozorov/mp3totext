import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { BullModule } from '@nestjs/bullmq';
import { TranscribeProcessor } from '../../FS/scripts/test_pyhton';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'transcribe',
    }),
  ],
  controllers: [FilesController],
  providers: [FilesService, TranscribeProcessor],
})
export class FilesModule {}
