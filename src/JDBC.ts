import * as debug from 'debug'
import * as Promise from 'bluebird'

import {isEmpty} from 'lodash'
import {Connection, IConnection} from './Connection'
import {Java} from './Java'
import {Statement} from './Statement'

export interface IJDBCConfig {
  className: string
  url: string
  username?: string
  password?: string
}

export class JDBC {
  private connection: Promise<Connection>
  private config: IJDBCConfig

  private debug: debug.IDebugger = debug('@naxmefy/jdbc')

  constructor (config: IJDBCConfig) {
    this.config = config
    this.validateConfig()
    this.debug('setup jdbc instance for', this.config.className)
    this.registerDriver()
  }

  getConnection (connectIfClosed?: boolean): Promise<Connection> {
    if (!this.connection) {
      return this.connection = this.newConnection()
    }

    return this.connection.then((connection: Connection) => {
      if (connection.isClosed() && connectIfClosed) {
        return this.connection = this.newConnection()
      }

      return connection
    })
  }

  createStatement (connectIfClosed?: boolean): Promise<Statement> {
    return this.getConnection(connectIfClosed)
      .then((connection: Connection) => connection.createStatement())
  }

  private validateConfig (): void {
    if (isEmpty(this.config.className)) {
      throw new Error('Missing driver class')
    }
  }

  private classForName (): any {
    this.debug('generate new java instance for driver', this.config.className)
    return Java.getInstance().java.newInstanceSync(this.config.className)
  }

  private registerDriver (): any {
    const driver = this.classForName()
    this.debug('register jdbc driver', this.config.className)
    return Java.getInstance().java.callStaticMethodSync('java.sql.DriverManager', 'registerDriver', driver)
  }

  private newConnection (): Promise<Connection> {
    return Java.getInstance().java.callStaticMethodAsync(
      'java.sql.DriverManager',
      'getConnection',
      this.config.url,
      this.config.username || null,
      this.config.password || null
    )
      .then((connection: IConnection) => new Connection(connection))
  }
}
