const express = require("express");
const router = express.Router();

// Define the OpenAPI path specifications for this router
const remediationPathSpec = {
  get: {
    tags: ["Code Remediation"],
    summary: "Get all remediation data",
    description: "Retrieve all code remediation information",
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
  post: {
    tags: ["Code Remediation"],
    summary: "Create new remediation entry",
    description: "Create a new code remediation entry",
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
      description: "The remediation entry identifier",
    },
  ],
  get: {
    tags: ["Code Remediation"],
    summary: "Get remediation by ID",
    description: "Retrieve a specific code remediation entry by ID",
    responses: {
      200: {
        description: "Successful response",
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
    description: "Replace an entire code remediation entry",
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
        description: "Successfully updated",
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
    description: "Partially update a code remediation entry",
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
        description: "Successfully updated",
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
    description: "Delete a specific code remediation entry by ID",
    responses: {
      200: {
        description: "Successfully deleted",
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
router.post("/", (req, res) => {
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
router.delete("/:id", (req, res) => {
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
