const express = require("express");
const router = express.Router();
const openapi = require("@wesleytodd/openapi");

// Define the OpenAPI path specifications for this router
const remediationPathSpec = {
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

// Export both the router and the OpenAPI path specs
module.exports = router;
module.exports.apiSpec = remediationPathSpec;
