// install.js
const { exec } = require('child_process');
const events = require('events');
events.EventEmitter.defaultMaxListeners = 20;

exec('npm install', (err, stdout, stderr) => {
  if (err) {
    console.error(`Error: ${err.message}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
});
