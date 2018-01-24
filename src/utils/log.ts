import Chalk from 'chalk'

export const help = () => {
  const c = Chalk.hex('#408587')
  const l = s => console.log(c(s))
  l('  _/_    __    ⎽ /   __   ')
  l('  /__  /⎽⎽/  /⎽ /  /⎽⎽/   ')
  l(' --FROM DHYANA_CHINA--')
  l('')
  console.log(c(' USAGE:'), ' todo <command> [options]')
  l('')
  l(' OPTIONS:')
  console.log('   -V, --version  output the version number')
  console.log('   -h, --help     output usage information')
  l('')
  l(' COMMANDS:')
  console.log('   add|a       create a task')
  console.log('   show|s      show all tasks')
  console.log('   do|d        do a task')
  console.log('   rm|r        remove a task')
  console.log('   log|l       show task history')
  l('')
}
