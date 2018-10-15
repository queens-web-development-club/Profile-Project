const app = require('../index.js')
const request = require('supertest')

// Testing the main route
describe("Server:", () => {
    describe("GET /", () => {
        test("checks status is OK", (done) => {
            request(app)
                .get("/")
                .expect(200)
                .end(done);
        });
        afterAll( (done) => {
            app.close(done);
        })
    });
});