# chrome-extensions-template

Chrome插件模板

## 常用指令

```javascript
npm run build // 打包测试环境代码，打包后输出在dist文件目录下
npm run prdbuild // 打包正式环境代码，打包后输出在dist文件目录下
npm run watch // 监控文件改变，并执行npm run build，常用于本地开发实时监控
npm run dev // 启动popup页面的本地开发服务器
npm run devall // 打包测试环境代码，打包后生成crx和zip文件，并输出在lastBuild文件目录下，常用于提供包给其他人测试
npm run all // 打包正式环境代码，打包后生成crx和zip文件，并输出在lastBuild文件目录下，常用于上线
```

## 注意

1. 环境变量；全局变量 **SERVICE_ENV** 用来标示打包的是测试环境(**development**)还是正式环境(**production**)；

2. **documentStart**指令；如果在初始化的时候勾选了生成document_start的script，那么package.json里面会多一条**npm run startbuild**的指令；该指令用于构建content/documentStart/index.js文件，并将打包后的js输出到 **static/js** 文件夹下。如果你改变了 **content/documentStart/index.js** 文件，请记得执行一次 **npm run startbuild** ！！！！！

## 第二个选项document_start script的作用

在**manifest.json**中配置引入的script，其引入的时机run_at有3种值，当你配置document_start的时候，表示在dom解析之前引入你的这个js。但是如果你引入的这个js想改变的是目标页面（即你执行插件的页面）的js（比如想设置一个全局变量等等），那么你的这个脚本必须是构建一个script标签，并插入的目标页面去执行才可以的。即如下操作：

```javascript
// 向页面注入JS
function injectCustomJs (jsPath) {
  var temp = document.createElement('script')
  temp.setAttribute('type', 'text/javascript')
  temp.src = chrome.extension.getURL(jsPath)
  document.documentElement.appendChild(temp)
  temp.onload = function () {
    if (this.parentNode) {
      this.parentNode.removeChild(this)
    }
  }
}
injectCustomJs('js/documentStart.bundle.js')
```

但这种插入的方式无法保证是先于目标页面的js执行的，因为这个插入之后，并不是立即就加载你的js，并执行；目标页面的js加载的优先级可能会高于你的js，所以这里采用了直接插入js源码的方式，保证插入之后立即执行；

```javascript
// 向页面注入JS
function injectCustomJs (scriptContent) {
  var temp = document.createElement('script')
  temp.setAttribute('type', 'text/javascript')
  temp.innerText = scriptContent
  document.documentElement.appendChild(temp)
  temp.onload = function () {
    if (this.parentNode) {
      this.parentNode.removeChild(this)
    }
  }
}
injectCustomJs("@{{{./static/js/documentStart.bundle.js}}}")
```

这里用到了一个webpack插件 **source-replace-plugin** 。这个插件可以根据你设置的 **@{{{./static/js/documentStart.bundle.js}}}** 查找到对应的文件，并将其转成字符串替换掉。这样就可以保证插入js后立即执行你的js。

