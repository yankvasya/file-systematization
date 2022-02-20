require('colors');

const fs = require('fs');
const path = require('path');
const { from, to } = require('minimist')(process.argv.slice(2));

const absolutePath = (name) => path.join(__dirname, name);

const createDir = (directory) => {
  if (Array.isArray(directory)) return directory.forEach(d => createDir(d));

  const isDirExist = fs.existsSync(absolutePath(directory));

  if (!isDirExist) fs.mkdirSync(directory);
};

const writeFile = (file, directory, encoding = 'base64') => {
  fs.writeFileSync(directory, file, { encoding });
  console.log('file saved to', directory.red);
};

const replaceFiles = () => {
  const names = fs.readdirSync(absolutePath(from));
  const files = names.map(name => absolutePath(path.join(from, name)));

  files.forEach((file, npx) => {
    const name = names[npx];
    const firstLetter = name[0].toUpperCase();
    const directory = path.join(to, firstLetter, name);
    // Создает директорию с названием первой буквы файлы
    createDir(path.join(to, firstLetter));

    const data = fs.readFileSync(file, 'base64');
    writeFile(data, directory);
  });
};

const init = () => {
  createDir([from, to]);

  replaceFiles();
};

init();
