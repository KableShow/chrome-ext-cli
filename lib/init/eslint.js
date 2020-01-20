const { openComment } = require('../utils')

module.exports = function (answers, configFileList, pkg) {
  // 如果有选中eslint配置，则进行eslint的配置
  if (!answers.pluginList.some(e => e === 'eslint')) { return false }
  // 向package.json添加eslint的相关依赖
  Object.assign(pkg.devDependencies, {
    "babel-eslint": "^10.0.1",
    "eslint": "^5.12.0",
    "eslint-config-standard": "^12.0.0",
    "eslint-friendly-formatter": "^4.0.1",
    "eslint-loader": "^2.1.1",
    "eslint-plugin-html": "^5.0.0",
    "eslint-plugin-import": "^2.14.0",
    "eslint-plugin-node": "^8.0.1",
    "eslint-plugin-promise": "^4.0.1",
    "eslint-plugin-standard": "^4.0.0"
  })
  // 打开eslint的配置注释
  configFileList.forEach(item => {
    item.code = openComment(item.code, 'eslint')
  })
}
