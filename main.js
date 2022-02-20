require('colors');

const fs = require('fs');
const path = require('path');
const { from, to } = require('minimist')(process.argv.slice(2));

const absolutePath = (name) => path.join(__dirname, name);

const createDir = (directory) => {
  if (Array.isArray(directory)) return directory.forEach(d => createDir(d));

  const isDirExist = fs.existsSync(absolutePath(directory));

  if (!isDirExist) {
    fs.mkdirSync(directory);
  }
};

const writeFile = async (file, directory, encoding = 'base64') => {
  if (encoding === 'base64') {
    file = Buffer.from(file, 'base64');
  }
  await fs.writeFile(directory, file, { encoding }, (err) => {
    if (err) throw err;

    console.log('file saved to', directory.red);
  });
};

const readFromDir = () => {
  const names = fs.readdirSync(absolutePath(from));
  const files = names.map(name => absolutePath(path.join(from, name)));

  files.forEach((file, npx) => {
    const name = names[npx];
    const dir = name[0].toUpperCase();
    // Создает директорию с названием первой буквы файлы
    createDir(path.join(to, dir));

    fs.readFile(file, 'base64', async (error, data) => {
      if (error) throw error;

      await writeFile(data, path.join(to, dir, name));
    });
  });
};

const init = () => {
  createDir([from, to]);

  readFromDir();
};

init();
