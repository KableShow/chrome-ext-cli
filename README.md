# Chrome Extensions 脚手架

一个简易的开发Chrome插件的脚手架；已集合如下功能：

- [x] webpack一键打包
- [x] popup页面的本地开发环境
- [x] 生成CRX和ZIP文件
- [x] document_start的解决方案
- [x] Typescript

## How to use

1. 全局安装脚手架

   ```shell
   npm i chrome-ext-cli -g
   ```

2. 命令创建插件项目

   ```shell
   chrome-ext create [fileName]
   chrome-ext c [fileName]
   ```

## document_start

创建项目会询问是否需要一个执行在 **document_start** 时机的 **content script** 。建议选择 **yes** 。具体作用可查看生成项目里面的 **README.md** 。

## key

创建的项目下有个 **key** 文件目录，这里放着打包CRX文件需要的 **pem** 文件；建议自己重新生成；

