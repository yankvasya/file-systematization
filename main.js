require('colors');

const fs = require('fs');
const path = require('path');
const { from, to, remove } = require('minimist')(process.argv.slice(2));

const startApp = () => {
  isExist(to, createDir(to, replaceFiles(from)));
};

const absolutePath = (name) => path.join(__dirname, name);

const createDir = (directory, file, saveTo) => {
  fs.mkdir(directory, (error) => {
    if (error) console.log(`Директория существует - ${directory}`);
    if (file) readFile(file, saveTo);
  });
};

const isExist = (file, callback, notCallback) => {
  fs.access(absolutePath(file), (error) => {
    if (!error) {
      if (callback) callback();
    } else {
      if (notCallback) {
        notCallback();
      } else {
        console.log(`${'Dir'.red} ${file.bgRed} ${"isn't exist".red}`);
      }
    }
  });
};

const removeDir = (directory) => {
  fs.rmdir(directory, { recursive: true, force: true }, (error) => {
    if (error) throw error;

    console.log(`-----${directory} dir deleted-----`.bgMagenta);
    process.exit(0);
  });
};

const writeFile = (file, directory, encoding = 'base64') => {
  fs.writeFile(directory, file, { encoding }, (error) => {
    if (error) {
      throw error;
    } else {
      console.log(' file saved to', directory.red);
    }
  });
};

const readFile = (file, directory) => {
  fs.readFile(file, 'base64', (imageError, imageData) => {
    if (!imageError) {
      writeFile(imageData, directory);
    } else {
      console.log(`Cannot read image - ${file.red}`.bgRed);
    }
  });
};

const replaceFiles = (startDir) => {
  fs.readdir(absolutePath(startDir), (error, data) => {
    if (!error) {
      const files = data.map(name => absolutePath(path.join(startDir, name)));

      for (const file of files) {
        const npx = files.indexOf(file);
        const name = data[npx];
        const fileDir = path.join(startDir, name);

        fs.lstat(fileDir, (error, stats) => {
          if (!error && !stats.isDirectory()) {
            const firstLetter = name[0].toUpperCase();
            const directory = path.join(to, firstLetter, name);
            // Создает директорию с названием первой буквы файлы
            createDir(path.join(to, firstLetter), file, directory);
          } else {
            console.log(`${name.red} is directory`.bgRed);
            replaceFiles(fileDir);
          }
        });
      }
    } else {
      throw error;
    }
  });
};

const init = () => {
  console.log('-----------Start----------- \n'.cyan);
  isExist(from, startApp);
};

init();

process.on('beforeExit', () => {
  if (remove) removeDir(from);
});

process.on('exit', () => {
  console.log('\n------------End------------'.cyan);
});
