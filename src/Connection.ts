import * as Promise from 'bluebird'

import {IStatement, Statement} from './Statement'
import {IPreparedStatement, PreparedStatement} from './PreparedStatement'
import {CallableStatement, ICallableStatement} from './CallableStatement'

export interface IConnection {
  setAutoCommitSync (autoCommit: boolean): void
  createStatementAsync (): Promise<IStatement>
  prepareStatementAsync (sql: string): Promise<IPreparedStatement>
  prepareCallAsync (call: string): Promise<ICallableStatement>
  commitAsync (): void
  rollbackAsync (): void
  closeAsync (): void
  isClosedSync (): boolean
  isValidSync (timeout: number): void
}

export class Connection {
  private connection: IConnection

  constructor (connection: IConnection) {
    this.connection = Promise.promisifyAll(connection) as IConnection
  }

  setAutoCommit (autoCommit: boolean): void {
    return this.connection.setAutoCommitSync(autoCommit)
  }

  createStatement (): Promise<Statement> {
    return this.connection.createStatementAsync()
      .then((statement: IStatement) => new Statement(statement))
  }

  prepareStatement (sql: string): Promise<PreparedStatement> {
    return this.connection.prepareStatementAsync(sql)
      .then((prepareStatement: IPreparedStatement) => new PreparedStatement(prepareStatement))
  }

  prepareCall (call: string): Promise<CallableStatement> {
    return this.connection.prepareCallAsync(call)
      .then((callableStatement: ICallableStatement) => new CallableStatement(callableStatement))
  }

  commit (): void {
    return this.connection.commitAsync()
  }

  rollback (): void {
    return this.connection.rollbackAsync()
  }

  close (): void {
    return this.connection.closeAsync()
  }

  isClosed (): boolean {
    return this.connection.isClosedSync()
  }

  isValid (timeout: number) {
    return this.connection.isValidSync(timeout)
  }
}
