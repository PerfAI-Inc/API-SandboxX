const express = require("express");
const router = express.Router();

// Import authentication middleware
const { basicAuth } = require("../middleware/auth");

// OpenAPI path specifications for Medstore endpoints (mirroring automated-code-remediation.js)
const medstorePathSpec = {
  get: {
    tags: ["Medstore"],
    summary: "Get all medstore data",
    security: [{ basicAuth: [] }],
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
  post: {
    tags: ["Medstore"],
    summary: "Create new medstore entry",
    security: [{ basicAuth: [] }],
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["name", "category"], // Added documented required fields
            properties: {
              name: { 
                type: "string",
                description: "Medicine name"
              },
              category: { 
                type: "string",
                description: "Medicine category"
              },
              price: { 
                type: "number",
                description: "Medicine price (optional)"
              },
              description: { 
                type: "string",
                description: "Medicine description (optional)"
              }
            },
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
      400: {
        description: "Bad request - missing required fields or undocumented fields",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                error: { type: "string" },
                message: { type: "string" },
                undocumentedFields: { 
                  type: "array",
                  items: { type: "string" }
                },
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

const medstoreByIdPathSpec = {
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
    tags: ["Medstore"],
    summary: "Get medstore by ID",
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
    tags: ["Medstore"],
    summary: "Update medstore with PUT",
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["name", "category"], // Added documented required fields for PUT
            properties: {
              name: { 
                type: "string",
                description: "Medicine name"
              },
              category: { 
                type: "string",
                description: "Medicine category"
              },
              price: { 
                type: "number",
                description: "Medicine price (optional)"
              },
              description: { 
                type: "string",
                description: "Medicine description (optional)"
              }
            },
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
      400: {
        description: "Bad request - missing required fields or undocumented fields",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                error: { type: "string" },
                message: { type: "string" },
                undocumentedFields: { 
                  type: "array",
                  items: { type: "string" }
                },
                timestamp: { type: "string", format: "date-time" },
              },
            },
          },
        },
      },
    },
  },
  patch: {
    tags: ["Medstore"],
    summary: "Update medstore with PATCH",
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              name: { 
                type: "string",
                description: "Medicine name"
              },
              category: { 
                type: "string",
                description: "Medicine category"
              },
              price: { 
                type: "number",
                description: "Medicine price (optional)"
              },
              description: { 
                type: "string",
                description: "Medicine description (optional)"
              }
            },
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
      400: {
        description: "Bad request - undocumented fields present",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                error: { type: "string" },
                message: { type: "string" },
                undocumentedFields: { 
                  type: "array",
                  items: { type: "string" }
                },
                timestamp: { type: "string", format: "date-time" },
              },
            },
          },
        },
      },
    },
  },
  delete: {
    tags: ["Medstore"],
    summary: "Delete medstore entry",
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

// In-memory store for medstore resources
const medstoreDB = {};

// Helper function to validate documented fields
function validateDocumentedFields(requestBody, allowedFields) {
  const undocumentedFields = [];
  const bodyFields = Object.keys(requestBody);
  
  bodyFields.forEach(field => {
    if (!allowedFields.includes(field)) {
      undocumentedFields.push(field);
    }
  });
  
  return undocumentedFields;
}

// Helper function to validate required fields
function validateRequiredFields(requestBody, requiredFields) {
  const missingFields = [];
  
  requiredFields.forEach(field => {
    if (!requestBody.hasOwnProperty(field) || requestBody[field] === null || requestBody[field] === undefined || requestBody[field] === '') {
      missingFields.push(field);
    }
  });
  
  return missingFields;
}

// GET all
router.get("/", (req, res) => {
  res.status(200).json({
    message: "Medstore: Retrieved successfully",
    data: medstoreDB,
    timestamp: new Date().toISOString(),
  });
});

// GET by ID
router.get("/:id", (req, res) => {
  const id = req.params.id;
  if (medstoreDB[id]) {
    res.status(200).json({
      message: "Medstore: Retrieved item by ID",
      id,
      data: medstoreDB[id],
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(404).json({
      message: "Medstore: Item not found",
      id,
      timestamp: new Date().toISOString(),
    });
  }
});

// POST (create new resource) - Enhanced with validation
router.post("/", (req, res) => {
  const allowedFields = ['name', 'category', 'price', 'description'];
  const requiredFields = ['name', 'category'];
  
  // Check for undocumented fields
  const undocumentedFields = validateDocumentedFields(req.body, allowedFields);
  if (undocumentedFields.length > 0) {
    return res.status(400).json({
      error: "Undocumented fields detected",
      message: `The following fields are not documented in the API specification: ${undocumentedFields.join(', ')}`,
      undocumentedFields,
      timestamp: new Date().toISOString(),
    });
  }
  
  // Check for missing required fields
  const missingFields = validateRequiredFields(req.body, requiredFields);
  if (missingFields.length > 0) {
    return res.status(400).json({
      error: "Missing required fields",
      message: `The following required fields are missing: ${missingFields.join(', ')}`,
      missingFields,
      timestamp: new Date().toISOString(),
    });
  }
  
  // Generate a simple numeric ID
  const newId = (Object.keys(medstoreDB).length + 1).toString();
  medstoreDB[newId] = req.body;
  res.status(201).json({
    id: newId,
    message: "Medstore: Created successfully",
    data: req.body,
    timestamp: new Date().toISOString(),
  });
});

// PUT (replace resource) - Enhanced with validation
router.put("/:id", (req, res) => {
  const id = req.params.id;
  const allowedFields = ['name', 'category', 'price', 'description'];
  const requiredFields = ['name', 'category'];
  
  // Check for undocumented fields
  const undocumentedFields = validateDocumentedFields(req.body, allowedFields);
  if (undocumentedFields.length > 0) {
    return res.status(400).json({
      error: "Undocumented fields detected",
      message: `The following fields are not documented in the API specification: ${undocumentedFields.join(', ')}`,
      undocumentedFields,
      timestamp: new Date().toISOString(),
    });
  }
  
  // Check for missing required fields
  const missingFields = validateRequiredFields(req.body, requiredFields);
  if (missingFields.length > 0) {
    return res.status(400).json({
      error: "Missing required fields",
      message: `The following required fields are missing: ${missingFields.join(', ')}`,
      missingFields,
      timestamp: new Date().toISOString(),
    });
  }
  
  medstoreDB[id] = req.body;
  res.status(200).json({
    message: "Medstore: Updated successfully with PUT",
    id,
    data: req.body,
    timestamp: new Date().toISOString(),
  });
});

// PATCH (update resource) - Enhanced with validation
router.patch("/:id", (req, res) => {
  const id = req.params.id;
  const allowedFields = ['name', 'category', 'price', 'description'];
  
  // Check for undocumented fields
  const undocumentedFields = validateDocumentedFields(req.body, allowedFields);
  if (undocumentedFields.length > 0) {
    return res.status(400).json({
      error: "Undocumented fields detected",
      message: `The following fields are not documented in the API specification: ${undocumentedFields.join(', ')}`,
      undocumentedFields,
      timestamp: new Date().toISOString(),
    });
  }
  
  if (!medstoreDB[id]) medstoreDB[id] = {};
  Object.assign(medstoreDB[id], req.body);
  res.status(200).json({
    message: "Medstore: Updated successfully with PATCH",
    id,
    data: medstoreDB[id],
    timestamp: new Date().toISOString(),
  });
});

// DELETE
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  const existed = !!medstoreDB[id];
  delete medstoreDB[id];
  res.status(200).json({
    message: existed ? "Medstore: Deleted successfully" : "Medstore: Item not found",
    id,
    timestamp: new Date().toISOString(),
  });
});

// Combined API spec for Medstore
const apiSpec = {
  "/api/medstore": medstorePathSpec,
  "/api/medstore/{id}": medstoreByIdPathSpec,
};

module.exports = router;
module.exports.apiSpec = apiSpec;
