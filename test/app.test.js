const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const { createApp } = require("../src/app");

test("health endpoint reports the app is running", async () => {
  const response = await request(createApp()).get("/api/health");
  assert.equal(response.status, 200);
  assert.deepEqual(response.body, { status: "ok" });
});

test("a valid message can be created and retrieved", async () => {
  const app = createApp();
  const created = await request(app).post("/api/messages").send({ text: "Hello DevOps" });
  assert.equal(created.status, 201);
  assert.equal(created.body.message.text, "Hello DevOps");

  const fetched = await request(app).get("/api/messages");
  assert.equal(fetched.status, 200);
  assert.equal(fetched.body.messages.length, 1);
  assert.equal(fetched.body.messages[0].text, "Hello DevOps");
});

test("empty messages are rejected", async () => {
  const response = await request(createApp()).post("/api/messages").send({ text: "   " });
  assert.equal(response.status, 400);
  assert.equal(response.body.error, "Message cannot be empty.");
});

test("messages over 280 characters are rejected", async () => {
  const response = await request(createApp()).post("/api/messages").send({ text: "x".repeat(281) });
  assert.equal(response.status, 400);
  assert.equal(response.body.error, "Message must be 280 characters or fewer.");
});
