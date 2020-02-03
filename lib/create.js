const inquirer = require('inquirer')
const readline = require('readline')
const chalk = require('chalk')
const download = require('download-git-repo')
const ora = require('ora')
const path = require('path')
const fs = require('fs')
const { exec } = require('child_process')
const initProject = require('./initProject')
const { cloneFile } = require('./utils')
const basePkg = require('./init/basePkg.json')

const setPluginName = require('./setPluginName')
// chrome extensions模版仓库地址
// const GITTEMPLATEURL = 'KableShow/chrome-extensions-template'

// vue cli3上复制来的清屏函数
const clearConsole = title => {
  if (process.stdout.isTTY) {
    const blank = '\n'.repeat(process.stdout.rows)
    console.log(blank)
    readline.cursorTo(process.stdout, 0, 0)
    readline.clearScreenDown(process.stdout)
    if (title) {
      console.log(title)
    }
  }
}

const promptList = [
  // 具体交互内容
]

// 设置插件名称
promptList.push({
  type: 'input',
  message: "Please set your extensions's name（required）:",
  validate: pluginName => pluginName.trim() !== '',
  name: 'pluginName'
})

// 是否需要一个执行在document_start时机的content script
promptList.push({
  type: 'confirm',
  message: 'Do you need an content script which run at "document_start"?',
  name: 'document_start'
})

// 是否typescript
promptList.push({
  type: 'confirm',
  message: 'Use Typescript?',
  name: 'typescript'
})

// 勾选需要安装的插件
promptList.push({
  type: 'checkbox',
  // 写中文message，这个checkbox在上下移动的时候会一直跳？？？？？被迫英文，非国际化
  // message: "选择需要安装的插件/库:",
  message: 'Check the features needed for your project:',
  name: "pluginList",
  choices: (answers) => {
    let choices = [
      {
        name: 'handlebars（js语义模板库）',
        value: 'handlebars'
      },
      {
        name: 'axios（http工具库）',
        value: 'axios',
        checked: true // 默认选中
      },
      new inquirer.Separator("--- css预编译器 ---"), // 添加分隔符
      {
        name: 'less',
        checked: true // 默认选中
      },
      {
        name: 'sass（dart-sass）',
        value: 'sass'
      },
      {
        name: 'stylus'
      }
    ]
    if (answers.typescript) {
      choices.unshift({
        name: "tslint",
        value: "tslint",
        checked: true // 默认选中
      })
    } else {
      choices.unshift({
        name: "eslint（standard）",
        value: "eslint",
        checked: true // 默认选中
      })
    }
    return choices
  },
  pageSize: 10
})

module.exports = function (fileName, cmd) {
  // 复制基础package.json
  let pkg = Object.assign({}, basePkg)
  const projectPath = `${process.cwd()}/${fileName}`
  if (fs.existsSync(projectPath)) {
    return console.log(chalk.redBright.bold('ERROR: ') + `已经存在${fileName}目录了！`)
  }
  clearConsole()
  // 创建项目文件夹
  fs.mkdirSync(projectPath)
  // 复制模板
  cloneFile(path.join(__dirname, '../template'), projectPath)
  console.log(chalk.bold.yellowBright('Chrome Extensions初始化配置：'))
  inquirer.prompt(promptList).then(async answers => {
    // console.log(answers); // 返回的结果
    let spinner = ora('Initialize Chrome Extensions Template......').start()
    // 根据选择，初始化项目
    initProject(answers, projectPath, pkg)
    // 设置插件名称
    await setPluginName(answers.pluginName, projectPath)
    spinner.succeed('Initialized successfully')
    let initSpinner = ora('Installing dependencies......').start()
    process.chdir(projectPath)
    let npmProcess = exec('npm install', (error, stdout, stderr) => {
      if (error) {
        initSpinner.color = 'red';
        initSpinner.fail(chalk.red('安装项目依赖失败，请自行重新安装！'));
        console.log(error);
      } else {
        initSpinner.color = 'green';
        initSpinner.succeed('安装依赖成功');
        console.log(`${stderr}${stdout}`);
        console.log();
        console.log(chalk.green('项目已初始化成功！'));
      }
    })
    process.on('SIGINT', () => {
      initSpinner.color = 'red';
      initSpinner.fail(chalk.red('安装项目依赖终止，请自行安装依赖！'));
      console.log(chalk.yellowBright(`Command: cd ${fileName} && npm i`))
      process.kill(npmProcess.pid)
      // process.kill(process.pid)
      process.exit(0)
    })
  })
}
