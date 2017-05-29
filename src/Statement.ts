import * as Promise from 'bluebird'
import {IResultSet, ResultSet} from './ResultSet'

export interface IStatement {
  executeUpdate (sql: string): number
  executeUpdateAsync (sql: string): Promise<number>
  executeQueryAsync (sql: string): Promise<IResultSet>
  addBatchAsync (sql: string): void
  addBatchSync (sql: string): void
  clearBatchSync (): void
  clearBatchAsync (): void
  executeBatchAsync (): Promise<number[]>
  executeBatchSync (): number[]
  setQueryTimeoutSync (seconds: number): void
  closeAsync (): void
}

export class Statement {
  protected statement: IStatement

  constructor (statement) {
    this.statement = Promise.promisifyAll(statement) as IStatement
  }

  executeUpdate (sql: string): Promise<number> {
    return this.statement.executeUpdateAsync(sql)
  }

  executeUpdateSync (sql: string): number {
    return this.statement.executeUpdate(sql)
  }

  executeQuery (sql: string): Promise<ResultSet> {
    return this.statement.executeQueryAsync(sql)
      .then((resultSet: IResultSet) => new ResultSet(resultSet))
  }

  addBatch (sql: string): void {
    return this.statement.addBatchAsync(sql)
  }

  addBatchSync (sql: string): void {
    return this.statement.addBatchSync(sql)
  }

  clearBatchSync (): void {
    return this.statement.clearBatchSync()
  }

  clearBatch (): void {
    return this.statement.clearBatchAsync()
  }

  executeBatch (): Promise<number[]> {
    return this.statement.executeBatchAsync()
  }

  executeBatchSync (): number[] {
    return this.statement.executeBatchSync()
  }

  setQueryTimeout (seconds: number): void {
    return this.statement.setQueryTimeoutSync(seconds)
  }

  close (): void {
    return this.statement.closeAsync()
  }
}
