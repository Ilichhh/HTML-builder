const path = require('path');
const { unlink } = require('fs');
const { mkdir, readdir, copyFile} = require('fs/promises');

const sourceFolder = path.join(__dirname, 'files');
const newFolder = path.join(__dirname, 'files-copy');


async function createDir() {
  try {
    await mkdir(newFolder, { recursive: true });
  } catch (err) {
    console.error(err.message);
  }
}

async function copyFiles(sourceFiles) {
  for (let file of sourceFiles) {
    try {
      const sourceFile = path.join(sourceFolder, file);
      const newFile = path.join(newFolder, file);
      await copyFile(sourceFile, newFile);
      console.log(`${file} was copied`);
    } catch (err) {
      console.error(err.message);
    }
  }
}

async function deleteFiles(sourceFiles) {
  const copiedFiles = await readdir(newFolder);
  for (let file of copiedFiles) {
    if (!sourceFiles.includes(file)) {
      const fileToDelete = path.join(newFolder, file);
      unlink(fileToDelete, (err) => {
        if (err) console.error(err.message);
        console.log(`${file} was deleted`);
      });
    }
  }
}

async function copyDir () {
  const sourceFiles = await readdir(sourceFolder);
  await createDir();
  await copyFiles(sourceFiles);
  await deleteFiles(sourceFiles);
}

copyDir();
