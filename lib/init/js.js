const { openComment } = require('../utils')

module.exports = function ({ answers, configFileList, pkg, projectPath }) {
  // 如果有选中js配置，则进行ts的配置
  if (answers.typescript) { return false }
  // 打开js的配置注释
  configFileList.forEach(item => {
    item.code = openComment(item.code, 'js')
  })
}
