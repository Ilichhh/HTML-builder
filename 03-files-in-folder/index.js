const path = require('path');
const fs = require('fs');

const secretFolder = path.join(__dirname, 'secret-folder');

try {
  (async () => {
    const files = await fs.promises.readdir(secretFolder, {withFileTypes: true});
    for (let file of files)
      if (file.isFile()) {
        let filePath = path.join(secretFolder, file.name);
        let name = path.parse(filePath).name;
        let extension = path.extname(file.name).slice(1);
        let size = fs.statSync(filePath).size / 1024;
        console.log(`${name} - ${extension} - ${size.toFixed(3)}kb`);
      }
  })();
} catch (err) {
  console.error(err);
}
