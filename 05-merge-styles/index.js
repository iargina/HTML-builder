const fs = require('fs');
const path = require('path');

const stylesDir = path.join(__dirname, 'styles');
const distDir = path.join(__dirname, 'project-dist');
const bundlePath = path.join(distDir, 'bundle.css');

fs.readdir(stylesDir, (err, files) => {
  if (err) {
    throw err;
  }

  const cssFiles = files.filter(file => path.extname(file) === '.css');

  const cssContent = cssFiles.reduce((acc, file) => {
    const content = fs.readFileSync(path.join(stylesDir, file), 'utf8');
    return acc + content;
  }, '');

  fs.writeFile(bundlePath, cssContent, err => {
    if (err) {
      throw err;
    }
    console.log(`Styles bundled successfully at ${bundlePath}`);
  });
});
