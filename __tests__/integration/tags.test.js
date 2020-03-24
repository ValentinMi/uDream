const { User } = require("../../models/user");
const { Dream } = require("../../models/dream");
const { Tag } = require("../../models/tag");
const request = require("supertest");

describe("tags", () => {
  beforeEach(() => {
    server = require("../../server");
  });
  afterEach(async () => {
    await User.deleteMany({});
    await Dream.deleteMany({});
    await Tag.deleteMany({});
    await server.close();
  });

  let dream;
  let token;
  let user;
  let tags;

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
      note: 5,
      description: "This is a dream description",
      tags: ["Tag1", "Tag2"]
    };
  });

  it("should add dream tags to tags table", async () => {
    await postDream();
    tags = await Tag.find();
    expect(tags).toHaveLength(2);
  });

  it("should increment frequency if tags already exists", async () => {
    await postDream();
    tags = await Tag.find();
    expect(tags).toHaveLength(2);
    expect(tags[0].frequency).toBe(1);

    await postDream();
    tags = await Tag.find();
    expect(tags[0].frequency).toBe(2);
  });

  it("should add dream tags to user's tags list", async () => {
    await postDream();
    user = await User.findOne({ username: "Tester" });
    expect(user.tags).toHaveLength(2);
  });

  it("should increment user's tag frequency if it's already exist", async () => {
    await postDream();
    user = await User.findOne({ username: "Tester" });
    expect(user.tags[0].frequency).toBe(1);

    await postDream();
    user = await User.findOne({ username: "Tester" });
    expect(user.tags[0].frequency).toBe(2);
  });
});
