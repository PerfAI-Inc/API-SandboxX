const express = require("express");
const cors = require("cors");
const path = require("path");
const openapi = require("@wesleytodd/openapi");

// Import routers for new endpoints
const usersRouter = require("./routes/users");
const productsRouter = require("./routes/products");
const ordersRouter = require("./routes/orders");
const tasksRouter = require("./routes/tasks");
const remediationRouter = require("./routes/automated-code-remediation");
const validationRouter = require("./routes/validation-example");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Configure OpenAPI
const oapi = openapi({
  openapi: "3.0.0",
  info: {
    title: "PerfAI Test Endpoints",
    description: "API endpoints for performance testing",
    version: "2.0.0",
  },
  ui: true,
  explorer: true,
  // Add components that are common across the API
  components: {
    schemas: {
      Error: {
        type: "object",
        properties: {
          status: { type: "string" },
          message: { type: "string" },
          timestamp: { type: "string", format: "date-time" },
        },
      },
      Timestamp: {
        type: "object",
        properties: {
          timestamp: { type: "string", format: "date-time" },
        },
      },
    },
    responses: {
      NotFound: {
        description: "The specified resource was not found",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Error",
            },
          },
        },
      },
    },
  },
});

// Use the OpenAPI middleware
app.use(oapi);

// Register routers with OpenAPI documentation
app.use(
  "/api/users",
  oapi.path({
    tags: ["Users"],
    summary: "User management endpoints",
    description: "API endpoints for user CRUD operations with sorting capabilities",
    parameters: [
      {
        name: "sort",
        in: "query",
        description: "Sort order. +field for ascending, -field for descending (e.g. +name, -age)",
        required: false,
        schema: {
          type: "string",
        },
      },
    ],
    responses: {
      200: {
        description: "Successful response with users list",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                status: { type: "string" },
                count: { type: "integer" },
                data: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "string" },
                      name: { type: "string" },
                      age: { type: "integer" },
                      email: { type: "string", format: "email" },
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
  }),
  usersRouter
);

app.use(
  "/api/products",
  oapi.path({
    tags: ["Products"],
    summary: "Product management endpoints",
    description: "API endpoints for product CRUD operations with sorting capabilities",
    parameters: [
      {
        name: "sortBy",
        in: "query",
        description: "Sort field and order, e.g., name:asc, price:desc",
        required: false,
        schema: {
          type: "string",
        },
      },
    ],
    responses: {
      200: {
        description: "Successful response with products list",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                status: { type: "string" },
                count: { type: "integer" },
                data: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "string" },
                      name: { type: "string" },
                      price: { type: "number" },
                      category: { type: "string" },
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
  }),
  productsRouter
);

app.use(
  "/api/orders",
  oapi.path({
    tags: ["Orders"],
    summary: "Order management endpoints",
    description: "API endpoints for order operations",
    parameters: [
      {
        name: "sortField",
        in: "query",
        description: "Field to sort by (ignored in current implementation)",
        required: false,
        schema: { type: "string" },
      },
      {
        name: "sortOrder",
        in: "query",
        description: "Sort order - asc or desc (ignored in current implementation)",
        required: false,
        schema: {
          type: "string",
          enum: ["asc", "desc"],
        },
      },
    ],
    responses: {
      200: {
        description: "Successful response with orders list",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                status: { type: "string" },
                count: { type: "integer" },
                data: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "string" },
                      customer: { type: "string" },
                      total: { type: "number" },
                      date: { type: "string", format: "date" },
                      status: { type: "string" },
                    },
                  },
                },
                timestamp: { type: "string", format: "date-time" },
                requestedSort: {
                  type: "object",
                  properties: {
                    sortField: { type: "string" },
                    sortOrder: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
  }),
  ordersRouter
);

app.use(
  "/api/tasks",
  oapi.path({
    tags: ["Tasks"],
    summary: "Task management endpoints",
    description: "API endpoints for task operations with buggy sorting implementation",
    parameters: [
      {
        name: "order",
        in: "query",
        description: "Sort order (asc or desc) - has a bug that ignores this parameter",
        required: false,
        schema: {
          type: "string",
          enum: ["asc", "desc"],
        },
      },
    ],
    responses: {
      200: {
        description: "Successful response with tasks list",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                status: { type: "string" },
                count: { type: "integer" },
                data: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "string" },
                      title: { type: "string" },
                      priority: { type: "string" },
                      dueDate: { type: "string", format: "date" },
                      status: { type: "string" },
                    },
                  },
                },
                timestamp: { type: "string", format: "date-time" },
                requestedOrder: { type: "string" },
              },
            },
          },
        },
      },
    },
  }),
  tasksRouter
);

app.use(
  "/api/remediation",
  oapi.path({
    tags: ["Code Remediation"],
    summary: "Automated code remediation endpoints",
    description: "API endpoints for testing automated code remediation features",
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
      201: {
        description: "Resource created successfully",
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
  }),
  remediationRouter
);

// Register validation example router - shows how to use OpenAPI validation
app.use(
  "/api/validation",
  oapi.path({
    tags: ["Validation Examples"],
    summary: "Examples of request validation",
    description: "API endpoints demonstrating OpenAPI schema validation",
  }),
  validationRouter
);

// Add an example endpoint with validation
app.post(
  "/api/validate-example",
  oapi.validPath({
    tags: ["Validation"],
    summary: "Example endpoint with validation",
    description: "This endpoint validates the request body against a schema",
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["name", "email"],
            properties: {
              name: {
                type: "string",
                minLength: 3,
              },
              email: {
                type: "string",
                format: "email",
              },
              age: {
                type: "integer",
                minimum: 18,
              },
            },
          },
        },
      },
    },
    responses: {
      200: {
        description: "Validation successful",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                success: { type: "boolean" },
                data: { type: "object" },
                timestamp: { type: "string", format: "date-time" },
              },
            },
          },
        },
      },
      400: {
        description: "Validation failed",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                error: { type: "string" },
                validation: { type: "object" },
                schema: { type: "object" },
              },
            },
          },
        },
      },
    },
  }),
  (req, res) => {
    // If validation passes, this will be executed
    res.status(200).json({
      success: true,
      data: req.body,
      timestamp: new Date().toISOString(),
    });
  },
  (err, req, res, next) => {
    // Error handler for validation failures
    res.status(err.status).json({
      error: err.message,
      validation: err.validationErrors,
      schema: err.validationSchema,
    });
  }
);

// Root route - redirect to API documentation
app.get(
  "/",
  oapi.path({
    tags: ["Navigation"],
    summary: "Redirects to API documentation",
    description: "Root route that redirects users to the OpenAPI documentation UI",
    responses: {
      302: {
        description: "Redirect to API docs",
      },
    },
  }),
  (req, res) => {
    res.redirect("/api/docs");
  }
);

// Custom 404 handler for API routes
app.use("/api/*", (req, res) => {
  res.status(404).json({
    status: "fail",
    message: "API endpoint not found",
    timestamp: new Date().toISOString(),
  });
});

// Serve SwaggerUI at a custom URL as an alternative to the default /api/docs
app.use(
  "/swagger",
  oapi.swaggerui({
    // SwaggerUI configuration options
    docExpansion: "list",
    deepLinking: true,
  })
);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API documentation available at:`);
  console.log(`- http://localhost:${PORT}/api/docs (default UI)`);
  console.log(`- http://localhost:${PORT}/swagger (SwaggerUI)`);
  console.log(`- http://localhost:${PORT}/openapi.json (OpenAPI JSON)`);
});
