const express = require("express");
const path = require("node:path");

function createApp() {
  const app = express();
  const messages = [];

  app.use(express.json());
  app.use(express.static(path.join(__dirname, "..", "public")));

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/messages", (_req, res) => {
    res.json({ messages });
  });

  app.post("/api/messages", (req, res) => {
    const text = typeof req.body.text === "string" ? req.body.text.trim() : "";

    if (!text) {
      return res.status(400).json({ error: "Message cannot be empty." });
    }
    if (text.length > 280) {
      return res.status(400).json({ error: "Message must be 280 characters or fewer." });
    }

    const message = {
      id: messages.length + 1,
      text,
      createdAt: new Date().toISOString()
    };
    messages.push(message);
    return res.status(201).json({ message });
  });

  return app;
}

module.exports = { createApp };
