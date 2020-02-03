const path = require('path')
const fs = require('fs')
const util = require('util')
const readAsync = util.promisify(fs.readFile)
const writeAsync = util.promisify(fs.writeFile)

class ChromePlugin {
  constructor (options) {
    this.options = options
  }
  apply (compiler) {
    let that = this
    compiler.hooks.done.tap('ChromePlugin', async function (stats) {
      // 替换掉manifest.json中的name字段
      let manifestObj = stats.compilation.assets['manifest.json']
      if (manifestObj) {
        let manifestPath = manifestObj.existsAt
        let data = await readAsync(manifestPath, { encoding: 'utf8' })
        let manifest = JSON.parse(data)
        manifest.name = that.options.pluginName
        let newContent = JSON.stringify(manifest, null, 2)
        await writeAsync(manifestPath, newContent)
      }
    })
  }
}

module.exports = ChromePlugin
