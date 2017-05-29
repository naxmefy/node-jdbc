import {Holdabilities} from './Holdabilities'
import {Types} from './Types'

export interface IResultSetMetaData {
  getColumnCountSync (): number
  getColumnNameSync (columnIndex: number): string
  getColumnLabelSync (columnIndex: number): string
  getColumnTypeSync (columnIndex: number): number
}

export type IColumnType = {
  index: number,
  name: string
}

export type IColumnMetaData = {
  columnIndex: number,
  name: string,
  label: string,
  type: IColumnType
}

export class ResultSetMetaData {
  private types: string[]
  private holdabilities: string[]

  constructor (private resultSetMetaData: IResultSetMetaData) {
    this.types = Types()
    this.holdabilities = Holdabilities()
  }

  getColumnCount (): number {
    return this.resultSetMetaData.getColumnCountSync()
  }

  getColumnName (columnIndex: number): string {
    return this.resultSetMetaData.getColumnNameSync(columnIndex)
  }

  getColumnLabel (columnIndex: number): string {
    return this.resultSetMetaData.getColumnLabelSync(columnIndex)
  }

  getColumnType (columnIndex: number): IColumnType {
    const typeIndex = this.resultSetMetaData.getColumnTypeSync(columnIndex)
    return {
      index: typeIndex,
      name: this.getTypeName(typeIndex)
    }
  }

  getTypeName (typeIndex: number): string {
    return this.types[typeIndex] || 'String'
  }

  getAllColumnMeta (): IColumnMetaData[] {
    const columns: IColumnMetaData[] = []
    const columnCount = this.getColumnCount()
    for (let i = 1; i <= columnCount; i++) {
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
