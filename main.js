require('colors');

const fs = require('fs');
const path = require('path');
const { from, to, remove } = require('minimist')(process.argv.slice(2));

const absolutePath = (name) => path.join(__dirname, name);

const createDir = (directory) => {
  if (Array.isArray(directory)) return directory.forEach(d => createDir(d));

  const isDirExist = fs.existsSync(absolutePath(directory));

  if (!isDirExist) fs.mkdirSync(directory);
};

const isExist = (file) => fs.existsSync(absolutePath(file));

const removeDir = (directory) => {
  fs.rmdirSync(directory, { recursive: true });
  console.log('-----Start dir deleted-----'.bgMagenta);
};

const writeFile = (file, directory, encoding = 'base64') => {
  fs.writeFileSync(directory, file, { encoding });
  console.log(' file saved to', directory.red);
};

const isDirectory = (path) => {
  const stat = fs.lstatSync(path);
  return stat.isDirectory();
};

const replaceFiles = (startDir) => {
  const names = fs.readdirSync(absolutePath(startDir));
  const files = names.map(name => absolutePath(path.join(startDir, name)));

  files.forEach((file, npx) => {
    const name = names[npx];
    const fileDir = path.join(startDir, name);

    if (isDirectory(fileDir)) {
      console.log('is directory'.bgRed);
      return replaceFiles(fileDir);
    }

    const firstLetter = name[0].toUpperCase();
    const directory = path.join(to, firstLetter, name);
    // Создает директорию с названием первой буквы файлы
    createDir(path.join(to, firstLetter));

    const data = fs.readFileSync(file, 'base64');
    writeFile(data, directory);
  });
};

const init = () => {
  const isFromExist = isExist(from);
  console.log('-----------Start-----------'.cyan);

  if (!isFromExist) console.log(`${'Dir'.red} ${from.bgRed} ${"isn't exist".red}`);

  if (isFromExist) {
    createDir([from, to]);

    replaceFiles(from);
    if (remove) removeDir(from);
  }

  console.log('------------End------------'.cyan);
};

init();
