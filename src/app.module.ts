import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { FilesModule } from './files/files.module';
import { DeepgramModule } from './deepgram/deepgram.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'transcribe',
    }),
    FilesModule,
    DeepgramModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
