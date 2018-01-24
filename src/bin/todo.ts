import * as commander from 'commander'
import * as notifier from 'update-notifier'
import * as Log from '../utils/log'
import chalk from 'chalk'
const pkg = require('../../package.json')

const v: string = process.version.match(/\d+/g)[0]
if (+v < 5) {
  console.log(chalk.yellow('require NodeJS 6+ version.'))
  console.log(chalk.yellow('you need to upgrade the NodeJS.\n'))
  process.exit(1)
}

;(<any>notifier)({ pkg, updateCheckInterval: 1 }).notify({ isGlobal: true })


;(<any>commander).outputHelp = done => {
  done = done || (passthru => passthru)
  process.stdout.write(done(''))
  Log.help()
  commander.emit('--help')
}
commander
  .version(pkg.version)
  .usage('<command> [options]')
  .command('add', 'create a task').alias('a')
  .command('show', 'show all tasks').alias('s')
  .command('do', 'do a task').alias('d')
  .command('rm', 'remove a task').alias('r')
  .command('log', 'show task history').alias('l')
  .parse(process.argv)


