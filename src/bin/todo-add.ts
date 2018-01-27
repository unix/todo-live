import * as inquirer from 'inquirer'
import * as Filter from '../utils/filter'
import * as File from '../utils/file'
import { Store } from '../utils/store'
import { DEFAULT_TODO_STATUS_GROUP, DEFAULT_DATABASE, CONFIG_DATABASE } from '../utils/constants'
import { Config } from '../types'
const cronPath = require('path').resolve(__dirname, '../cron.js')
const pkg = require('../../package.json')
const store = new Store(DEFAULT_DATABASE)
const config = new Store(CONFIG_DATABASE)
const questions = [{
  type: 'input',
  name: 'title',
  message: 'title of the task: ',
  suffix: '(required)',
  validate: v => !!v,
}, {
  type: 'input',
  name: 'cronTime',
  message: 'time needed for this task(hour): ',
  suffix: '(press enter to skip)',
}, {
  type: 'input',
  name: 'description',
  message: 'description of the task: ',
  suffix: '(press enter to skip)',
}]

;(async() => {
  console.log(`you are creating a task (${pkg.name}@${pkg.version})\n`)
  const answer = await inquirer.prompt(questions)
  const cronTime: number = Filter.strToTime(answer.cronTime)
  const count: number = await store.count()
  await store.save(Object.assign(answer, {
    createAt: +new Date(),
    status: DEFAULT_TODO_STATUS_GROUP.default,
    index: count + 1,
    description: answer.description || '',
    cronTime,
  }))

  try {
    const setting: Config = await config.findOne({})
    const fork = File.fork(cronPath)
    await config.removeAll()
    await config.save(Object.assign({}, setting, {
      pid: fork.pid,
    }))
    setting.pid && await File.exec(`kill -9 ${setting.pid}`)
  } catch (e) {
  }
  
  console.log('\n task saved!')
  process.exit(0)
})()
