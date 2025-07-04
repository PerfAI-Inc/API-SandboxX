const express = require("express");
const router = express.Router();

// Import authentication middleware
const { basicAuth } = require("../middleware/auth");

// Define the OpenAPI path specifications for this router
const remediationPathSpec = {
  get: {
    tags: ["Code Remediation"],
    summary: "Get all remediation data",
    responses: {
      200: {
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
  post: {
    tags: ["Code Remediation"],
    summary: "Create new remediation entry",
    security: [{ basicAuth: [] }],
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
          },
        },
      },
    },
    responses: {
      201: {
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
      401: {
        description: "Authentication required",
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
};

const remediationByIdPathSpec = {
  parameters: [
    {
      name: "id",
      in: "path",
      required: true,
      schema: {
        type: "string",
      },
    },
  ],
  get: {
    tags: ["Code Remediation"],
    summary: "Get remediation by ID",
    responses: {
      200: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                message: { type: "string" },
                id: { type: "string" },
                timestamp: { type: "string", format: "date-time" },
              },
            },
          },
        },
      },
    },
  },
  put: {
    tags: ["Code Remediation"],
    summary: "Update remediation with PUT",
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
          },
        },
      },
    },
    responses: {
      200: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                message: { type: "string" },
                id: { type: "string" },
                data: { type: "object" },
                timestamp: { type: "string", format: "date-time" },
              },
            },
          },
        },
      },
    },
  },
  patch: {
    tags: ["Code Remediation"],
    summary: "Update remediation with PATCH",
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
          },
        },
      },
    },
    responses: {
      200: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                message: { type: "string" },
                id: { type: "string" },
                data: { type: "object" },
                timestamp: { type: "string", format: "date-time" },
              },
            },
          },
        },
      },
    },
  },
  delete: {
    tags: ["Code Remediation"],
    summary: "Delete remediation entry",
    responses: {
      200: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                message: { type: "string" },
                id: { type: "string" },
                timestamp: { type: "string", format: "date-time" },
              },
            },
          },
        },
      },
    },
  },
};

// Simple GET endpoint
router.get("/", (req, res) => {
  res.status(200).json({
    message: "Retrieved successfully",
    timestamp: new Date().toISOString(),
  });
});

// Simple GET endpoint with ID parameter
router.get("/:id", (req, res) => {
  res.status(200).json({
    message: "Retrieved item by ID",
    id: req.params.id,
    timestamp: new Date().toISOString(),
  });
});

// Simple POST endpoint
router.post("/", basicAuth, (req, res) => {
  res.status(201).json({
    id: "newly-created-id",
    message: "Created successfully",
    data: req.body,
    timestamp: new Date().toISOString(),
  });
});

// Simple PUT endpoint
router.put("/:id", (req, res) => {
  res.status(200).json({
    message: "Updated successfully with PUT",
    id: req.params.id,
    data: req.body,
    timestamp: new Date().toISOString(),
  });
});

// Simple PATCH endpoint
router.patch("/:id", (req, res) => {
  res.status(200).json({
    message: "Updated successfully with PATCH",
    id: req.params.id,
    data: req.body,
    timestamp: new Date().toISOString(),
  });
});

// Simple DELETE endpoint
router.delete("/:id", basicAuth, (req, res) => {
  res.status(200).json({
    message: "Deleted successfully",
    id: req.params.id,
    timestamp: new Date().toISOString(),
  });
});

// Create a combined API specification object
const apiSpec = {
  "/api/remediation": remediationPathSpec,
  "/api/remediation/{id}": remediationByIdPathSpec,
};

// Export the router and the combined API spec
module.exports = router;
module.exports.apiSpec = apiSpec;
