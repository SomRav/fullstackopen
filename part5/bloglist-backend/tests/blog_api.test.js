const { test, describe, beforeEach, after } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const assert = require("node:assert");

const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");
const User = require("../models/user");
const testHelper = require("./test_helper");

let headers;

beforeEach(async () => {
  await User.deleteMany({});
  await Blog.deleteMany({});

  const newUser = {
    username: "root",
    name: "root",
    password: "password",
  };

  await api.post("/api/users").send(newUser);
  const loginResponse = await api.post("/api/login").send(newUser);

  headers = {
    Authorization: `Bearer ${loginResponse.body.token}`,
  };

  await Blog.insertMany(testHelper.initialBlogs);
});

describe("when there are initially some blogs", () => {
  test("blogs are returned as JSON", async () => {
    await api
      .get("/api/blogs")
      .set(headers)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all blogs are returned", async () => {
    const response = await api.get("/api/blogs").set(headers);
    assert.strictEqual(response.body.length, testHelper.initialBlogs.length);
  });

  test("a specific blog is within the returned blogs", async () => {
    const response = await api.get("/api/blogs").set(headers);
    const titles = response.body.map((blog) => blog.title);
    assert(titles.includes("Exploring the Depths of Node.js"));
  });

  test("each blog has an id property", async () => {
    const response = await api.get("/api/blogs").set(headers);
    assert(response.body.every((blog) => "id" in blog));
  });

  describe("adding a new blog", () => {
    test("a valid blog can be added", async () => {
      const newBlog = {
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2,
      };

      const blogsAtStart = await testHelper.blogsInDb();

      await api
        .post("/api/blogs")
        .send(newBlog)
        .set(headers)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const blogsAtEnd = await testHelper.blogsInDb();
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1);

      const titles = blogsAtEnd.map((b) => b.title);
      assert(titles.includes(newBlog.title));
    });

    test("likes default to 0 if missing", async () => {
      const newBlog = {
        title: "No likes yet",
        author: "Anon",
        url: "http://nolikes.com",
      };

      await api.post("/api/blogs").send(newBlog).set(headers).expect(201);

      const blogs = await testHelper.blogsInDb();
      const addedBlog = blogs.find((b) => b.title === newBlog.title);
      assert.strictEqual(addedBlog.likes, 0);
    });

    test("blog without title/url/author is rejected with 400", async () => {
      const invalidBlogs = [
        {},
        { author: "test", url: "http://url.com" },
        { title: "Missing URL", author: "test" },
        { title: "Missing Author", url: "http://url.com" },
      ];

      for (const blog of invalidBlogs) {
        await api.post("/api/blogs").send(blog).set(headers).expect(400);
      }

      const blogsAfter = await testHelper.blogsInDb();
      assert.strictEqual(blogsAfter.length, testHelper.initialBlogs.length);
    });
  });

  describe("deleting a blog", () => {
    test("succeeds with status 204 for valid id", async () => {
      const newBlog = {
        title: "To be deleted",
        author: "Del Author",
        url: "http://delete.com",
        likes: 0,
      };

      await api.post("/api/blogs").send(newBlog).set(headers).expect(201);
      const blogs = await testHelper.blogsInDb();
      const blogToDelete = blogs.find((b) => b.title === newBlog.title);

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set(headers)
        .expect(204);

      const blogsAfter = await testHelper.blogsInDb();
      const titles = blogsAfter.map((b) => b.title);
      assert(!titles.includes(newBlog.title));
    });

    test("fails with 404 if blog does not exist", async () => {
      const id = await testHelper.nonExistingId();
      await api.delete(`/api/blogs/${id}`).set(headers).expect(404);
    });

    test("fails with 400 if id is invalid", async () => {
      await api.delete("/api/blogs/invalid-id").set(headers).expect(400);
    });
  });

  describe("updating a blog", () => {
    test("succeeds with valid data", async () => {
      //Create a new blog under the authenticated user
      const mine = {
        title: "Mine to Update",
        author: "Test Author",
        url: "http://mine/update",
        likes: 0,
      };

      const createRes = await api
        .post("/api/blogs")
        .set(headers)
        .send(mine)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const created = createRes.body;

      //  Prepare updated data
      const updatedData = {
        title: "Updated Title",
        author: created.author,
        url: created.url,
        likes: created.likes + 5,
      };

      //  Perform the update on the blog we just created
      const updateRes = await api
        .put(`/api/blogs/${created.id}`)
        .set(headers)
        .send(updatedData)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      // 4) Assert that the response reflects the update
      assert.strictEqual(updateRes.body.likes, updatedData.likes);
      assert.strictEqual(updateRes.body.title, updatedData.title);
    });

    test("fails with 404 for non-existent blog", async () => {
      const id = await testHelper.nonExistingId();
      await api
        .put(`/api/blogs/${id}`)
        .set(headers)
        .send({ likes: 100 })
        .expect(404);
    });

    test("fails with 400 for invalid id", async () => {
      await api
        .put("/api/blogs/invalid-id")
        .set(headers)
        .send({ likes: 100 })
        .expect(400);
    });
  });
});
after(async () => {
  await mongoose.connection.close();
});
