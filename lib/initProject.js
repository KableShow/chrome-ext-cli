const fs = require('fs')
const path = require('path')
const initEslint = require('./init/eslint')
const initLess = require('./init/less')
const initAxios = require('./init/axios')
const initHandlebars = require('./init/handlebars')
const initStylus = require('./init/stylus')
const initSass = require('./init/sass')
const initDocumentStart = require('./init/initDocumentStart')
const { deleteAllComment, readFileData } = require('./utils')

// 创建需要修改配置的文件列表
function createConfigFileList (projectPath) {
  return [
    Object.assign({ name: 'webpack.base.js' }, readFileData(path.join(projectPath, './webpackConfig/webpack.base.js')))
  ]
}

module.exports = function (answers, projectPath, pkg) {
  let configFileList = createConfigFileList(projectPath)
  initDocumentStart({ answers, configFileList, pkg, projectPath })
  initEslint(answers, configFileList, pkg)
  initLess(answers, configFileList, pkg)
  initAxios(answers, configFileList, pkg)
  initHandlebars(answers, configFileList, pkg)
  initStylus(answers, configFileList, pkg)
  initSass(answers, configFileList, pkg)
  // 将未使用到的配置注释去掉，然后重写
  configFileList.forEach(item => {
    let { filePath, code } = item
    code = deleteAllComment(code)
    fs.writeFileSync(filePath, code, { encoding: 'utf8' })
  })
  // 写入package.json
  // devDependencies排序
  pkg.devDependencies = Object.keys(pkg.devDependencies).sort().reduce((result, key) => {
    result[key] = pkg.devDependencies[key]
    return result
  }, {})
  pkg.dependencies = Object.keys(pkg.dependencies).sort().reduce((result, key) => {
    result[key] = pkg.dependencies[key]
    return result
  }, {})
  let pkgCode = JSON.stringify(pkg, null, 2);
  fs.writeFile(path.join(projectPath, './package.json'), pkgCode, 'utf8', (err) => {
    if (err) throw err
  });
}
