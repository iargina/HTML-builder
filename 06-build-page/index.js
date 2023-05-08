const path = require('path');
const fs = require('fs').promises;

const pathStyles = path.join(__dirname, 'styles');
const pathCopy = path.join(__dirname, 'project-dist');
const pathAssetsCopy = path.join(pathCopy, 'assets');
const folderPath = path.join(__dirname, 'components');
const pathAssets = path.join(__dirname, 'assets');

async function copyStyles() {
  try {
    const files = await fs.readdir(pathStyles, {withFileTypes: true});
    const cssFiles = files.filter(file => file.isFile() && file.name.split('.')[1] === 'css');

    let data = '';
    for (let i = 0; i < cssFiles.length; i++) {
      const file = cssFiles[i];
      const filePath = path.join(pathStyles, file.name);
      const fileData = await fs.readFile(filePath, 'utf8');
      data += fileData;
    }

    await fs.mkdir(pathCopy);
    await fs.writeFile(path.join(pathCopy, 'style.css'), data);
  } catch (error) {
    console.error(error);
  }
}

async function copyAssets() {
  try {
    await fs.mkdir(pathAssetsCopy);
    await recursiveCopy(pathAssets, pathAssetsCopy);
  } catch (error) {
    console.error(error);
  }
}

async function recursiveCopy(dir, exit) {
  try {
    const files = await fs.readdir(dir, {withFileTypes: true});

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const filePath = path.join(dir, file.name);
      const exitPath = path.join(exit, file.name);

      if (file.isFile()) {
        await fs.copyFile(filePath, exitPath);
      } else {
        try {
          await fs.stat(exitPath);
        } catch (error) {
          await fs.mkdir(exitPath);
        }
        await recursiveCopy(filePath, exitPath);
      }
    }
  } catch (error) {
    console.error(error);
  }
}


function createTemplate() {
    fs.copyFile(`${__dirname}\\template.html`, `${pathCopy}\\index.html`, function (error) {
      if (error) throw error;
  
      fs.readFile(`${pathCopy}\\index.html`, 'utf8', function(error, data) {
        if(error) throw error;
  
        fs.readdir(folderPath, {withFileTypes: true}, function (error, files) {
          if (error) throw error;
  
          files.forEach(function(file) {
            fs.readFile(`${folderPath}\\${file.name}`, 'utf8', function(error, dataFile) {
              if(error) throw error;
  
              let tagName = `{{${file.name.split('.')[0]}}}`;
              data = data.replace(tagName, dataFile);
  
              fs.writeFile(`${pathCopy}\\index.html`, data, function (error) {
                if(error) console.log(error);
              });
            });
          });
        });
      });
    });
  }
  

  fs.stat(pathCopy, function (error) {
    if (error) {
      fs.mkdir(pathCopy, function (error) {
        if (error) {
          return console.erroror(error);
        }
      });
      createTemplate();
    } else {
      fs.readdir(pathCopy, function (error) {
        if (error) console.log(error);
        else {
          createTemplate();
        }
      });
    }
  });
  

  fs.stat(pathAssetsCopy, function (error) {
    if (error) {
      fs.mkdir(pathAssetsCopy, function(error) {
        if (error) {
          return console.error(error);
        }
      });
      recurceCopy(pathAssets, pathAssetsCopy);
    } else {
      recurceCopy(pathAssets, pathAssetsCopy);
    }
  });
  