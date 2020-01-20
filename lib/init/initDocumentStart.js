const { readFileData, removeDocumentStart } = require('../utils')
const path = require('path')
const fs = require('fs')

module.exports = function ({ answers, configFileList, pkg, projectPath }) {
  if (answers.document_start) { // 如果需要document_start script
    configFileList.push(Object.assign({ name: 'documentStart.webpack.js' },
      readFileData(path.join(projectPath, './webpackConfig/documentStart.webpack.js'))
    ))
    // pkg上添加document_start的打包指令
    pkg.scripts.startbuild = 'webpack --config ./webpackConfig/documentStart.webpack.js'
    // 在manifest.json上新增document_start的js
    let manifestObj = readFileData(path.join(projectPath, './manifest.json'))
    let manifest = JSON.parse(manifestObj.code)
    manifest['content_scripts'].push({
      "js": [
        "js/documentStart.bundle.js"
      ],
      "matches": [
        "http://*/*",
        "https://*/*"
      ],
      "run_at": "document_start"
    })
    fs.writeFileSync(manifestObj.filePath, JSON.stringify(manifest, null, 2), { encoding: 'utf8' })
  } else {
    // 移除document_start的相关配置
    removeDocumentStart(projectPath)
  }
}