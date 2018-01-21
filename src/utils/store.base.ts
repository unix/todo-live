import File from './file'
import Filter from './filter'

export type StoreQueryValue = {
  // query key: $lt, $lte, $gt, $gte, $ne
  [key: string]: string | number,
}

export type StoreQuery = {
  [key: string]: string | StoreQueryValue,
}

export type FileKeyValue = {
  [key: string]: any,
}

export interface UserStore {
  find: (query: StoreQuery) => any[],
  findOne: (query: StoreQuery) => any,
  findAll: () => any[],
  save: (key: string, value: any) => void,
}

export class StoreBase {
  
  readonly root: string = Filter.path(`${__dirname}/../../.storage`)
  private database: string = 'list'
  private url: string
  
  static CheckWorkEnv(root: string): void {
    !File.existsSync(root) && File.spawnSync('mkdir', [root])
  }
  
  static queryOperator(oper: string): string {
    return {
      '$lt': '<', '$lte': '<=', '$gt': '>', '$gte': '>=', '$ne': '!==',
    }[oper]
  }
  
  constructor(database: string) {
    StoreBase.CheckWorkEnv(this.root)
    this.use(database)
  }
  
  protected use(database: string): StoreBase {
    this.database = database
    this.init()
    return this
  }
  
  protected implode(database: string = this.database): void {
    const path = this.makeBasePath()
    File.existsSync(path) && File.spawnSync('rm', ['-rf', path])
  }
  
  protected async getFile(): FileKeyValue[] {
    try {
      const fileContent: string = await File.readFile(this.url, 'utf-8')
      const files: FileKeyValue[] = JSON.parse(fileContent || '[]')
      return files
    } catch (e) {
      return []
    }
  }
  
  protected async setOne(file: FileKeyValue = {}): void {
    try {
      const files = await this.getFile()
      const fileContent: string = JSON.stringify(files.concat(file))
      await File.writeFile(this.url, fileContent, 'utf-8')
    } catch (e) {
    }
  }
  
  protected async setAll(files: FileKeyValue[]): void {
    try {
      const fileContent: string = JSON.stringify(files)
      await File.writeFile(this.url, fileContent, 'utf-8')
    } catch (e) {
    }
  }
  
  private init(): void {
    const path = this.makeBasePath()
    if (File.exists(path)) {
      this.url = path
      return
    }
    File.spawnSync('touch', [path])
    this.url = path
  }
  
  private makeBasePath(): string {
    return Filter.path(`${this.root}/todo_live_${this.database}.json`)
  }
  
}
