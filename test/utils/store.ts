import { expect } from 'chai'
import { Store } from '../../src/utils/store'

describe('Storage actions', () => {
  
  let TestStore
  before(() => TestStore = new Store('test'))
  
  it('should return saved object', async() => {
    await TestStore.save({ test_key: 'test' })
    const result = await TestStore.findOne()
    expect(result).to.be.include({ test_key: 'test' })
    TestStore.removeAll()
  })
  
  it('should return specified query results', async() => {
    await TestStore.save({ name: 'test1' })
    await TestStore.save({ name: 'test2' })
    const result = await TestStore.findOne({ name: 'test2' })
    expect(result).to.be.include({ name: 'test2' })
    TestStore.removeAll()
  })
  
  it('should auto improve key of _id', async() => {
    await TestStore.save({ name: 'test1' })
    const result = await TestStore.findOne({ name: 'test1' })
    expect(result).to.contains.keys('_id')
    TestStore.removeAll()
  })
  
  it('should return group data', async() => {
    await TestStore.save({ name: 'test1' })
    await TestStore.save({ name: 'test2' })
    const results = await TestStore.find()
    expect(results).to.a('array').lengthOf(2)
    TestStore.removeAll()
  })
  
  it('should find empty object', async() => {
    const result = await TestStore.findOne({ name: 'empty' })
    expect(result).to.a('object')
  })
  
  it('should find empty array', async() => {
    const result = await TestStore.find({ name: 'empty' })
    expect(result).to.a('array').lengthOf(0)
  })
  
  after(() => TestStore.implode())
  
})

