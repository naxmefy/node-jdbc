import * as Promise from 'bluebird'
import * as _ from 'lodash'
import { IColumnMetaData, IResultSetMetaData, ResultSetMetaData } from './ResultSetMetaData'

export interface IResultSet {
  nextSync (): IResultSet
  getMetaDataSync (): IResultSetMetaData

  getBooleanSync (columnLabel: string): any
  getBytesSync (columnLabel: string): any
  getStringSync (columnLabel: string): any
  getShortSync (columnLabel: string): any
  getIntSync (columnLabel: string): any
  getFloatSync (columnLabel: string): any
  getDoubleSync (columnLabel: string): any
  getBigDecimalSync (columnLabel: string): any
  getDateSync (columnLabel: string): any
  getTimeSync (columnLabel: string): any
  getTimestampSync (columnLabel: string): any
  getObjectSync (columnLabel: string): any
}

export type IFetchResult = {}

export class ResultSet {
  private resultSet: IResultSet

  constructor (resultSet: IResultSet) {
    this.resultSet = resultSet as IResultSet
  }

  next () {
    return this.resultSet.nextSync()
  }

  getMetaData (): ResultSetMetaData {
    return new ResultSetMetaData(this.resultSet.getMetaDataSync())
  }

  fetchResult (): IFetchResult {
    const metas: IColumnMetaData[] = this.getMetaData().getAllColumnMeta()
    const result: IFetchResult = {}

    for (let i = 0; i < metas.length; i++) {
      const meta: IColumnMetaData = metas[i]
      const getterName = 'get' + meta.type.name + 'Sync'
      if (typeof this.resultSet[getterName] !== 'function') {
        throw new Error(`Unknown type getter (${getterName}) for ${meta.type.name} for column ${meta.name} (${meta.label})`)
      }

      switch (true) {
        case meta.type.name === 'Date' || meta.type.name === 'Time' || meta.type.name === 'Timestamp':
          const dateValue = this.resultSet[`${getterName}`](meta.label)
          result[meta.label] = dateValue ? _.toString(dateValue) : null
          break
        case meta.type.name === 'Int' && _.isNull(this.resultSet.getObjectSync(meta.label)):
          result[meta.label] = null
          break
        default:
          result[meta.label] = this.resultSet[`${getterName}`](meta.label)
          break
      }
    }

    return result
  }

  fetchAllResults (): IFetchResult[] {
    const results: IFetchResult[] = []
    while (this.next()) {
      results.push(this.fetchResult())
    }
    return results
  }
}
