# The NodeJS Study Project

### ■ Installation

- [![Sources](https://img.shields.io/badge/참고-express-yellow)](https://github.com/mincloud1501/NodeJS/tree/master/node_modules/express) : [Node.js](https://nodejs.org/en/) module available through the [npm registry](https://www.npmjs.com/)
- [![Sources](https://img.shields.io/badge/참고-morgan-yellow)](https://github.com/mincloud1501/NodeJS/tree/master/node_modules/morgan) : HTTP request logger middleware for node.js
- [![Sources](https://img.shields.io/badge/참고-mocha-yellow)](https://github.com/mincloud1501/NodeJS/tree/master/node_modules/mocha) : Mocha is a feature-rich JavaScript test framework running on Node.js and in the browser
- [![Sources](https://img.shields.io/badge/참고-should-yellow)](https://github.com/mincloud1501/NodeJS/tree/master/node_modules/should) : should is an expressive, readable, framework-agnostic assertion library
- [![Sources](https://img.shields.io/badge/참고-supertest-yellow)](https://github.com/mincloud1501/NodeJS/tree/master/node_modules/supertest) : SuperAgent driven library for testing HTTP servers, TDD(Test-Driven Developement) 지향

```bash
$ npm install express
$ npm install morgan
$ npm i mocha --save-dev # devDependencies 설정
$ npm i should --save-dev
$ npm i supertest --save-dev
```

#### ★ TTD (Test Driven Development)
- test를 먼저 만들고 test를 통과하기 위한 것을 coding하는 것 즉, 만드는 과정에서 우선 test를 작성하고 그걸 통과하는 code를 만들고를 반복하면서 제대로 동작하는지에 대한 feedback을 적극적으로 받는 것
- decision과 feedback 사이의 gap에 대한 인식, gap을 조절하기 위한 기술
- TDD는 프로그래밍 기법이나 기술적인 느낌보다는 심리적인 것으로 볼 수 있다.

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

### ■ API Server 개발 (with TDD)

#### ☞ GET /users

```js
app.get('/users', (req, res) => {
    req.query.limit = req.query.limit || 10
    const limit = parseInt(req.query.limit, 10)

    if(Number.isNaN(limit)) {
        res.status(400).end()
        
    } else {
        res.json(users.slice(0, limit))
    }    
})
```

#### ☞ GET /users/:id

```js
app.get('/users/:id', (req, res) => {
    const id = parseInt(req.params.id, 10)
    const user = users.filter(user => user.id === id)[0]

    if(Number.isNaN(id)) {
        return res.status(400).end()
    }

    if(!user) {
        return res.status(404).end()
    }
    
    res.json(user)
})
```

#### ☞ DELETE /users/:id

```js
app.delete('/users/:id', (req, res) => {
    const id = parseInt(req.params.id, 10)
    const user = users.filter(user => user.id === id)[0]
    users = users.filter(user => user.id !== id)

    if(Number.isNaN(id)) {
        return res.status(400).end()
    }
    if(!user) {
        return res.status(404).end()
    }
    res.status(204).end()
})
```

#### ☞ POST /users

- express는 body기능 미지원, body-parser 미들웨어 추가 필요

```bash
$ npm i body-parser --save
```

```js
const bodyParser = require('body-parser')
…
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
…
app.post('/users', (req, res) => {
    const name = req.body.name

    if(!name) {
        return res.status(400).end()
    }
    const found = users.filter(user => user.name === name).length
    if(found) {
        return res.status(409).end()
    }
    const id = Date.now()
    const user = {id, name}
    users.push(user)
    res.status(201).json(user)
})
```

#### ☞ Refactoring

- user object 분리, express.Router 추가

- What is Refactoring?
	- 외부 동작을 바꾸지 않으면서 내부 구조를 개선하는 방법
	- 코드가 작성된 후에 디자인을 개선하는 작업
	- 모든 것을 미리 생각하기보다는 개발을 하면서 지속적으로 좋은 디자인을 찾는다.
	- 메소드 내의 지역변수와 parameter를 주의 깊게 볼 필요가 있다.
	- 값이 수정되지 않는 변수는 파라미터로 넘길 수 있다.
	- 값이 수정되는 변수는 주의가 필요하다. 변화되는 부분을 함수로 추출하여 리턴 값으로 돌려줄 수 있다.

- ./api/user/index.js

```js
const express = require('express')
const router = express.Router()
const controller = require('./user.controller')
…
router.get('/', controller.getAllList) // Controller Biding
router.get('/:id', controller.getList)
router.delete('/:id', controller.delUser)
router.post('/', controller.postUser)

module.exports = router
```

- ./api/user/index.js

```js
…
module.exports = {
    getAllList,
    getList,
    delUser,
    postUser
}
```

#### ☞ Test Result

```bash
$ npm t

> nodejs-api-server@1.0.0 test D:\NodeJS
> mocha ./index.spec.js

  GET /users
    Success...
GET /users/1 200 3.401 ms - 21
GET /users 200 0.477 ms - 67
      √ return array...
GET /users?limit=2 200 0.360 ms - 45
      √ Number of maximum limits as well as response...
    Failure...
GET /users?limit=one 400 0.179 ms - -
      √ If limit is not Integer, return 400 code

  GET /users/:id
    Failure...
GET /users/one 400 0.078 ms - -
      √ id is not number
GET /users/9 404 0.099 ms - -
      √ not found id

  DELETE /users/:id
    Success...
DELETE /users/3 204 0.235 ms - -
      √ response 204
    Failure...
DELETE /users/one 400 0.093 ms - -
      √ id is not number
DELETE /users/9 404 0.112 ms - -
      √ not found id

  POST /users
    Success...Create Object
POST /users 201 0.379 ms - 33
      √ response 202 (51ms)
    Failure...
POST /users 400 0.052 ms - -
      √ name is not
POST /users 409 0.100 ms - -
      √ name is duplicated

  11 passing (366ms)
```