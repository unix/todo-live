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
  .parse(process.argv)

  

