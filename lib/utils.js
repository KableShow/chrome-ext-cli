const fs = require('fs')
const path = require('path')

// 获取文件的源代码
function readFileData (filePath) {
  return {
    filePath,
    code: fs.readFileSync(filePath, { encoding: 'utf8' })
  }
}

// 复制文件夹
function cloneFile (src, dest) {
  let dirs = fs.readdirSync(src)
  dirs.forEach((item) => {
    let item_path = path.join(src, item)
    var temp = fs.statSync(item_path)
    if (temp.isFile()) { // 是文件
      fs.copyFileSync(item_path, path.join(dest, item))
    } else if (temp.isDirectory()){ // 是目录
      fs.mkdirSync(path.join(dest, item))
      cloneFile(item_path, path.join(dest, item))
    }
  })
}

// 删除文件夹
function deleteFile (dir) {
  if (fs.existsSync(dir) == true) {
    var files = fs.readdirSync(dir)
    files.forEach(item => {
      var item_path = path.join(dir, item)
      // console.log(item_path);
      if (fs.statSync(item_path).isDirectory()) {
        deleteFile(item_path)
      }
      else {
        fs.unlinkSync(item_path);
      }
    });
    fs.rmdirSync(dir);
  }
}

// 打开注释配置
function openComment (source, sign) {
  let signStr = `/**ext-template:${sign}--start\n`
  let s = source
  while (s.indexOf(signStr) >= 0) {
    s = s.replace(signStr, '')
    s = s.replace(`ext-template:${sign}--end**/\n`, '')
  }
  return s
}

// 删除文件中剩下的注释配置
function deleteAllComment (source) {
  let s = source
  let startIndex = s.indexOf(`/**ext-template:`)
  while (startIndex >= 0) {
    let endIndex = s.indexOf(`--end**/`)
    s = s.slice(0, startIndex) + s.slice(endIndex + 9)
    startIndex = s.indexOf(`/**ext-template:`)
  }
  return s
}

// 移除document_start的相关配置
function removeDocumentStart (projectPath) {
  // 删除documentStart.webpack.js
  let webpackConfigPath = path.join(projectPath, './webpackConfig/documentStart.webpack.js')
  fs.unlinkSync(webpackConfigPath)
  // 删除content/documentStart文件夹
  deleteFile(path.join(projectPath, './content/documentStart'))
  // 删除static/js/documentStart.bundle.js
  fs.unlinkSync(path.join(projectPath, './static/js/documentStart.bundle.js'))
}

// 将一些js文件改成ts文件
function changeFileToTs (projectPath) {
  // background/index.js
  fs.renameSync(path.join(projectPath, './background/index.js'), path.join(projectPath, './background/index.ts'))
  // popup/index.js
  fs.renameSync(path.join(projectPath, './popup/index.js'), path.join(projectPath, './popup/index.ts'))
  // content/index.js
  fs.renameSync(path.join(projectPath, './content/index.js'), path.join(projectPath, './content/index.ts'))
  // content/documentStart/index.js
  let startPath = path.join(projectPath, './content/documentStart/index.js')
  if (fs.existsSync(startPath)) {
    fs.renameSync(startPath, path.join(projectPath, './content/documentStart/index.ts'))
  }
}

module.exports = {
  cloneFile,
  openComment,
  deleteAllComment,
  readFileData,
  deleteFile,
  removeDocumentStart,
  changeFileToTs
}
