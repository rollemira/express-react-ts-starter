/// <reference path="../typings/index.d.ts" />
const should = require('should');
import {Todo} from '../models/todo';
import * as supertest from 'supertest';
const app = require('../www');
const agent = supertest.agent(app);

describe('Todo Route', () => {
    before((done: MochaDone) => {
        Todo.create({
            title: 'Item 1',
            done: false
        },{
            title: 'Item 2',
            done: false
        },{
            title: 'Item 3',
            done: true
        }, (err: any) => {
            if (err) return done(err);
            done();
        });
    });

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

    it('Filters by the done status');

    after((done: MochaDone) =>{
        Todo.remove().exec((err: any) => {
            if (err) return done(err);
            done();
        });
    });
});