const { Dream } = require("../../models/dream");
const { User } = require("../../models/user");
const { Keyword } = require("../../models/keyword");
const request = require("supertest");

describe("/dreams route", () => {
  beforeEach(() => {
    server = require("../../server");
  });
  afterEach(async () => {
    await Dream.deleteMany({});
    await Keyword.deleteMany({});
    await server.close();
  });

  let dream;
  let token;

  const exec = () => {
    return request(server)
      .post("/api/dreams")
      .set("uDream-auth-token", token)
      .send(dream);
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

    dream = {
      title: "Test",
      note: 5,
      description: "This is a dream description",
      keywords: ["Keyword1", "Keyword2"]
    };
  });

  it("should return 400 if dream is invalid", async () => {
    dream = "";
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 200 if dream is valid", async () => {
    const res = await exec();
    expect(res.status).toBe(200);
  });

  // Note

  it("should return 400 is note is missing", async () => {
    delete dream.note;
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 400 if note is NaN", async () => {
    dream.note = "";
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 400 if note < 0", async () => {
    dream.note = -1;
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 400 if note > 5", async () => {
    dream.note = 6;
    const res = await exec();
    expect(res.status).toBe(400);
  });

  // Description

  it("should return 400 if description is missing", async () => {
    delete dream.description;
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 400 if description is not a string", async () => {
    dream.description = 1;
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 400 if description > 3000 chars", async () => {
    dream.description = new Array(3001).fill("a").join("");
    const res = await exec();
    expect(res.status).toBe(400);
  });

  // Keywords

  it("should return 400 if keywords is not an array", async () => {
    dream.keywords = "";
    const res = await exec();
    expect(res.status).toBe(400);
  });
});
