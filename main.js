const { spawn, exec } = require('child_process');

const sp = exec('ls -la');

sp.stdout.on('data', (data) => {
  console.log(data.toString());
});
