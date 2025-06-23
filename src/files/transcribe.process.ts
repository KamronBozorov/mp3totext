// import { Process, Processor } from '@nestjs/bull';
// import { Job } from 'bullmq';
// import child_process from 'child_process';
// import * as fs from 'fs';
// import * as path from 'path';

// @Processor('transcribe')
// export class TranscribeProcessor {
//   @Process('transcribe-mp3')
//   async handle(job: Job) {
//     console.log(`1`);
//     const filename = job.data.filename;
//     console.log(`2`);

//     // const filePath = path.join(
//     //   __dirname,
//     //   '../..',
//     //   'FS',
//     //   'scripts',
//     //   'transcribe.py',
//     // );

//     // if (!fs.existsSync(filePath)) {
//     //   console.error('❌ Python fayl topilmadi:', filePath);
//     //   return;
//     // }

//     // const pythonPath =
//     //   '/Users/bozorovkamron/Desktop/StartUp/Audio_Transcript/whisperx-env/bin/python3';
//     // const python = child_process.spawn(pythonPath, [filePath, filename]);

//     // python.stdout.on('data', (data) => {
//     //   console.log('PYTHON STDOUT:', data.toString());
//     // });
//     // python.stderr.on('data', (data) => {
//     //   console.log('PYTHON STDERR:', data.toString());
//     // });
//     // python.on('close', (code) => {
//     //   console.log(`Python process exited with code ${code}`);
//     // });

//     const filePath = path.join(
//       __dirname,
//       '../..',
//       'FS',
//       'scripts',
//       'hello.py', // <-- use hello.py
//     );

//     const pythonPath =
//       '/Users/bozorovkamron/Desktop/StartUp/Audio_Transcript/whisperx-env/bin/python3';
//     const python = child_process.spawn(pythonPath, [filePath, 'test_argument']);

//     python.stdout.on('data', (data) => {
//       console.log('PYTHON STDOUT:', data.toString());
//     });
//     python.stderr.on('data', (data) => {
//       console.log('PYTHON STDERR:', data.toString());
//     });
//     python.on('close', (code) => {
//       console.log(`Python process exited with code ${code}`);
//     });

//     return { status: 'done' };
//   }
// }
