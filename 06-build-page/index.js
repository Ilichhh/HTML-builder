const path = require('path');
const fs = require('fs');
const { readdir, mkdir, readFile, writeFile, copyFile } = require('fs/promises');

const projectDist = path.join(__dirname, 'project-dist');
const styles = path.join(__dirname, 'project-dist', 'style.css');
const html = path.join(__dirname, 'project-dist', 'index.html');

const componentsHTML = {};


async function buildHTML() {
  const componentsFolder = path.join(__dirname, 'components');
  const template = path.join(__dirname, 'template.html');

  try {
    let htmlData = await readFile(template, { encoding: 'utf8' });
    await mkdir(projectDist, { recursive: true });
    const components = await readdir(componentsFolder);

    for (let component of components) {
      const name = path.parse(component).name;
      const componentPath = path.join(__dirname, 'components', component);
      componentsHTML[name] = await readFile(componentPath, { encoding: 'utf8' });
      htmlData = htmlData.replace(`{{${name}}}`, componentsHTML[name]);
    }
    await writeFile(html, htmlData);

  } catch (err) {
    console.error(err);
  }
}


async function buildStyles() {
  const stylesFolder = path.join(__dirname, 'styles');
  const sourceFiles = await readdir(stylesFolder, {withFileTypes: true});
  let cssData = '';

  try {
    for (let file of sourceFiles) {
      if (file.isFile() && path.extname(file.name) === '.css') {
        const sourceFile = path.join(stylesFolder, file.name);
        cssData += await readFile(sourceFile, { encoding: 'utf8' });
      }
    }
    await writeFile(styles, cssData);

  } catch (err) {
    console.error(err.message);
  }
}


async function copyAssetsFolder(folder='') {
  const assetsFolder = path.join(__dirname, 'assets', folder);
  const distAssetsFolder = path.join(projectDist, 'assets', folder);
  const sourceFiles = await readdir(assetsFolder, {withFileTypes: true});

  try {
    await mkdir(distAssetsFolder, { recursive: true });
    for (let file of sourceFiles) {
      const sourceFile = path.join(assetsFolder, file.name);
      const newFile = path.join(distAssetsFolder, file.name);
      file.isFile() ? await copyFile(sourceFile, newFile) : copyAssetsFolder(file.name);
    }

  } catch (err) {
    console.error(err);
  }
}


buildHTML();
buildStyles();
copyAssetsFolder();
