import { Holdabilities } from './Holdabilities';
import { Types } from './Types';

/**
 * IColumnCount for array of meta columns in jdbc.
 * array index begins always with 1 instead of 0
 */
export type IColumnCount = number

export interface IResultSetMetaData {
  getColumnCountSync(): IColumnCount
  getColumnNameSync(columnIndex: IColumnIndex): IColumnName
  getColumnLabelSync(columnIndex: IColumnIndex): IColumnLabel
  getColumnTypeSync(columnIndex: IColumnIndex): IColumnTypeIndex
}

export type IColumnTypeIndex = number

export type IColumnIndex = number
export type IColumnName = string
export type IColumnLabel = string
export type IColumnTypeName = string

export type IColumnType = {
  index: number,
  name: IColumnTypeName
}

export type IColumnMetaData = {
  columnIndex: IColumnIndex,
  name: IColumnName,
  label: IColumnLabel,
  type: IColumnType
}

export class ResultSetMetaData {
  private types: string[]
  private holdabilities: string[]

  constructor(private resultSetMetaData: IResultSetMetaData) {
    this.types = Types()
    this.holdabilities = Holdabilities()
  }

  getColumnCount(): IColumnCount {
    return this.resultSetMetaData.getColumnCountSync()
  }

  getColumnName(columnIndex: IColumnIndex): IColumnName {
    return this.resultSetMetaData.getColumnNameSync(columnIndex)
  }

  getColumnLabel(columnIndex: IColumnIndex): IColumnLabel {
    return this.resultSetMetaData.getColumnLabelSync(columnIndex)
  }

  getColumnType(columnIndex: IColumnIndex): IColumnType {
    const typeIndex = this.resultSetMetaData.getColumnTypeSync(columnIndex)
    return {
      index: typeIndex,
      name: this.getTypeName(typeIndex)
    }
  }

  getTypeName(typeIndex: IColumnTypeIndex): IColumnTypeName {
    return this.types[typeIndex] || 'String'
  }

  getAllColumnMeta(): IColumnMetaData[] {
    const columns: IColumnMetaData[] = []
    const columnCount = this.getColumnCount()
    for(let i = 1; i <= columnCount; i++) {
      columns.push({
        columnIndex: i,
        name: this.getColumnName(i),
        label: this.getColumnLabel(i),
        type: this.getColumnType(i)
      })
    }
    return columns
  }
}
