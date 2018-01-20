import { StoreBase, UserStore } from './store.base'

export default class Store extends StoreBase implements UserStore {
  
  constructor(database: string) {
    super(database)
  }
  
  find(): any {
  
  }
  
  findAll(): any {
  
  }
  
  findOne(): any {
  
  }
  
  save(): any {
  
  }
  
}
