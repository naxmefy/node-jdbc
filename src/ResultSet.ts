import * as Promise from 'bluebird'
import * as _ from 'lodash'
import { ResultSetMetaData, IResultSetMetaData, IColumnMetaData, IColumnLabel } from './ResultSetMetaData';

export interface IResultSet {
  nextSync(): IResultSet
  getMetaDataSync(): IResultSetMetaData

  getBooleanSync(columnLabel: IColumnLabel): any
  getBytesSync(columnLabel: IColumnLabel): any
  getStringSync(columnLabel: IColumnLabel): any
  getShortSync(columnLabel: IColumnLabel): any
  getIntSync(columnLabel: IColumnLabel): any
  getFloatSync(columnLabel: IColumnLabel): any
  getDoubleSync(columnLabel: IColumnLabel): any
  getBigDecimalSync(columnLabel: IColumnLabel): any
  getDateSync(columnLabel: IColumnLabel): any
  getTimeSync(columnLabel: IColumnLabel): any
  getTimestampSync(columnLabel: IColumnLabel): any
  getObjectSync(columnLabel: IColumnLabel): any
}

export type IFetchResult = {}

export class ResultSet {
  private resultSet: IResultSet

  constructor(resultSet: IResultSet) {
    this.resultSet = <IResultSet>Promise.promisifyAll(resultSet)
  }

  next() {
    return this.resultSet.nextSync()
  }

  getMetaData(): ResultSetMetaData {
    return new ResultSetMetaData(this.resultSet.getMetaDataSync())
  }

  fetchResult(): IFetchResult {
    const metas: IColumnMetaData[] = this.getMetaData().getAllColumnMeta()
    const result: IFetchResult = {}

    for (let i = 0; i < metas.length; i++) {
      const meta: IColumnMetaData = metas[i]
      const getterName = 'get' + meta.type.name + 'Sync'
      if (_.has(this.resultSet, getterName) === false) {
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

  fetchAllResults(): IFetchResult[] {
    const results: IFetchResult[] = []
    while(this.next()) {
      results.push(this.fetchResult())
    }
    return results
  }
}
