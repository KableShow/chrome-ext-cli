const { openComment } = require('../utils')

module.exports = function ({ answers, configFileList, pkg }) {
  // 如果有选中stylus配置，则进行stylus的配置
  if (!answers.pluginList.some(e => e === 'stylus')) { return false }
  // 向package.json添加stylus的相关依赖
  Object.assign(pkg.devDependencies, {
    "stylus": "^0.54.7",
    "stylus-loader": "^3.0.2",
  })
  // 打开stylus的配置注释
  configFileList.forEach(item => {
    item.code = openComment(item.code, 'stylus')
  })
}
