#! /usr/bin/env node --harmony

const program = require('commander')

'use strict'

program
  .version('0.0.1')

program
  .command('create <app-name>')
  .description('create a new chrome extensions project')
  .alias('c')
  .action((name, cmd) => {
    require('../lib/create')(name, cmd)
  })

// 一定要加这个，不然不会执行
program.parse(process.argv);
