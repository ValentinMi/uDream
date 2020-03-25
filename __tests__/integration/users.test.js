const { User } = require("../../models/user");
const request = require("supertest");

describe("/users route", () => {
  beforeEach(() => {
    server = require("../../server");
  });
  afterEach(async () => {
    await User.deleteMany({});
    await server.close();
  });

  let user;

  beforeEach(() => {
    user = {
      username: "Tester",
      firstname: "Tester",
      lastname: "Tester",
      email: "test@test.fr",
      password: "passwordTest"
    };
  });

  const exec = () => {
    return request(server)
      .post("/api/users")
      .send(user);
  };

  it("should return 400 if no user provided", async () => {
    user = "";
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 400 if at least one field miss", async () => {
    delete user.password;
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 400 if email is not a valid email", async () => {
    user.email = "unvalidEmail";
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 400 if password length < 8 chars", async () => {
    user.password = "123";
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 400 if fields > 255 chars", async () => {
    user = {
      username: new Array(257).fill("a").join(""),
      firstname: new Array(257).fill("a").join(""),
      lastname: new Array(257).fill("a").join(""),
      password: new Array(257).fill("a").join(""),
      email: "test@test.com"
    };
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 200 is user is valid", async () => {
    const res = await exec();
    expect(res.status).toBe(200);
  });
});
