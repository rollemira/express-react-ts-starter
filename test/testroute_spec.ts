const should = require("should");
import * as supertest from "supertest";
const app = require("../www");
const agent = supertest.agent(app);

describe("Test Route", () => {
   describe("Root", () => {
       it("Returns a title and data", (done: Function) => {
            agent.get("/api/test")
                .expect(200)
                .end((err: any, result: any) => {
                    if (err) return done(err);
                    //console.log(result);
                    result.body.should.not.be.undefined();
                    result.body.title.should.not.be.undefined();
                    result.body.title.should.equal("test route");
                    result.body.data.should.not.be.undefined();
                    result.body.data.length.should.equal(3);
                    done();
                });
       });
   });
});