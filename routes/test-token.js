const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

// OpenAPI path specification for /token
const testTokenPathSpec = {
  post: {
    tags: ["Test Token"],
    summary: "Generate a test JWT token with username and password",
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              username: { type: "string" },
              password: { type: "string" },
            },
            required: ["username", "password"],
          },
        },
      },
    },
    responses: {
      200: {
        description: "JWT token generated",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                token: { type: "string" },
              },
            },
          },
        },
      },
      400: {
        description: "Missing username or password",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                error: { type: "string" },
              },
            },
          },
        },
      },
    },
  },
};

// Test token generation endpoint
router.post("/token", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required." });
  }
  const payload = {
    user: username,
    password: password,
    role: "tester",
    issuedAt: Date.now(),
  };
  // Use a test secret for demonstration
  const token = jwt.sign(payload, "test_secret", { expiresIn: "1h" });
  res.json({ token });
});

module.exports = { router, testTokenPathSpec };
