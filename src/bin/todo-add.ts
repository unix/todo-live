import * as inquirer from 'inquirer'
import { Store } from '../utils/store'
import {
  DEFAULT_TODO_LEVEL_GROUP, DEFAULT_TODO_LEVEL, DEFAULT_TODO_STATUS_GROUP, DEFAULT_DATABASE,
} from '../utils/constants'
const pkg = require('../../package.json')

const questions = [{
  type: 'list',
  name: 'level',
  message: 'Please select the priority of the task: ',
  default: DEFAULT_TODO_LEVEL,
  choices: [...DEFAULT_TODO_LEVEL_GROUP, new inquirer.Separator(' ')],
}, {
  type: 'input',
  name: 'title',
  message: 'title of the task: ',
  suffix: '(required)',
  validate: v => !!v,
}, {
  type: 'input',
  name: 'description',
  message: 'description of the task: ',
  suffix: '(press enter to skip)',
}]

;(async() => {
  console.log(`you are creating a task (${pkg.name}@${pkg.version})\n`)
  const store = new Store(DEFAULT_DATABASE)
  const answers = await inquirer.prompt(questions)
  const count: number = await store.count()
  await store.save(Object.assign(answers, {
    createAt: +new Date(),
    status: DEFAULT_TODO_STATUS_GROUP.default,
    index: count + 1,
  }))
  
  console.log('\n task saved!')
})()
