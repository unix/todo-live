import * as commander from 'commander'
import { ARCHIVE_DATABASE } from '../utils/constants'
import { Store } from '../utils/store'
import Chalk from 'chalk'
const store = new Store(ARCHIVE_DATABASE)

commander
  .option('-c, --clean', 'clean task history')
  .parse(process.argv)
const clean = commander.clean || false

;(async() => {
  if (clean) {
    await store.removeAll()
    return console.log('All history have been deleted.\n')
  }
  
  const history = await store.findAll()
  if (!history || !history.length) return console.log('No historical record was found.\n')
  
  console.log(Chalk.hex('#E79627')('TASK RECORDS:'), '(enter [--clean] clean all)')
  history.forEach(his => {
    console.log('')
    console.log(`  ${his.title}`)
    his.description && console.log(`    - ${his.description}`)
  })
  console.log('')
  
})()
