const path = require('path');
const { rm, readdir, mkdir, readFile, writeFile, copyFile } = require('fs/promises');

const projectDist = path.join(__dirname, 'project-dist');
const styles = path.join(__dirname, 'project-dist', 'style.css');
const html = path.join(__dirname, 'project-dist', 'index.html');

const componentsHTML = {};


async function buildHTML() {
  const componentsFolder = path.join(__dirname, 'components');
  const template = path.join(__dirname, 'template.html');

  try {
    let htmlData = await readFile(template, { encoding: 'utf8' });
    const components = await readdir(componentsFolder);

    for (let component of components) {
      if (path.extname(component) === '.html') {
        const name = path.parse(component).name;
        const componentPath = path.join(__dirname, 'components', component);
        componentsHTML[name] = await readFile(componentPath, { encoding: 'utf8' });
        htmlData = htmlData.replace(`{{${name}}}`, componentsHTML[name]);
      }
    }
    await writeFile(html, htmlData);
    console.log('index.html created');

  } catch (err) {
    console.error(err);
  }
}


async function buildStyles() {
  const stylesFolder = path.join(__dirname, 'styles');
  let cssData = '';
  
  try {
    const sourceFiles = await readdir(stylesFolder, {withFileTypes: true});
    for (let file of sourceFiles) {
      if (file.isFile() && path.extname(file.name) === '.css') {
        const sourceFile = path.join(stylesFolder, file.name);
        cssData += await readFile(sourceFile, { encoding: 'utf8' });
      }
    }
    await writeFile(styles, cssData);
    console.log('style.css created');

  } catch (err) {
    console.error(err.message);
  }
}


async function copyAssetsFolder(folder='') {
  const assetsFolder = path.join(__dirname, 'assets', folder);
  const distAssetsFolder = path.join(projectDist, 'assets', folder);
  
  try {
    const sourceFiles = await readdir(assetsFolder, {withFileTypes: true});
    await mkdir(distAssetsFolder, { recursive: true });
    for (let file of sourceFiles) {
      const sourceFile = path.join(assetsFolder, file.name);
      const newFile = path.join(distAssetsFolder, file.name);
      file.isFile() ? await copyFile(sourceFile, newFile) : copyAssetsFolder(file.name);
    }
    console.log(`${folder || 'assets'} folder copied`);

  } catch (err) {
    console.error(err.message);
  }
}


async function buildPage() {
  try {
    await rm(projectDist, { force: true, recursive: true });
    await mkdir(projectDist, { recursive: true });
    buildHTML();
    buildStyles();
    copyAssetsFolder();
  } catch (err) {
    console.error(err.message);
  }
}


buildPage();
