const path = require("path");
const fs = require("fs-extra");
const replace = require("replace-in-file");

function copyFolder(from, to) {
  fs.copySync(from, to, { overwrite: true });
  console.log(`📂 Folder copied to: ${to}`);
}

async function injectCode(filePath, searchValue, replaceValue) {
  try {
    const results = await replace({
      files: filePath,
      from: searchValue,
      to: replaceValue,
    });
    console.log(`✏️ Code successfully injected into: ${filePath}`);
  } catch (error) {
    console.error(`❌ Failed to inject code into: ${filePath}`, error);
  }
}

function resolvePath(...segments) {
  return path.resolve(__dirname, ...segments);
}

module.exports = {
  copyFolder,
  injectCode,
  resolvePath,
};
