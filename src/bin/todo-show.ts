import * as chalk from 'chalk'
import { Store } from '../utils/store'
import { DEFAULT_DATABASE, DEFAULT_TODO_LEVEL_COLORS, DEFAULT_TODO_STATUS_GROUP } from '../utils/constants'
import { TodoItem } from '../types'

;(async() => {
  const store = new Store(DEFAULT_DATABASE)
  const threeDaysTime = +new Date() - (1000 * 60 * 60 * 24) * 3
  const list: TodoItem[] = await store.find({ createAt: { $gte: threeDaysTime } })
  
  if (!list || !list.length) {
    return console.log('Nothing needs to do.\n')
  }
  console.log('↓')
  list.forEach(item => {
    const text = item.status === DEFAULT_TODO_STATUS_GROUP.unsolved ? '⚬' : '●'
    const level = chalk.hex(DEFAULT_TODO_LEVEL_COLORS[(<string>item.level)])(text)
    console.log(`${level} ${item.title}`)
    item.description && console.log(`  - ${item.description}`)
  })
  console.log(' ')
})()
