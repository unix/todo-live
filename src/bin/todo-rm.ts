import * as commander from 'commander'
import { DEFAULT_DATABASE } from '../utils/constants'
import { Store } from '../utils/store'
import { removeAndRearrangeTask } from '../core/task'
const store = new Store(DEFAULT_DATABASE)

commander
  .option('-a, --all', 'remove all tasks')
  .parse(process.argv)

const all = commander.all || false
const index = commander.args && commander.args.length && commander.args[0]

;(async() => {
  if (all) {
    await store.removeAll()
    return console.log('All tasks have been deleted.\n')
  }
  
  if (!index) return console.log(`commander [todo rm] need task id, like: [todo rm 1].\n`)
  const task = await store.findOne({ index: +index })
  if (!task || !task._id) return console.log(`not found task ${index}!\n`)
  
  await removeAndRearrangeTask(task._id)
  console.log(`TASK ${index} has been deleted.\n`)
  
})()
