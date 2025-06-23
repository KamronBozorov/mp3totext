import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { FilesModule } from './files/files.module';

@Module({
  imports: [
    FilesModule,
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'transcribe',
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
