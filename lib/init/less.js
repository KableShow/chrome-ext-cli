const { openComment } = require('../utils')

module.exports = function ({ answers, configFileList, pkg }) {
  // 如果有选中less配置，则进行less的配置
  if (!answers.pluginList.some(e => e === 'less')) { return false }
  // 向package.json添加less的相关依赖
  Object.assign(pkg.devDependencies, {
    "less": "^3.9.0",
    "less-loader": "^4.1.0"
  })
  // 打开less的配置注释
  configFileList.forEach(item => {
    item.code = openComment(item.code, 'less')
  })
}
