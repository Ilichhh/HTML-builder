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
        fs.stat(filePath, (err, stats) => {
          if (err) {
            console.log(err)
          } else {
            let size = (stats.size / 1024).toFixed(3);
            console.log(`${name} - ${extension} - ${size}kb`);
          }
        })
      }
  })();
} catch (err) {
  console.error(err);
}
