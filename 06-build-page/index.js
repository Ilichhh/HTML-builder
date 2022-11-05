const path = require('path');
const fs = require('fs');
const { readdir, mkdir, readFile, writeFile } = require('fs/promises');

const projectDist = path.join(__dirname, 'project-dist');
const styles = path.join(__dirname, 'project-dist', 'style.css');
const html = path.join(__dirname, 'project-dist', 'index.html');

const stylesFolder = path.join(__dirname, 'styles');
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


async function copyAssetsFolder() {

}


buildHTML();
buildStyles();
