import Chalk from 'chalk'
import * as commander from 'commander'
import * as inquirer from 'inquirer'
import Filter from '../utils/filter'
import { Store } from '../utils/store'
import {
  DEFAULT_DATABASE, DEFAULT_TODO_LEVEL_COLORS,
  DEFAULT_TODO_STATUS_GROUP,
} from '../utils/constants'
import { TodoItem } from '../types'
const store = new Store(DEFAULT_DATABASE)

commander
  .option('-e, --edit', 'edit task')
  .parse(process.argv)

const edit = commander.edit || false
const index = commander.args && commander.args.length && commander.args[0]

const makeTaskQuestions = (task: TodoItem) => [{
  type: 'input',
  name: 'title',
  message: 'title of the task: ',
  default: task.title,
  suffix: '(press enter to skip)',
  validate: v => !!v,
}, {
  type: 'editor',
  default: task.description,
  name: 'description',
  message: 'description of the task: ',
}]

const showError = async() => console.log('Nothing needs to do.\n')

const showEditor = async(index: number) => {
  console.log(' ')
  const task: TodoItem = await store.findOne({ index: index })
  const taskQuestions = makeTaskQuestions(task)
  const answer = await inquirer.prompt(taskQuestions)
  if (answer.description) {
    console.log(answer.description)
    answer.description = answer.description.replace(/\n/g, '. ')
  }
  const nextTask = Object.assign({}, task, answer)
  await store.update({ _id: task._id }, nextTask)
  console.log('task updated.\n')
}

const showTask = async(index: number) => {
  try {
    const task: TodoItem = await store.findOne({ index: index })
    if (!task || !task._id) return await showError()
    const status = Chalk.hex('#E79627')(`TASK [${index}] (${task.status}):`)
    const text = task.status === DEFAULT_TODO_STATUS_GROUP.unsolved ? '⚬' : '●'
    const title = Chalk.hex(DEFAULT_TODO_LEVEL_COLORS[task.level])(`${text} ${task.title}`)
    
    console.log(status)
    console.log(title)
    console.log(`  ${task.description}`)
    if (task.notes && task.notes.length) {
      console.log(Chalk.hex('#E79627')('TASK NOTES:'))
      task.notes.forEach(note => console.log(`  ${note}`))
    }
    console.log(' ')
  } catch (e) {
    return await showError()
  }
}

;(async() => {
  // const threeDaysTime = +new Date() - (1000 * 60 * 60 * 24) * 3
  const list: TodoItem[] = await store.find({})
  
  // show error
  if (!list || !list.length) return await showError()
  // show editor screen
  if (edit && index) return await showEditor(+index)
  // show one task
  if (index) return await showTask(+index)
  
  // show list
  console.log('↓')
  list.forEach(item => {
    const status = item.status === DEFAULT_TODO_STATUS_GROUP.unsolved ? '⚬' : '●'
    const colorPicker = Chalk.hex(DEFAULT_TODO_LEVEL_COLORS[item.level])
    const text = colorPicker(`${status} ${item.index} ${Filter.strEllipsis(item.title, 20)}`)
    console.log(`${text}`)
    item.description && console.log(`    - ${Filter.strEllipsis(item.description, 40)}`)
  })
  console.log(' ')
})()
