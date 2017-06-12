/// <reference path="../typings/index.d.ts" />
const should = require('should');
import {Todo} from '../models/todo';
import * as supertest from 'supertest';
const app = require('../www');
const agent = supertest.agent(app);

describe('Todo Route', () => {
    let itemId: string = '';
    let delItemId: string = '';
    before((done: MochaDone) => {
        /*
         * This is just some general DB setup
         * */
        Todo.create({
            title: 'Item 1',
            done: false
        }, {
            title: 'Item 2',
            done: false
        }, {
            title: 'Item 3',
            done: true
        }, (err: any) => {
            if (err) return done(err);
        }).then(() => {
            Todo.find({}, (err: any, items: any) => {
                itemId = items[2]._id;
                delItemId = items[0]._id;
                done();
            });
        });
    });

    describe('Happy path', () => {
        it('Returns a list of items', (done: MochaDone) => {
            agent.get('/api/todo')
                .expect(200)
                .end((err: any, result: any) => {
                    if (err) return done(err);
                    result.body.should.not.be.undefined();
                    result.body.length.should.equal(3);
                    done();
                });
        });

        it('Filters by the done status', (done: MochaDone) => {
            agent.get('/api/todo?done=true')
                .expect(200)
                .end((err: any, result: any) => {
                    if (err) return done(err);
                    result.body.should.not.be.undefined();
                    result.body.length.should.equal(1);
                    result.body[0].done.should.equal(true);
                    done();
                });
        });

        it('Returns an item by ID', (done: MochaDone) => {
            agent.get('/api/todo/' + itemId)
                .expect(200)
                .end((err: any, result: any) => {
                    if (err) return done(err);
                    result.body.should.not.be.undefined();
                    result.body._id.should.not.be.undefined();
                    should.ok(result.body._id == itemId);
                    result.body.title.should.not.be.undefined();
                    result.body.title.should.equal('Item 3');
                    result.body.done.should.not.be.undefined();
                    result.body.done.should.equal(true);
                    done();
                });
        });

        it('Create a new item', (done: MochaDone) => {
            const data = {title: 'My new test todo'};
            agent.post('/api/todo')
                .send(data)
                .expect(201)
                .end((err: any, result: any) => {
                    if (err) return done(err);
                    result.body.should.not.be.undefined();
                    result.body._id.should.not.be.undefined();
                    result.body.title.should.not.be.undefined();
                    result.body.title.should.equal(data.title);
                    result.body.done.should.not.be.undefined();
                    result.body.done.should.equal(false);
                    done();
                });
        });

        it('Update an item', (done: MochaDone) => {
            const data = {title: 'My updated todo', done: true};
            agent.put('/api/todo/' + itemId)
                .send(data)
                .expect(200)
                .end((err: any, result: any) => {
                    if (err) return done(err);
                    result.body.should.not.be.undefined();
                    result.body._id.should.not.be.undefined();
                    should.ok(result.body._id == itemId);
                    result.body.title.should.not.be.undefined();
                    result.body.title.should.equal(data.title);
                    result.body.done.should.not.be.undefined();
                    result.body.done.should.equal(true);
                    done();
                });
        });

        it('Patch an item', (done: MochaDone) => {
            const data = {done: false};
            agent.patch('/api/todo/' + itemId)
                .send(data)
                .expect(200)
                .end((err: any, result: any) => {
                    if (err) return done(err);
                    result.body.should.not.be.undefined();
                    result.body._id.should.not.be.undefined();
                    should.ok(result.body._id == itemId);
                    result.body.title.should.not.be.undefined();
                    result.body.done.should.not.be.undefined();
                    result.body.done.should.equal(false);
                    done();
                });
        });

        it('Patch does not update Id', (done: MochaDone) => {
            const data = {_id: "hellothere", done: false};
            agent.patch('/api/todo/' + itemId)
                .send(data)
                .expect(200)
                .end((err: any, result: any) => {
                    if (err) return done(err);
                    result.body.should.not.be.undefined();
                    result.body._id.should.not.be.undefined();
                    should.ok(result.body._id == itemId);
                    result.body.title.should.not.be.undefined();
                    result.body.done.should.not.be.undefined();
                    result.body.done.should.equal(false);
                    done();
                });
        });

        it('Delete an item', (done: MochaDone) => {
            agent.delete('/api/todo/' + delItemId)
                .expect(204, done);
        });
    });

    describe('Sad path', () => {
        it('Returns not found when item missing', (done: MochaDone) => {
            agent.get('/api/todo/notfound')
                .expect(404, done);
        });

        it('Does not create a new item without a title', (done: MochaDone) => {
            const data = {title: null};
            agent.post('/api/todo')
                .send(data)
                .expect(400)
                .end((err: any, result: any) => {
                    if (err) return done(err);
                    result.body.should.not.be.undefined();
                    result.body.error.should.not.be.undefined();
                    result.body.error.should.equal('ValidationError');
                    result.body.message.should.not.be.undefined();
                    result.body.errors.should.not.be.undefined();
                    result.body.errors.length.should.equal(1);
                    done();
                });
        });

        it('Does not update an item without a title', (done: MochaDone) => {
            const data = {title: null, done: true};
            agent.put('/api/todo/' + itemId)
                .send(data)
                .expect(400)
                .end((err: any, result: any) => {
                    if (err) return done(err);
                    result.body.should.not.be.undefined();
                    result.body.error.should.not.be.undefined();
                    result.body.error.should.equal('ValidationError');
                    result.body.message.should.not.be.undefined();
                    result.body.errors.should.not.be.undefined();
                    result.body.errors.length.should.equal(1);
                    done();
                });
        });
    });

    after((done: MochaDone) => {
        Todo.remove().exec((err: any) => {
            if (err) return done(err);
            done();
        });
    });
});