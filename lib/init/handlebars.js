const { openComment } = require('../utils')

module.exports = function (answers, configFileList, pkg) {
  // 如果有选中handlebars配置，则进行handlebars的配置
  if (!answers.pluginList.some(e => e === 'handlebars')) { return false }
  // 向package.json添加handlebars的相关依赖
  Object.assign(pkg.devDependencies, {
    "handlebars": "^4.1.0"
  })
  Object.assign(pkg.dependencies, {
    "handlebars-loader": "^1.7.1"
  })
  // 打开handlebars的配置注释
  configFileList.forEach(item => {
    item.code = openComment(item.code, 'handlebars')
  })
}
