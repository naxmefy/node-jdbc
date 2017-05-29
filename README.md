# @naxmefy/jdbc

small wrapper to work with jdbc in node.

## prerequisites

**node-java**

```bash
$ npm install --save java
```

> **HINT**
>
> node-java installation can fail on windows 
> (i never got it work on windows).
>
> I used docker on windows to get it working.
>
> You can find my example docker image on docker hub at
> [https://hub.docker.com/r/naxmefy/node-java/](https://hub.docker.com/r/naxmefy/node-java/)
> or
> [https://github.com/naxmefy/docker-node-java](https://github.com/naxmefy/docker-node-java)

**node-java-maven**

```bash
$ npm install --save node-java-maven
```

## installation

```bash
$ npm install --save @naxmefy/jdbc
```

## usage

**setup jdbc driver inside ```package.json```**

```json
{
    "name": "myapp",
    "version": "0.0.0",
    "private": true,
    "java": {
      "dependencies": [
        {
          "groupId": "com.h2database",
          "artifactId": "h2",
          "version": "1.4.195"
        }
      ]
    },
    "dependencies": {
      "@naxmefy/jdbc": "^0.1.0",
      "java": "^0.8.0",
      "node-java-maven": "^0.0.12"
    }
}
```

**in your main file (js)**

```javascript
const JDBC = require('@naxmefy/jdbc').JDBC
const myDatabase = new JDBC({
  className: 'any.jdbc.Driver',
  url: 'jdbc:to:any.db',
  username: 'foo',
  password: 'bar'
})

myDatabase.createStatement()
  .then(statement => {
    return statement.executeQuery('SELECT * FROM FOO')
  })
  .then(resultSet => {
      const arrayOfResults = resultSet.fetchAllResults()
      arrayOfResults.forEach(result => {
          console.log(result)
      })
  })
```

**or with typescript (types included)**
```typescript
import {JDBC} from '@naxmefy/jdbc'
const myDatabase = new JDBC({
  className: 'any.jdbc.Driver',
  url: 'jdbc:to:any.db',
  username: 'foo',
  password: 'bar'
})

myDatabase.createStatement()
  .then(statement => {
    return statement.executeQuery('SELECT * FROM FOO')
  })
  .then(resultSet => {
      const arrayOfResults = resultSet.fetchAllResults()
      arrayOfResults.forEach(result => {
          console.log(result)
      })
  })
```

## usage with Docker

> **HINT**
>
> The following docker config contains proxy config too.
> **Maybe you do not need it**.

### example ``` Dockerfile ```

```dockerfile
FROM naxmefy/node-java

WORKDIR /usr/app

COPY package.json .
RUN npm config set proxy $HTTP_PROXY
RUN npm config set https-proxy $HTTPS_PROXY
RUN npm install --quiet

COPY . .
```

### example ``` docker-compose.yml ```

```yaml
version: '2'
services:
  web:
    build:
      context: .
      args:
        - http_proxy
        - https_proxy
        - no_proxy
        - HTTP_PROXY
        - HTTPS_PROXY
        - NO_PROXY
    command: npm start
    volumes:
      - .:/usr/app/
      - /usr/app/node_modules
    ports:
      - "3000:3000"
    links:
      - postgres
    environment:
      NODE_ENV: development
      DEBUG: @naxmefy/jdbc
  postgres:
    image: postgres
    environment:
      POSTGRES_USER: pguser
      POSTGRES_PASSWORD: pgpass
      POSTGRES_DB: pgdb
    ports:
      - "5432:5432"
```

### example java maven config

```json
{
  "java": {
    "dependencies": [
      {
        "groupId": "org.postgresql",
        "artifactId": "postgresql",
        "version": "42.1.1"
      }
    ]
  }
}
```

### example jdbc instantiation

```javascript
const myPostgresDB = new JDBC({
  className: 'org.postgresql.Driver',
  url: 'jdbc:postgresql://postgres:5432/pgdb',
  username: 'pguser',
  password: 'pgpass'
})
```

## Contributing

* open issues for bugs or whatever
* fork repo, make change, start pull request

## License

MIT
