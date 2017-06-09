/// <reference path="../typings/index.d.ts" />
const should = require('should');
import {Todo} from '../models/todo';
import * as supertest from 'supertest';
const app = require('../www');
const agent = supertest.agent(app);

describe('Todo Route', () => {
    let itemId: string = '';
    before((done: MochaDone) => {
        /*
        * This is just some general DB setup
        * */
        Todo.create({
            title: 'Item 1',
            done: false
        },{
            title: 'Item 2',
            done: false
        },{
            title: 'Item 3',
            done: true
        }, (err: any, items: any) => {
            if (err) return done(err);
            Todo.findOne({done: true}, (err: any, item: any) => {
                itemId = item._id;
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
                    result.body.title.should.not.be.undefined();
                    result.body.title.should.equal('Item 3');
                    result.body.done.should.not.be.undefined();
                    result.body.done.should.equal(true);
                    done();
                });
        });
    });

    describe('Sad path', () => {
        it('Returns not found when item missing', (done: MochaDone) => {
            agent.get('/api/todo/notfound')
                .expect(404, done);
        });
    });

    after((done: MochaDone) =>{
        Todo.remove().exec((err: any) => {
            if (err) return done(err);
            done();
        });
    });
});