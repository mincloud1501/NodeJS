const assert = require('assert')
const should = require('should')
const request = require('supertest')
const app = require('./index.js')

describe ('GET /users', () => {
    it('return array...', (done) => {
        // test assert
        // assert.equal(1,1) 

        // test should
        // (1).should.equal(1)

        // test super test
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