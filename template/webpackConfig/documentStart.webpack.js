const path = require('path')
const SourceReplace = require('source-replace-plugin')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  mode: 'production',
  cache: true,
  entry: {
    'js/documentStart': './content/documentStart/index.js'
  },
  output: {
    path: path.resolve(__dirname, '../static'),
    filename: '[name].bundle.js',
    jsonpFunction: 'startJSONP'
  },
  resolve: {
    alias: {
      'content': resolve('content'),
      'popup': resolve('popup')
    }
  },
  module: {
    rules: [
/**ext-template:eslint--start
      {
        test: /\.js$/,
        loader: 'eslint-loader',
        enforce: "pre",
        include: [path.resolve(__dirname, '../content')],
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      }
ext-template:eslint--end**/
    ]
  },
  plugins: [
    new SourceReplace({
      basePath: path.join(__dirname, '..'),
      sourcePath: path.join(__dirname, '../content/documentStart/inject.js'),
      targetPath: path.join(__dirname, '../static/js/documentStart.bundle.js')
    })
  ]
}
