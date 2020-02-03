const { openComment, changeFileToTs } = require('../utils')
const fs = require('fs')
const path = require('path')

module.exports = function ({ answers, configFileList, pkg, projectPath }) {
  // 如果有选中ts配置，则进行ts的配置
  if (!answers.typescript) {
    // 移除tsconfig.json
    fs.unlinkSync(path.join(projectPath, './tsconfig.json'))
    return false
  }
  // 向package.json添加ts的相关依赖
  Object.assign(pkg.devDependencies, {
    "ts-loader": "^6.2.1",
    "typescript": "^3.7.5",
    "@types/chrome": "0.0.91"
  })
  // 打开ts的配置注释
  configFileList.forEach(item => {
    item.code = openComment(item.code, 'ts')
  })
  // 将一些js文件改成ts文件
  changeFileToTs(projectPath)
}
