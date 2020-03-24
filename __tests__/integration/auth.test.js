const { User } = require("../../models/user");
const { Dream } = require("../../models/dream");
const request = require("supertest");

describe("Auth middleware", () => {
  beforeEach(() => {
    server = require("../../server");
  });
  afterEach(async () => {
    await Dream.deleteMany({});
    await server.close();
  });

  let token;

  const exec = () => {
    return request(server)
      .post("/api/dreams")
      .set("uDream-auth-token", token)
      .send({
        note: 10,
        description: "Dream description",
        author: "AuthorId",
        tags: ["tag1", "tag2"]
      });
  };

  beforeEach(() => {
    token = new User().generateAuthToken();
  });

  it("should return 401 if no token is provided", async () => {
    token = "";
    const res = await exec();
    expect(res.status).toBe(401);
  });

  it("should return 400 if token is invalid", async () => {
    token = "invalidToken";
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 200 if token is valid", async () => {
    const res = await exec();
    expect(res.status).toBe(200);
  });
});
