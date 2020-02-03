const path = require('path')
const SourceReplace = require('source-replace-plugin')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  mode: 'production',
  cache: true,
  entry: {
/**ext-template:ts--start
    'js/documentStart': './content/documentStart/index.ts'
ext-template:ts--end**/
/**ext-template:js--start
    'js/documentStart': './content/documentStart/index.js'
ext-template:js--end**/
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
/**ext-template:tslint--start
      {
        test: /\.tsx?$/,     // typescript的加载器
        loader: 'tslint-loader',
        enforce: 'pre',
        exclude: /node_modules/,
        include: [resolve('content'), resolve('popup')]
      },
ext-template:tslint--end**/
/**ext-template:ts--start
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      },
ext-template:ts--end**/
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
