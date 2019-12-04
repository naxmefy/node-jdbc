import * as Promise from 'bluebird'

import { IResultSet, ResultSet } from './ResultSet'
import { Java } from './Java'

export interface IPreparedStatement {
  setStringSync (index: number, value: string): void
  setIntSync (index: number, value: number): void
  setLongSync (index: number, value: number): void
  setTimestampSync (index: number, timestamp: string): void
  setDateSync (index: number, date: string): void
  executeUpdateAsync (): Promise<number>
  executeUpdateSync (): number
  addBatchAsync (): void
  addBatchSync (): void
  executeBatchAsync (): Promise<number[]>
  executeBatchSync (): number[]
  executeQueryAsync (): Promise<IResultSet>
  closeAsync (): void
}

export class PreparedStatement {
  protected preparedStatement: IPreparedStatement

  constructor (statement: IPreparedStatement) {
    this.preparedStatement = Promise.promisifyAll(statement) as IPreparedStatement
  }

  setString (index: number, value: string): void {
    return this.preparedStatement.setStringSync(index, value)
  }

  setInt (index: number, value: number): void {
    return this.preparedStatement.setIntSync(index, value)
  }

  setLong (index: number, value: string): void {
    const longValue = value ? Java.getInstance()
      .java.newInstanceSync('java.lang.Long', value) : 0
    return this.preparedStatement.setLongSync(index, longValue)
  }

  setTimestamp (index: number, value: string): void {
    const timestamp = value ? Java.getInstance()
      .java.callStaticMethodSync('java.sql.Timestamp', 'valueOf', value) : null
    return this.preparedStatement.setTimestampSync(index, timestamp)
  }

  setDate (index: number, value: string): void {
    const date = value ? Java.getInstance()
      .java.callStaticMethodSync('java.sql.Date', 'valueOf', value) : null
    return this.preparedStatement.setDateSync(index, date)
  }

  executeUpdate (): Promise<number> {
    return this.preparedStatement.executeUpdateAsync()
  }

  executeUpdateSync (): number {
    return this.preparedStatement.executeUpdateSync()
  }

  addBatch (): void {
    return this.preparedStatement.addBatchAsync()
  }

  addBatchSync (): void {
    return this.preparedStatement.addBatchSync()
  }

  executeBatch (): Promise<number[]> {
    return this.preparedStatement.executeBatchAsync()
  }

  executeBatchSync (): number[] {
    return this.preparedStatement.executeBatchSync()
  }

  executeQuery (): Promise<ResultSet> {
    return this.preparedStatement.executeQueryAsync()
      .then((resultSet: IResultSet) => new ResultSet(resultSet))
  }

  close (): void {
    return this.preparedStatement.closeAsync()
  }
}
