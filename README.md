# The NodeJS Study Project

### ■ Installation

- [![Sources](https://img.shields.io/badge/참고-express-yellow)](https://github.com/mincloud1501/Python/blob/master/NodeJS/node_modules/express/Readme.md) : [Node.js](https://nodejs.org/en/) module available through the [npm registry](https://www.npmjs.com/)
- [![Sources](https://img.shields.io/badge/참고-morgan-yellow)](https://github.com/mincloud1501/Python/blob/master/NodeJS/node_modules/morgan/README.md) : HTTP request logger middleware for node.js
- [![Sources](https://img.shields.io/badge/참고-mocha-yellow)](https://github.com/mincloud1501/Python/blob/master/NodeJS/node_modules/mocha/README.md) : Mocha is a feature-rich JavaScript test framework running on Node.js and in the browser
- [![Sources](https://img.shields.io/badge/참고-should-yellow)](https://github.com/mincloud1501/Python/blob/master/NodeJS/node_modules/should/Readme.md) : should is an expressive, readable, framework-agnostic assertion library
- [![Sources](https://img.shields.io/badge/참고-supertest-yellow)](https://github.com/mincloud1501/Python/blob/master/NodeJS/node_modules/supertest/README.md) : SuperAgent driven library for testing HTTP servers, TDD(Test-Driven-Developement) 지향


```bash
$ npm install express
$ npm install morgan
$ npm i mocha --save-dev # devDependencies 설정
$ npm i should --save-dev
$ npm i supertest --save-dev
```

### ■ Initialize

```bash
$ npm init

package name: (nodejs) nodejs-api-server
version: (1.0.0)
description:
entry point: (index.js)
test command:
git repository: (https://github.com/mincloud1501/NodeJS.git)
keywords:
author: mincloud
license: (ISC)
Is this ok? (yes) y
```

- mocha framework 사용을 test를 위한 script (index.spec.js) 작성

```js
const assert = require('assert')
const should = require('should')
const request = require('supertest')
const app = require('./index.js')

describe ('GET /users', () => {
    it('return array...', (done) => {
        // assert.equal(1,1) 
        // (1).should.equal(1)
        request(app)
            .get('/users')
            .end((err, res) => {
                res.body.should.be.instanceof(Array)
                res.body.forEach(user => {
                    user.should.have.property('name')
                })
                done()
            })
    })
})
```

- npm package.json 생성 확인 및 start/test script 추가

```bash
{
  "name": "nodejs-api-server",
  "version": "1.0.0",
  "description": "nodejs-api-server",
  "main": "index.js",
  "dependencies": {
    "express": "^4.17.1",
    "morgan": "^1.9.1"
  },
  "devDependencies": {
    "mocha": "^6.2.2"
  },
  "scripts": {
    "start": "node ./index.js",
    "test": "mocha ./index.spec.js"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/mincloud1501/NodeJS.git"
  },
  "author": "mincloud",
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/mincloud1501/NodeJS/issues"
  },
  "homepage": "https://github.com/mincloud1501/NodeJS#readme"
}
```

```bash
$ npm start

> nodejs-api-server@1.0.0 start D:\NodeJS
> node ./index.js

Server running at http://127.0.0.1:3000/
```

- test 환경 구축

```bash
$ npm t # test should

> nodejs-api-server@1.0.0 test D:\NodeJS
> mocha ./index.spec.js

  GET /users
    √ return array...

  1 passing (9ms)

$ npm t # test supertest

> nodejs-api-server@1.0.0 test D:\NodeJS
> mocha ./index.spec.js

  GET /users
  GET /users 200 3.203 ms - 31
    √ return array... (181ms)

  1 passing (198ms)
```
