// const { test, describe, after, beforeEach } = require("node:test");
// const User = require("../models/user");
// const bcrypt = require("bcrypt");
// const mongoose = require("mongoose");
// const assert = require("node:assert");
// const helper = require("./test_helper");

// const supertest = require("supertest");
// const app = require("../app");
// const api = supertest(app);

// describe("when there is initially one user in db", () => {
//   beforeEach(async () => {
//     await User.deleteMany({});

//     const passwordHash = await bcrypt.hash("sekret", 10);
//     const user = new User({ username: "root", name: "RootUser", passwordHash });

//     await user.save();
//   });
//   test("creation succeeds with a valid fresh username", async () => {
//     const usersAtStart = await helper.usersInDb();

//     const newUser = {
//       username: "mluukkai",
//       name: "Matti Luukkainen",
//       password: "salainen",
//     };

//     await api
//       .post("/api/users")
//       .send(newUser)
//       .expect(201)
//       .expect("Content-Type", /application\/json/);

//     const usersAtEnd = await helper.usersInDb();
//     assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

//     const usernames = usersAtEnd.map((u) => u.username);
//     assert(usernames.includes(newUser.username));
//   });
//   test("creation fails with proper statuscode and message if username already taken", async () => {
//     const usersAtStart = await helper.usersInDb();

//     const newUser = {
//       username: "root",
//       name: "Superuser",
//       password: "salainen",
//     };

//     const result = await api
//       .post("/api/users")
//       .send(newUser)
//       .expect(400)
//       .expect("Content-Type", /application\/json/);

//     const usersAtEnd = await helper.usersInDb();

//     assert(result.body.error.includes("expected `username` to be unique"));
//     assert.deepStrictEqual(usersAtEnd, usersAtStart);
//   });
//   test("creation fails if password is too short", async () => {
//     const usersAtStart = await helper.usersInDb();

//     const newUser = {
//       username: "validname",
//       name: "Short Password",
//       password: "12", // too short
//     };

//     const result = await api
//       .post("/api/users")
//       .send(newUser)
//       .expect(400)
//       .expect("Content-Type", /application\/json/);

//     assert(
//       result.body.error.includes(
//         "password is shorter than the minimum allowed length"
//       )
//     );

//     const usersAtEnd = await helper.usersInDb();
//     assert.deepStrictEqual(usersAtEnd, usersAtStart);
//   });

//   test("creation fails if username is too short", async () => {
//     const usersAtStart = await helper.usersInDb();

//     const newUser = {
//       username: "ab", // too short
//       name: "Short Username",
//       password: "validpassword",
//     };

//     const result = await api
//       .post("/api/users")
//       .send(newUser)
//       .expect(400)
//       .expect("Content-Type", /application\/json/);

//     assert(
//       result.body.error.includes(
//         "username is shorter than the minimum allowed length"
//       )
//     );

//     const usersAtEnd = await helper.usersInDb();
//     assert.deepStrictEqual(usersAtEnd, usersAtStart);
//   });

//   test("creation fails if both username and password are too short", async () => {
//     const usersAtStart = await helper.usersInDb();

//     const newUser = {
//       username: "ab",
//       name: "Too Short Both",
//       password: "12",
//     };

//     const result = await api
//       .post("/api/users")
//       .send(newUser)
//       .expect(400)
//       .expect("Content-Type", /application\/json/);

//     assert(
//       result.body.error.includes(
//         "username and password are shorter than the minimum allowed length"
//       )
//     );

//     const usersAtEnd = await helper.usersInDb();
//     assert.deepStrictEqual(usersAtEnd, usersAtStart);
//   });
// });

// after(async () => {
//   await mongoose.connection.close();
// });
