const path = require('path');
const fs = require('fs');
const { stdin } = require('process');

const newFile = path.join(__dirname, 'text.txt')

function exit() {
  console.log('Я все записал, удачи!');
  process.exit();
}

process.on('SIGINT', exit);

fs.writeFile(newFile, '',
  err => {
    if (err) throw err;
    console.log('Введи текст');
  }
);

stdin.on('data', data => {
  if (data.toString().trim() === 'exit') exit();
  fs.appendFile(newFile, data.toString(),
    err => {
      if (err) throw err;
    }
  );
});
