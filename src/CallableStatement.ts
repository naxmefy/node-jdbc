import * as Promise from 'bluebird'

import { Java } from './Java'
import { IPreparedStatement, PreparedStatement } from './PreparedStatement'

export interface ICallableStatement extends IPreparedStatement {
  registerOutParameterSync (index: number, type: string): void
  getStringSync (index: number): string
  getIntSync (index: number): number
}

export class CallableStatement extends PreparedStatement {
  private callableStatement: ICallableStatement

  constructor (statement: ICallableStatement) {
    super(statement)
    this.callableStatement = Promise.promisifyAll(statement) as ICallableStatement
  }

  registerOutParameter (index: number, type: string): void {
    this.callableStatement.registerOutParameterSync(index, this.getType(type))
  }

  getString (index: number): string {
    return this.callableStatement.getStringSync(index)
  }

  getInt (index: number): number {
    return this.callableStatement.getIntSync(index)
  }

  getType (type: string) {
    return Java.getInstance().java.getStaticFieldValue('java.sql.Types', type)
  }
}
