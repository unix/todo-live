import * as commander from 'commander'
import chalk from 'chalk'
import * as notifier from 'update-notifier'
const pkg = require('../../package.json')

const v: string = process.version.match(/\d+/g)[0]
if (+v < 5) {
  console.log(chalk.yellow('require NodeJS 6+ version.'))
  console.log(chalk.yellow('you need to upgrade the NodeJS.\n'))
  process.exit(1)
}

notifier({ pkg, updateCheckInterval: 1 }).notify({ isGlobal: true })

commander
  .version(pkg.version)
  .usage('<command> [options]')
  .command('add', 'create a task').alias('a')
  .command('show', 'show all tasks').alias('s')
  .command('do', 'do a task').alias('d')
  .command('rm', 'remove a task').alias('r')
  .parse(process.argv)

