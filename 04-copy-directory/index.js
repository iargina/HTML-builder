const fs = require('fs');
const path = require('path');

const SOURCE_FOLDER = 'files';
const DEST_FOLDER = 'files-copy';

function copyDir(source, destination) {
  fs.mkdir(destination, { recursive: true }, (err) => {
    if (err) throw err;

    fs.readdir(source, { withFileTypes: true }, (err, files) => {
      if (err) throw err;

      files.forEach((file) => {
        const sourcePath = path.join(source, file.name);
        const destPath = path.join(destination, file.name);

        if (file.isDirectory()) {
          copyDir(sourcePath, destPath);
        } else {
          fs.copyFile(sourcePath, destPath, (err) => {
            if (err) throw err;
          });
        }
      });
    });
  });
}

copyDir(SOURCE_FOLDER, DEST_FOLDER);

