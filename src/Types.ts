import { Java } from './Java'

export function Types() {
  const java = Java.getInstance().java
  const typeNames: string[] = []

  typeNames[java.getStaticFieldValue("java.sql.Types", "BIT")] = "Boolean"
  typeNames[java.getStaticFieldValue("java.sql.Types", "TINYINT")] = "Short"
  typeNames[java.getStaticFieldValue("java.sql.Types", "SMALLINT")] = "Short"
  typeNames[java.getStaticFieldValue("java.sql.Types", "INTEGER")] = "Int"
  typeNames[java.getStaticFieldValue("java.sql.Types", "BIGINT")] = "String"
  typeNames[java.getStaticFieldValue("java.sql.Types", "FLOAT")] = "Float"
  typeNames[java.getStaticFieldValue("java.sql.Types", "REAL")] = "Float"
  typeNames[java.getStaticFieldValue("java.sql.Types", "DOUBLE")] = "Double"
  typeNames[java.getStaticFieldValue("java.sql.Types", "NUMERIC")] = "BigDecimal"
  typeNames[java.getStaticFieldValue("java.sql.Types", "DECIMAL")] = "BigDecimal"
  typeNames[java.getStaticFieldValue("java.sql.Types", "CHAR")] = "String"
  typeNames[java.getStaticFieldValue("java.sql.Types", "VARCHAR")] = "String"
  typeNames[java.getStaticFieldValue("java.sql.Types", "LONGVARCHAR")] = "String"
  typeNames[java.getStaticFieldValue("java.sql.Types", "DATE")] = "Date"
  typeNames[java.getStaticFieldValue("java.sql.Types", "TIME")] = "Time"
  typeNames[java.getStaticFieldValue("java.sql.Types", "TIMESTAMP")] = "Timestamp"
  typeNames[java.getStaticFieldValue("java.sql.Types", "BOOLEAN")] = "Boolean"
  typeNames[java.getStaticFieldValue("java.sql.Types", "NCHAR")] = "String"
  typeNames[java.getStaticFieldValue("java.sql.Types", "NVARCHAR")] = "String"
  typeNames[java.getStaticFieldValue("java.sql.Types", "LONGNVARCHAR")] = "String"
  typeNames[java.getStaticFieldValue("java.sql.Types", "BINARY")] = "Bytes"
  typeNames[java.getStaticFieldValue("java.sql.Types", "VARBINARY")] = "Bytes"
  typeNames[java.getStaticFieldValue("java.sql.Types", "LONGVARBINARY")] = "Bytes"
  typeNames[java.getStaticFieldValue("java.sql.Types", "BLOB")] = "Bytes"

  return typeNames
}
