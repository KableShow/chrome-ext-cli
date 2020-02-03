const { openComment } = require('../utils')

module.exports = function ({ answers, configFileList, pkg }) {
  // 如果有选中sass配置，则进行sass的配置
  if (!answers.pluginList.some(e => e === 'sass')) { return false }
  // 向package.json添加sass的相关依赖
  Object.assign(pkg.devDependencies, {
    "sass-loader": "^7.2.0",
    "sass": "^1.22.10"
  })
  // 打开sass的配置注释
  configFileList.forEach(item => {
    item.code = openComment(item.code, 'sass')
  })
}
