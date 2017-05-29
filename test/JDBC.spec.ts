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
})
