import * as should from 'should'

import {Connection} from '../src/Connection'
import {JDBC} from '../src/JDBC'

describe('JDBC', () => {
  it('should register h2 driver', () => {
    new JDBC({
      className: 'org.h2.Driver',
      url: 'jdbc:h2:mem:test'
    })
  })

  it('should connect to h2 memory database', () => {
    const jdbc = new JDBC({
      className: 'org.h2.Driver',
      url: 'jdbc:h2:mem:test'
    })

    return jdbc.getConnection()
      .then((connection: Connection) => {
        should.exist(connection)
      })
  })

  it('should create and execute a statement', async () => {
    const jdbc = new JDBC({
      className: 'org.h2.Driver',
      url: 'jdbc:h2:mem:test'
    })

    const statement = await jdbc.createStatement()
    await statement.executeUpdate(`
      CREATE TABLE jdbc_test_table (
        id int not null
      )
    `)

    const result = await statement.executeUpdate(`
      INSERT INTO jdbc_test_table (id) VALUES
      (1),
      (2)
    `)

    result.should.be.equal(2)

    const result2 = await statement.executeQuery(`
        SELECT * FROM jdbc_test_table
    `)

    const resultSet = result2.fetchAllResults()
    resultSet.should.have.length(2)
  })
})
