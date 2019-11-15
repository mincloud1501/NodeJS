const assert = require('assert')
const should = require('should')
const request = require('supertest')
const app = require('./index.js')

describe ('GET /users', () => {
    describe('Success...', () => {
        it('return array...', (done) => {
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
        it('Number of maximum limits as well as response...', (done) => {
            request(app)
                .get('/users?limit=2')
                .end((err,res) => {
                    res.body.should.have.lengthOf(2)
                    done()
                })
        })
    })

    describe('Failure...', () => {
        it('If limit is not Integer, return 400 code', (done) => {
            request(app)
                .get('/users?limit=one')
                .expect(400)
                .end(done)
        })
    })
})
/////////////////////////////////////////////////////////////
describe('GET /users/:id', () => {
    describe('Success...', () => {
        request(app)
            .get('/users/1')
            .end((err,res) => {
                res.body.should.have.property('id',1)
            })
    })
    describe('Failure...', () => {
        it('id is not number', (done) => {
            request(app)
                .get('/users/one')
                .expect(400)
                .end(done)
        })
        it('not found id', (done) => {
            request(app)
                .get('/users/9')
                .expect(404)
                .end(done)
        })
    })
})
/////////////////////////////////////////////////////////////
describe('DELETE /users/:id', () => {
    describe('Success...', () => {
        it('response 204', done => {
            request(app)
            .delete('/users/3')
            .expect(204)
            .end(done)
        })
    })
    describe('Failure...', () => {
        it('id is not number', (done) => {
            request(app)
                .delete('/users/one')
                .expect(400)
                .end(done)
        })
        it('not found id', (done) => {
            request(app)
                .delete('/users/9')
                .expect(404)
                .end(done)
        })
    })
})
/////////////////////////////////////////////////////////////
describe('POST /users', () => {
    describe('Success...Create Object', () => {
        it('response 202', done => {
            request(app)
            .post('/users').send({name: 'ddd'})
            .expect(201)
            .end((err, res) => {
                res.body.should.have.property('name', 'ddd')
                done()
            })
        })
    })
    describe('Failure...', () => {
        it('name is not', (done) => {
            request(app)
                .post('/users').send({})
                .expect(400)
                .end(done)
        })
        it('name is duplicated', (done) => {
            request(app)
                .post('/users').send({name: 'aaa'})
                .expect(409)
                .end(done)
        })
    })
})