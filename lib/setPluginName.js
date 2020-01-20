const fs = require('fs')
const util = require('util')
const readAsync = util.promisify(fs.readFile)
// 需要修改名字的文件路径，这些文件中的{{pluginName}}会被替换成用户输入的pluginName
const fileNameList = ['package.json', 'manifest.json']

module.exports = async (pluginName, filePath) => {
  fileNameList.forEach(async (itemPath) => {
    let eachPath = filePath + '/' + itemPath
    let code = await readAsync(eachPath, { encoding: 'utf8' })
    code = code.replace(/\{\{pluginName\}\}/gi, pluginName)
    await util.promisify(fs.writeFile)(eachPath, code)
  })
}
