const { User } = require("../../models/user");
const { Dream } = require("../../models/dream");
const { Keyword } = require("../../models/keyword");
const request = require("supertest");

describe("keywords", () => {
  beforeEach(() => {
    server = require("../../server");
  });
  afterEach(async () => {
    await User.deleteMany({});
    await Dream.deleteMany({});
    await Keyword.deleteMany({});
    await server.close();
  });

  let dream;
  let token;
  let user;
  let keywords;

  const postDream = () => {
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
    const { res } = await getToken();
    token = res.text;

    dream = {
      title: "Test",
      note: 5,
      description: "This is a dream description",
      keywords: ["Keyword1", "Keyword2"]
    };
  });

  it("should add dream keywords to keywords table", async () => {
    await postDream();
    keywords = await Keyword.find();
    expect(keywords).toHaveLength(2);
  });

  it("should increment frequency if keywords already exists", async () => {
    await postDream();
    keywords = await Keyword.find();
    expect(keywords).toHaveLength(2);
    expect(keywords[0].frequency).toBe(1);

    await postDream();
    keywords = await Keyword.find();
    expect(keywords[0].frequency).toBe(2);
  });

  it("should add dream keywords to user's keywords list", async () => {
    await postDream();
    user = await User.findOne({ username: "Tester" });
    expect(user.keywords).toHaveLength(2);
  });

  it("should increment user's keyword frequency if it's already exist", async () => {
    await postDream();
    user = await User.findOne({ username: "Tester" });
    expect(user.keywords[0].frequency).toBe(1);

    await postDream();
    user = await User.findOne({ username: "Tester" });
    expect(user.keywords[0].frequency).toBe(2);
  });
});
