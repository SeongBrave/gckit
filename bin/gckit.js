#!/usr/bin/env node

const chalk = require('chalk')
const program = require('commander')

const packageJson = require('../package.json');

program
  .version(packageJson.version, '-v, --version');

program
  .command('generate')
  .description(`🐢 ${chalk.blue('generate代码生成')}`)
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
  .command('ipa')
  .description(`🦖  ${chalk.blue('导出IPA文件')}`)
  .option('-t, --target <target>', `指定${chalk.green(`target`)}`)
  .option('-s, --scheme <scheme>', `指定${chalk.green(`scheme`)}`)
  .option('--workspaceFile <workspaceFile>', `指定${chalk.green(`workspaceFile`)}`)
  .option('--projectFile <projectFile>', `指定${chalk.green(`projectFile`)}`)
  .option('-a, --archs <archs>', 'armv7|arm64|armv7 arm64  定构建架构集')
  .option('-c, --channel', '询问分发的渠道')
  .option('-e, --bitcode', '是否启用bitcode 默认false')
  .option('-b, --bundleId <bundlueId>', '指定bundleId')
  .option('-l, --loadBundleId', '是否加载默认的bundleId')
  .option('-m, --mbobileprovisionFile <mbobileprovisionFile>', '要查看的mobileprovision文件名')
  .option('--show', '查看对应证书信息')
  .alias('i')
  .action((...args) => {
    let cmd = args.pop()
    let options = args
    require('../packages/lib/cli-ipa')(options, cleanArgs(cmd))
  })

program
  .command('linkmap')
  .description(`🦕  ${chalk.blue('查看包增量大小')}`)
  .option('-t, --target <target>', `指定${chalk.green(`target`)}`)
  .option('-s, --scheme <scheme>', `指定${chalk.green(`scheme`)}`)
  .option('-a, --archs <archs>', 'armv7|arm64|armv7 arm64 指定构建架构集')
  .option('-d, --isDebug', '是否Debug模式')
  .option('-f, --format', 'format size')
  .option('-c, --staticlib', 'static libs')
  .option('-p, --filepath <filepath>', '指定需要分析的文件(app-LinkMap-normal-arm64.txt)')
  .option('-o, --output', '是否要输出文件')
  .alias('l')
  .action((...args) => {
    let cmd = args.pop()
    let options = args
    require('../packages/lib/cli-linkmap')(options, cleanArgs(cmd))
  })

program
  .command('lipo')
  .description(`🐙 ${chalk.blue('自动合并静态库')}`)
  .option('-t, --target <target>', `指定${chalk.green(`target`)}`)
  .option('-s, --scheme <scheme>', `指定${chalk.green(`scheme`)}`)
  .option('--workspaceFile <workspaceFile>', `指定${chalk.green(`workspaceFile`)}`)
  .option('--projectFile <projectFile>', `指定${chalk.green(`projectFile`)}`)
  .option('-a, --archs <archs>', 'armv7|arm64|armv7 arm64 指定构建架构集')
  .option('-d, --isDebug', '是否Debug模式')
  .option('--iphonesimulatorFile <iphonesimulatorFile>', `指定${chalk.green(`iphonesimulatorFile`)}`)
  .option('--iphoneosFile <iphoneosFile>', `指定${chalk.green(`iphoneosFile`)}`)
  .alias('p')
  .action((...args) => {
    let cmd = args.pop()
    let options = args
    require('../packages/lib/cli-lipo')(options, cleanArgs(cmd))
  })

program
  .command('config')
  .description(`🦑 ${chalk.blue('基本参数配置')}`)
  .option('-p, --project', '本项目配置,当前文件夹下增加gckitconfig,默认是用户目录下')
  .option('-f, --force', '强制覆盖配置文件')
  .option('-s, --show', '查看对应配置文件')
  .option('-g, --cgtype', '自定义生成文件类型')
  .option('-l, --clang', '自定义生成语言')
  .option('--ipa', '自定义ipa导出配置')
  .option('--linkmap', '自定义linkmap配置')
  .option('--lipo', '自定义lipo配置')
  .alias('c')
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
  console.log('');
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
