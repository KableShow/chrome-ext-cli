const fs = require('fs')
const path = require('path')
const initEslint = require('./init/eslint')
const initTslint = require('./init/tslint')
const initLess = require('./init/less')
const initAxios = require('./init/axios')
const initHandlebars = require('./init/handlebars')
const initStylus = require('./init/stylus')
const initSass = require('./init/sass')
const initDocumentStart = require('./init/initDocumentStart')
const initJs = require('./init/js')
const initTs = require('./init/ts')
const { deleteAllComment, readFileData } = require('./utils')

// 创建需要修改配置的文件列表
function createConfigFileList (projectPath) {
  return [
    Object.assign({ name: 'webpack.base.js' }, readFileData(path.join(projectPath, './webpackConfig/webpack.base.js'))),
    Object.assign({ name: 'webpack.development.js' }, readFileData(path.join(projectPath, './webpackConfig/webpack.development.js'))),
    Object.assign({ name: 'webpack.product.js' }, readFileData(path.join(projectPath, './webpackConfig/webpack.product.js')))
  ]
}

const initList = [initDocumentStart, initJs, initTs, initEslint, initTslint, initLess,
  initAxios, initHandlebars, initStylus, initSass]

module.exports = function (answers, projectPath, pkg) {
  let configFileList = createConfigFileList(projectPath)
  initList.forEach(func => {
    func({ answers, configFileList, pkg, projectPath }) 
  })
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
