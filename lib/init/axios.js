const { openComment } = require('../utils')

module.exports = function (answers, configFileList, pkg) {
  if (!answers.pluginList.some(e => e === 'axios')) { return false }
  // 向package.json添加axios的相关依赖
  Object.assign(pkg.dependencies, {
    "axios": "^0.19.0"
  })
}
