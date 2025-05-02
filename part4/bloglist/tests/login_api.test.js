const { test, describe, beforeEach, after } = require("node:test");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const supertest = require("supertest");
const assert = require("node:assert");

const app = require("../app");
const api = supertest(app);
const User = require("../models/user");

describe("user login", () => {
  beforeEach(async () => {
    // Reset users
    await User.deleteMany({});

    // Create a known user with password 'sekret'
    const passwordHash = await bcrypt.hash("sekret", 10);
    const user = new User({
      username: "testuser",
      name: "Test User",
      passwordHash,
    });
    await user.save();
  });

  test("succeeds with valid credentials", async () => {
    const credentials = {
      username: "testuser",
      password: "sekret",
    };

    const response = await api
      .post("/api/login")
      .send(credentials)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    // Response should include token, username, and name
    assert.ok(response.body.token, "token missing");
    assert.strictEqual(response.body.username, "testuser");
    assert.strictEqual(response.body.name, "Test User");
  });

  test("fails with status 401 and error message when password is wrong", async () => {
    const credentials = {
      username: "testuser",
      password: "wrongpassword",
    };

    const response = await api
      .post("/api/login")
      .send(credentials)
      .expect(401)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(response.body.error, "invalid username or password");
  });

  test("fails with status 401 and error message when username does not exist", async () => {
    const credentials = {
      username: "nonexistent",
      password: "sekret",
    };

    const response = await api
      .post("/api/login")
      .send(credentials)
      .expect(401)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(response.body.error, "invalid username or password");
  });
});

after(async () => {
  await mongoose.connection.close();
});
