#!/usr/bin/env node

const chalk = require('chalk')
const program = require('commander')

program
  .command('generate')
  .description('生成对应语言的文件')
  .option('-m, --moduleName <moduleName>', '配置项目名称,如果不指定则自动获取')
  .option('-p, --preset', '选择对应的模板类型') //询问选择生成模板类型
  .option('-l, --list', '选择列表类型') //询问是否要设置列表类型
  .option('-f, --force', '强制覆盖文件') //是否强制覆盖文件
  .option('-i, --ispublic', '生成Model的时候Swift的访问控制')
  .alias('g')
  .action((...args) => {
    let cmd = args.pop()
    let options = args
    require('../packages/lib/generate')(options, cleanArgs(cmd))
  })

program
  .command('config')
  .option('-p, --project', '本项目配置,当前文件夹下增加gckitconfig,默认是用户目录下')
  .option('-f, --force', '强制覆盖配置文件')
  .option('-s, --show', '查看对应配置文件')
  .option('-g, --cgtype', '自定义生成文件类型')
  .option('-l, --clang', '自定义生成语言')
  .alias('c')
  .description('基本参数配置')
  .action((...args) => {
    require('../packages/lib/config')(cleanArgs(args.pop()))
  })

// output help information on unknown commands
program
  .arguments('<command>')
  .action((cmd) => {
    program.outputHelp()
    console.log(`  ` + chalk.red(`未知命令 ${chalk.yellow(cmd)}.`))
    console.log()
  })

// add some useful info on help
program.on('--help', () => {
  console.log()
  console.log(`  运行 ${chalk.cyan(`gckit <command> --help`)} 查看详细帮助信息.`)
  console.log()
})

program.commands.forEach(c => c.on('--help', () => console.log()))

program.parse(process.argv)


if (!process.argv.slice(2).length) {
  program.outputHelp()
}
// commander passes the Command object itself as options,
// extract only actual options into a fresh object.
function cleanArgs(cmd) {
  const args = {}
  cmd.options.forEach(o => {
    const key = o.long.replace(/^--/, '')
    // if an option is not present and Command has a method with the same name
    // it should not be copied
    if (typeof cmd[key] !== 'function' && typeof cmd[key] !== 'undefined') {
      args[key] = cmd[key]
    }
  })
  return args
}
