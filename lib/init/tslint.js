const { openComment } = require('../utils')
const fs = require('fs')
const path = require('path')

module.exports = function ({ answers, configFileList, pkg, projectPath }) {
  // 如果有选中tslint配置，则进行tslint的配置
  if (!answers.pluginList.some(e => e === 'tslint')) {
    fs.unlinkSync(path.join(projectPath, './tslint.json'))
    return false
  }
  // 向package.json添加tslint的相关依赖
  Object.assign(pkg.devDependencies, {
    "tslint": "^5.20.1",
    "tslint-loader": "^3.5.4",
    "tslint-eslint-rules": "^5.4.0"
  })
  // 打开tslint的配置注释
  configFileList.forEach(item => {
    item.code = openComment(item.code, 'tslint')
  })
}
