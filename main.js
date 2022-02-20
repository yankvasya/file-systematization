require('colors');

const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');
const { from, to, remove } = require('minimist')(process.argv.slice(2));

const absolutePath = (name) => path.join(__dirname, name);

const createDir = async (directory) => {
  if (Array.isArray(directory)) return directory.forEach(d => createDir(d));

  const isDirExist = await isExist(absolutePath(directory));

  if (!isDirExist) await fsPromises.mkdir(directory);
};

const isExist = (file) => {
  return fsPromises.access(file)
    .then(() => true)
    .catch(() => false);
};

const removeDir = async (directory) => {
  await fsPromises.rmdir(directory, { recursive: true });
  console.log(`-----${directory} dir deleted-----`.bgMagenta);
};

const writeFile = async (file, directory, encoding = 'base64') => {
  await fsPromises.writeFile(directory, file, { encoding });
  console.log(' file saved to', directory.red);
};

const isDirectory = async (path) => {
  const stat = await fsPromises.lstat(path);
  return stat.isDirectory();
};

const replaceFiles = async (startDir) => {
  const names = await fsPromises.readdir(absolutePath(startDir));
  const files = names.map(name => absolutePath(path.join(startDir, name)));

  for (const file of files) {
    const npx = files.indexOf(file);
    const name = names[npx];
    const fileDir = path.join(startDir, name);

    if (!await isDirectory(fileDir)) {
      const firstLetter = name[0].toUpperCase();
      const directory = path.join(to, firstLetter, name);
      // Создает директорию с названием первой буквы файлы
      await createDir(path.join(to, firstLetter));

      const data = await fsPromises.readFile(file, 'base64');
      await writeFile(data, directory);
    } else {
      console.log(`${name.red} is directory`.bgRed);
      await replaceFiles(fileDir);
    }
  }
};

const init = () => {
  (async () => {
    console.log('-----------Start----------- \n'.cyan);
    const isFromExist = await isExist(from);

    if (isFromExist) {
      await createDir(to);
      await replaceFiles(from);

      if (remove) await removeDir(from);
    } else {
      console.log(`${'Dir'.red} ${from.bgRed} ${"isn't exist".red}`);
    }

    console.log('\n------------End------------'.cyan);
  })();
};

init();
