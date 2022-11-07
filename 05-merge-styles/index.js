const path = require('path');
const fs = require('fs');
const { readdir } = require('fs/promises');

const sourceFolder = path.join(__dirname, 'styles');
const bundle = path.join(__dirname, 'project-dist', 'bundle.css')


async function deleteBoundle() {
  fs.unlink(bundle, (err) => {
    err ? console.log(`bundle.css not found, creating...`) : console.log(`bundle.css recreated`);
  });
}

async function copyFiles() {
  const sourceFiles = await readdir(sourceFolder, {withFileTypes: true});

  for (let file of sourceFiles) {
    try {
      if (file.isFile() && path.extname(file.name) === '.css') {
        const sourceFile = path.join(sourceFolder, file.name);
        const rs = fs.createReadStream(sourceFile);

        rs.on('data', chunk => {
          fs.appendFile(bundle, chunk.toString(),
            err => {
              if (err) throw err;
            }
          );
        })
        rs.on('end', () => console.log(`${file.name} added to bundle.css`));
      }
    } catch (err) {
      console.error(err.message);
    }
  }
}

deleteBoundle();
copyFiles();
