const express = require("express");
const router = express.Router();
const openapi = require("@wesleytodd/openapi");

// Define OpenAPI specifications for this router
const basicTestPathSpec = {
  "/simple": {
    get: {
      tags: ["Basic Tests"],
      summary: "Simple OK response",
      description: "Returns a simple 200 OK response",
      operationId: "getSimple",
      responses: {
        200: {
          description: "Successful response",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string" },
                  timestamp: { type: "string", format: "date-time" },
                },
              },
            },
          },
        },
      },
    },
  },
  "/delay/{ms}": {
    get: {
      tags: ["Basic Tests"],
      summary: "Delayed response",
      description: "Simulates a slow response by delaying for specified milliseconds",
      operationId: "getDelay",
      parameters: [
        {
          name: "ms",
          in: "path",
          description: "Delay in milliseconds",
          required: true,
          schema: { type: "integer", default: 1000 },
        },
      ],
      responses: {
        200: {
          description: "Delayed response",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string" },
                  timestamp: { type: "string", format: "date-time" },
                  delay: { type: "integer" },
                },
              },
            },
          },
        },
      },
    },
  },
  "/echo": {
    post: {
      tags: ["Basic Tests"],
      summary: "Echo request body",
      description: "Returns the request body as part of the response",
      operationId: "postEcho",
      requestBody: {
        description: "Data to be echoed back",
        required: true,
        content: {
          "application/json": {
            schema: { type: "object" },
          },
        },
      },
      responses: {
        200: {
          description: "Echo response",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string" },
                  data: { type: "object" },
                  timestamp: { type: "string", format: "date-time" },
                },
              },
            },
          },
        },
      },
    },
  },
  "/largepayload/{size}": {
    get: {
      tags: ["Basic Tests"],
      summary: "Large payload response",
      description: "Returns a response with a large data payload",
      operationId: "getLargePayload",
      parameters: [
        {
          name: "size",
          in: "path",
          description: "Number of items to generate",
          required: true,
          schema: { type: "integer", default: 1000 },
        },
      ],
      responses: {
        200: {
          description: "Large payload response",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string" },
                  count: { type: "integer" },
                  data: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "integer" },
                        value: { type: "string" },
                        number: { type: "integer" },
                      },
                    },
                  },
                  timestamp: { type: "string", format: "date-time" },
                },
              },
            },
          },
        },
      },
    },
  },
  "/cpu/{load}": {
    get: {
      tags: ["Basic Tests"],
      summary: "CPU-intensive operation",
      description: "Simulates a CPU-intensive operation",
      operationId: "getCpuLoad",
      parameters: [
        {
          name: "load",
          in: "path",
          description: "CPU load factor",
          required: true,
          schema: { type: "integer", default: 100 },
        },
      ],
      responses: {
        200: {
          description: "CPU operation response",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string" },
                  executionTime: { type: "integer" },
                  load: { type: "integer" },
                  timestamp: { type: "string", format: "date-time" },
                },
              },
            },
          },
        },
      },
    },
  },
  "/status/{code}": {
    get: {
      tags: ["Basic Tests"],
      summary: "Custom status code",
      description: "Returns a response with the specified status code",
      operationId: "getStatus",
      parameters: [
        {
          name: "code",
          in: "path",
          description: "HTTP status code",
          required: true,
          schema: { type: "integer", default: 200 },
        },
      ],
      responses: {
        default: {
          description: "Response with custom status code",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string" },
                  status: { type: "integer" },
                  timestamp: { type: "string", format: "date-time" },
                },
              },
            },
          },
        },
      },
    },
  },
};

// Simple endpoint returning 200 OK
router.get("/simple", (req, res) => {
  res.status(200).json({ message: "OK", timestamp: new Date().toISOString() });
});

// Endpoint with delay (simulating slow response)
router.get("/delay/:ms", (req, res) => {
  const delay = parseInt(req.params.ms) || 1000;
  setTimeout(() => {
    res.status(200).json({
      message: `Response after ${delay}ms delay`,
      timestamp: new Date().toISOString(),
      delay: delay,
    });
  }, delay);
});

// Echo endpoint (returns whatever is sent in request body)
router.post("/echo", (req, res) => {
  res.status(200).json({
    message: "Echo response",
    data: req.body,
    timestamp: new Date().toISOString(),
  });
});

// Endpoint that returns large payload
router.get("/largepayload/:size", (req, res) => {
  const size = parseInt(req.params.size) || 1000;
  const data = generateRandomData(size);
  res.status(200).json({
    message: `Generated ${size} items`,
    count: data.length,
    data: data,
    timestamp: new Date().toISOString(),
  });
});

// Endpoint that simulates CPU-intensive operation
router.get("/cpu/:load", (req, res) => {
  const load = parseInt(req.params.load) || 100;
  const startTime = new Date().getTime();

  // Simulate CPU-intensive operation
  let result = 0;
  for (let i = 0; i < load * 1000000; i++) {
    result += Math.sqrt(i);
  }

  const endTime = new Date().getTime();
  res.status(200).json({
    message: `Completed CPU-intensive operation`,
    executionTime: endTime - startTime,
    load: load,
    timestamp: new Date().toISOString(),
  });
});

// Status codes endpoint
router.get("/status/:code", (req, res) => {
  const statusCode = parseInt(req.params.code) || 200;
  res.status(statusCode).json({
    message: `Responding with status code ${statusCode}`,
    status: statusCode,
    timestamp: new Date().toISOString(),
  });
});

// Helper function to generate random data
function generateRandomData(size) {
  const data = [];
  for (let i = 0; i < size; i++) {
    data.push({
      id: i,
      value: Math.random().toString(36).substring(2, 15),
      number: Math.floor(Math.random() * 1000),
    });
  }
  return data;
}

// Export both the router and the OpenAPI path specs
module.exports = router;
module.exports.apiSpec = basicTestPathSpec;
