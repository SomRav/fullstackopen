const { test, after, describe, beforeEach } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const assert = require("node:assert");
const Blog = require("../models/blog");
const testHelper = require("./test_helper");
const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});

  // const blogObjects = testHelper.initialBlogs.map((blog) => new Blog(blog));
  // const promiseArray = blogObjects.map((blog) => blog.save());
  // await Promise.all(promiseArray);

  await Blog.insertMany(testHelper.initialBlogs);
});

describe("when there is initially some blogs saved", () => {
  test("blogs are return as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all blogs are returned", async () => {
    const blogs = await testHelper.blogsInDb();

    assert.strictEqual(blogs.length, testHelper.initialBlogs.length);
  });

  test("a specific blog within the returned blogs", async () => {
    const blogs = await testHelper.blogsInDb();

    const titles = blogs.map((blog) => blog.title);
    // const index = Math.round(Math.random());
    assert(titles.includes("Exploring the Depths of Node.js"));
  });

  test("if id property exist in all blogs", async () => {
    const blogs = await testHelper.blogsInDb();

    assert(blogs.every((blog) => "id" in blog));
  });

  describe("viewing a specific blog", () => {
    test("succeeds with a valid id", async () => {
      const blogsAtStart = await testHelper.blogsInDb();
      const blogToView = await blogsAtStart[0];

      const resultBlog = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      assert.deepStrictEqual(resultBlog.body, blogToView);
    });

    test("fails with statuscode 404 if blog does not exist", async () => {
      const validNonexistingId = await testHelper.nonExistingId();

      await api.get(`/api/blogs/${validNonexistingId}`).expect(404);
    });

    test("fails with statuscode 400 id is invalid", async () => {
      const invalidId = "5a3d5da59070081a82a3445";

      await api.get(`/api/blogs/${invalidId}`).expect(400);
    });
  });

  describe("addition of a new blog", () => {
    test("a valid blog can be posted successfully", async () => {
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
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const blogs = await testHelper.blogsInDb();
      const titles = blogs.map((blog) => blog.title);

      assert.strictEqual(titles.length, blogsAtStart.length + 1);
      assert(titles.includes("Type wars"));
    });

    test("a blog without likes property can be posted successlly. The likes defaluts to zero(0))", async () => {
      const newBlog = {
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
      };

      const blogsAtStart = await testHelper.blogsInDb();

      await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const blogs = await testHelper.blogsInDb();

      assert.strictEqual(blogs.length, blogsAtStart.length + 1);

      assert(blogs.every((blog) => "likes" in blog));

      const addedBlog = blogs.find((blog) => blog.title === newBlog.title);
      assert.strictEqual(addedBlog.likes, 0);
    });

    test("posting a blog with no attribute i.e {} should result in 400", async () => {
      const blogWithMissingAll = {};

      const blogsAtStart = await testHelper.blogsInDb();

      await api
        .post("/api/blogs")
        .send(blogWithMissingAll)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const blogs = await testHelper.blogsInDb();
      assert.strictEqual(blogs.length, blogsAtStart.length);

      assert.deepStrictEqual(blogs, blogsAtStart);
    });

    test("posting a blog with missing title attribute should result in 400", async () => {
      const blogWithMissingTitle = {
        author: "test-user",
        url: "www.test-url.test",
      };

      const blogsAtStart = await testHelper.blogsInDb();

      await api
        .post("/api/blogs")
        .send(blogWithMissingTitle)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const blogs = await testHelper.blogsInDb();
      assert.strictEqual(blogs.length, blogsAtStart.length);

      assert.deepStrictEqual(blogs, blogsAtStart);
    });

    test("posting a blog with missing url attribute should result in 400", async () => {
      const blogWithMissingURL = {
        title: "test-title",
        author: "test-user",
      };

      const blogsAtStart = await testHelper.blogsInDb();

      await api
        .post("/api/blogs")
        .send(blogWithMissingURL)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const blogs = await testHelper.blogsInDb();
      assert.strictEqual(blogs.length, blogsAtStart.length);

      assert.deepStrictEqual(blogs, blogsAtStart);
    });

    test("posting a blog with missing author attribute should result in 400", async () => {
      const blogWithMissingAuthor = {
        title: "test-title",
        url: "www.test-url.test",
      };

      const blogsAtStart = await testHelper.blogsInDb();

      await api
        .post("/api/blogs")
        .send(blogWithMissingAuthor)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const blogs = await testHelper.blogsInDb();
      assert.strictEqual(blogs.length, blogsAtStart.length);

      assert.deepStrictEqual(blogs, blogsAtStart);
    });
  });

  describe("deletion of a blog", () => {
    test("succeeds with status code 204 if id is valid and blog is deleted", async () => {
      const blogsAtStart = await testHelper.blogsInDb();
      const blogToDelete = blogsAtStart[0];

      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

      const blogsAtEnd = await testHelper.blogsInDb();

      const titles = blogsAtEnd.map((blog) => blog.title);
      assert(!titles.includes(blogToDelete.title));

      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1);
    });

    test("fails with statuscode 404 if blog does not exist", async () => {
      const validNonexistingId = await testHelper.nonExistingId();

      const blogsAtStart = await testHelper.blogsInDb();

      await api.delete(`/api/blogs/${validNonexistingId}`).expect(404);

      const blogsAtEnd = await testHelper.blogsInDb();

      assert.deepStrictEqual(blogsAtEnd, blogsAtStart);
    });

    test("fails with statuscode 400 id is invalid", async () => {
      const invalidId = "5a3d5da59070081a82a3445";

      const blogsAtStart = await testHelper.blogsInDb();

      await api.delete(`/api/blogs/${invalidId}`).expect(400);

      const blogsAtEnd = await testHelper.blogsInDb();

      assert.deepStrictEqual(blogsAtEnd, blogsAtStart);
    });
  });
  describe("updating a blog", () => {
    test("succeeds with status code 200 if id is valid and blog is updated", async () => {
      const blogsAtStart = await testHelper.blogsInDb();
      const blogToBeUpdated = blogsAtStart[0];

      const newBlog = {
        title: "updated-title",
        author: "updated-author",
        url: "updated-url",
        likes: 999,
      };

      await api
        .put(`/api/blogs/${blogToBeUpdated.id}`)
        .send(newBlog)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      const blogsAtEnd = await testHelper.blogsInDb();

      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length);

      const response = await api.get(`/api/blogs/${blogToBeUpdated.id}`);
      const { id, ...rest } = response.body;
      assert.strictEqual(id, blogToBeUpdated.id);
      assert.deepStrictEqual(rest, newBlog);
    });
    test("fails with statuscode 404 if blog does not exist", async () => {
      const validNonexistingId = await testHelper.nonExistingId();

      const blogsAtStart = await testHelper.blogsInDb();

      await api.put(`/api/blogs/${validNonexistingId}`).expect(404);

      const blogsAtEnd = await testHelper.blogsInDb();

      assert.deepStrictEqual(blogsAtEnd, blogsAtStart);
    });

    test("fails with statuscode 400 id is invalid", async () => {
      const invalidId = "5a3d5da59070081a82a3445";

      const blogsAtStart = await testHelper.blogsInDb();

      await api.put(`/api/blogs/${invalidId}`).expect(400);

      const blogsAtEnd = await testHelper.blogsInDb();

      assert.deepStrictEqual(blogsAtEnd, blogsAtStart);
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});
