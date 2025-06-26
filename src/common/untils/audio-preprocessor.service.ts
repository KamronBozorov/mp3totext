import { Injectable } from '@nestjs/common';
import { spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AudioPreprocessorService {
  async convertion(
    buffer: Buffer,
    tempDir: string = 'temp_segments',
  ): Promise<string[]> {
    return new Promise((resolve, reject) => {
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      const rnnoiseModelPath = path.resolve(
        __dirname,
        '../../../src/common/untils/rnnoise-models/somnolent-hogwash-2018-09-01/sh.rnnn',
      );

      if (!fs.existsSync(rnnoiseModelPath)) {
        throw new Error(
          `RNNoise modeli topilmadi: ${rnnoiseModelPath}. Yuklab oling: https://github.com/GregorR/rnnoise-models`,
        );
      }

      const outputPattern = path.join(tempDir, 'segment-%03d.wav');
      const ffmpeg = spawn(
        'ffmpeg',
        [
          '-i',
          'pipe:0',
          '-ac',
          '1',
          '-ar',
          '16000',
          `-af`,
          `arnndn=m='${rnnoiseModelPath}',loudnorm=I=-16:TP=-1.5:LRA=11,`,
          '-c:a',
          'pcm_s16le',
          '-f',
          'segment',
          '-segment_time',
          '80',
          outputPattern,
        ],
        { stdio: ['pipe', 'pipe', 'pipe'] },
      );

      const segmentFiles: string[] = [];

      ffmpeg.stderr.on('data', (chunk) => {
        console.error('FFmpeg stderr:', chunk.toString());
        const log = chunk.toString();
        const match = log.match(/Opening '(.+?)' for writing/);
        if (match) {
          segmentFiles.push(match[1]);
        }
      });

      ffmpeg.on('close', (code) => {
        if (code === 0) {
          resolve(segmentFiles);
        } else {
          reject(new Error(`FFmpeg exited with code ${code}`));
        }
      });

      ffmpeg.stdin.on('error', (err) =>
        console.error('FFmpeg stdin xatosi:', err.message),
      );
      ffmpeg.stdout.on('error', (err) =>
        console.error('FFmpeg stdout xatosi:', err.message),
      );

      ffmpeg.stdin.write(buffer);
      ffmpeg.stdin.end();
    });
  }
}
