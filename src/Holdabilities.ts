import { Java } from './Java'

export function Holdabilities () {
  const java = Java.getInstance().java
  const holdability: string[] = []

  holdability[java.getStaticFieldValue('java.sql.ResultSet', 'CLOSE_CURSORS_AT_COMMIT')] = 'CLOSE_CURSORS_AT_COMMIT'
  holdability[java.getStaticFieldValue('java.sql.ResultSet', 'HOLD_CURSORS_OVER_COMMIT')] = 'HOLD_CURSORS_OVER_COMMIT'

  return holdability
}
