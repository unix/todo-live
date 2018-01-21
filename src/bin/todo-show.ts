import * as chalk from 'chalk'
import * as commander from 'commander'
import * as inquirer from 'inquirer'
import Filter from '../utils/filter'
import { Store } from '../utils/store'
import {
  DEFAULT_DATABASE, DEFAULT_TODO_LEVEL_COLORS,
  DEFAULT_TODO_STATUS_GROUP,
} from '../utils/constants'
import { TodoItem } from '../types'
import * as webpack from 'webpack'

commander
  .option('-e, --edit', 'edit task')
  .parse(process.argv)

const edit = commander.edit || false
const store = new Store(DEFAULT_DATABASE)

const makeTaskQuestions = (task: TodoItem) => [{
  type: 'input',
  name: 'title',
  message: 'title of the task: ',
  default: task.title,
  suffix: '(press enter to skip)',
  validate: v => !!v,
}, {
  type: 'editor',
  name: 'description',
  message: 'description of the task: ',
}]

const showEditor = async(list: TodoItem[]) => {
  const questions = [{
    type: 'list',
    name: 'title',
    message: 'Select the task to be edited: ',
    choices: list.map(item => item.title),
  }]
  console.log(' ')
  const answer = await inquirer.prompt(questions)
  const task: TodoItem = list.find(item => item.title === answer.title)
  const taskQuestions = makeTaskQuestions(task)
  const taskAnswer = await inquirer.prompt(taskQuestions)
  const nextTask = Object.assign({}, task, taskAnswer)
  await store.update({ _id: task._id }, nextTask)
  console.log('task updated.\n')
}

;(async() => {
  const threeDaysTime = +new Date() - (1000 * 60 * 60 * 24) * 3
  const list: TodoItem[] = await store.find({ createAt: { $gte: threeDaysTime } })
  
  if (!list || !list.length) return console.log('Nothing needs to do.\n')
  if (edit) return await showEditor(list)
  
  console.log('↓')
  list.forEach(item => {
    const text = item.status === DEFAULT_TODO_STATUS_GROUP.unsolved ? '⚬' : '●'
    const level = (<any>chalk).hex(DEFAULT_TODO_LEVEL_COLORS[item.level])(text)
    console.log(`${level} ${Filter.strEllipsis(item.title, 20)}`)
    item.description && console.log(`  - ${Filter.strEllipsis(item.description, 40)}`)
  })
  console.log(' ')
})()
