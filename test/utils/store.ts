import { Store } from '../../src/utils/store'
import { expect } from 'chai'

describe('Storage actions', () => {
  
  let TestStore: Store
  before(() => TestStore = new Store('test'))
  
  it('should return saved object', async() => {
    await TestStore.save({ test_key: 'test' })
    const result = await TestStore.findOne({})
    await TestStore.removeAll()
    expect(result).to.be.include({ test_key: 'test' })
  })
  
  it('should return specified query results', async() => {
    await TestStore.save({ name: 'test1' })
    await TestStore.save({ name: 'test2' })
    const result = await TestStore.findOne({ name: 'test2' })
    await TestStore.removeAll()
    expect(result).to.be.include({ name: 'test2' })
  })
  
  it('should auto improve key of _id', async() => {
    await TestStore.save({ name: 'test1' })
    const result = await TestStore.findOne({ name: 'test1' })
    await TestStore.removeAll()
    expect(result).to.contains.keys('_id')
  })
  
  it('should return group data', async() => {
    await TestStore.save({ name: 'test1' })
    await TestStore.save({ name: 'test2' })
    const results = await TestStore.find({})
    await TestStore.removeAll()
    expect(results).to.a('array').lengthOf(2)
  })
  
  it('should find empty object', async() => {
    const result = await TestStore.findOne({ name: 'empty' })
    expect(result).to.a('object')
  })
  
  it('should find empty array', async() => {
    const result = await TestStore.find({ name: 'empty' })
    expect(result).to.a('array').lengthOf(0)
  })
  
  it('should update specified query document', async() => {
    await TestStore.save({ name: 'will_update', val: 1 })
    await TestStore.update({ name: 'will_update' }, { val: 2 })
    const result = await TestStore.findOne({ name: 'will_update' })
    expect(result).to.a('object').include({ val: 2 })
  })
  
  it('should return storage count', async() => {
    await TestStore.removeAll()
    const result1 = await TestStore.count()
    await TestStore.save({ name: 'hello', val: 1 })
    const result2 = await TestStore.count()
    await TestStore.save({ name: 'hello', val: 2 })
    const result3 = await TestStore.count()
    expect(result1).to.a('number').eq(0)
    expect(result2).to.a('number').eq(1)
    expect(result3).to.a('number').eq(2)
  })
  
  
  after(() => TestStore.implode())
  
})

