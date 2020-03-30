const { User } = require("../../models/user");
const { Dream } = require("../../models/dream");
const { Keyword } = require("../../models/keyword");
const request = require("supertest");

describe("Auth middleware", () => {
  beforeEach(() => {
    server = require("../../server");
  });
  afterEach(async () => {
    await Dream.deleteMany({});
    await Keyword.deleteMany({});
    await User.deleteMany({});
    await server.close();
  });

  let token;

  const exec = () => {
    return request(server)
      .post("/api/dreams")
      .set("uDream-auth-token", token)
      .send({
        title: "Test",
        note: 5,
        description: "Dream description",
        keywords: ["keyword1", "keyword2"]
      });
  };

  const registerUser = () => {
    return request(server)
      .post("/api/users")
      .send({
        username: "Tester",
        firstname: "Tester",
        lastname: "Tester",
        email: "test@test.com",
        password: "passwordTest"
      });
  };

  const getToken = () => {
    return request(server)
      .post("/api/auth")
      .send({
        email: "test@test.com",
        password: "passwordTest"
      });
  };

  beforeEach(async () => {
    await registerUser();
    user = await User.findOne({ username: "Tester" });
    const { res } = await getToken();
    token = res.text;
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
