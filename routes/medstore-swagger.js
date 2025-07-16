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
            required: ["name", "category"], // Only documented required fields
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
              },
              // Note: 'supplier' is NOT documented but is required by backend
              // Note: 'batchNumber' is NOT documented but is required by backend
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
            required: ["name", "category"], // Only documented required fields
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
              },
              // Note: 'supplier' is NOT documented but is required by backend
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

// Test results storage
const testResults = {
  post: { attempts: [], discoveredFields: [] },
  put: { attempts: [], discoveredFields: [] }
};

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

// Helper function to validate required fields (both documented and undocumented)
function validateRequiredFields(requestBody, requiredFields) {
  const missingFields = [];
  
  requiredFields.forEach(field => {
    if (!requestBody.hasOwnProperty(field) || requestBody[field] === null || requestBody[field] === undefined || requestBody[field] === '') {
      missingFields.push(field);
    }
  });
  
  return missingFields;
}

// Enhanced field discovery logic
function discoverUndocumentedFields(method, requestBody, documentedFields, allPossibleFields) {
  const methodKey = method.toLowerCase();
  const testAttempt = {
    timestamp: new Date().toISOString(),
    requestBody: { ...requestBody },
    result: null,
    error: null
  };
  
  // Test 1: Only documented required fields
  const documentedRequired = ['name', 'category'];
  const documentedOnlyBody = {};
  documentedRequired.forEach(field => {
    if (requestBody[field]) {
      documentedOnlyBody[field] = requestBody[field];
    }
  });
  
  // Simulate backend validation for documented fields only
  const missingDocumentedFields = validateRequiredFields(documentedOnlyBody, documentedRequired);
  if (missingDocumentedFields.length > 0) {
    testAttempt.result = 'FAIL';
    testAttempt.error = `Missing documented required fields: ${missingDocumentedFields.join(', ')}`;
    testResults[methodKey].attempts.push(testAttempt);
    return testAttempt;
  }
  
  // Test 2: Add optional documented fields one by one
  const documentedOptional = ['price', 'description'];
  let testBody = { ...documentedOnlyBody };
  
  for (const field of documentedOptional) {
    if (requestBody[field]) {
      testBody[field] = requestBody[field];
      const testAttempt2 = {
        timestamp: new Date().toISOString(),
        requestBody: { ...testBody },
        result: null,
        error: null
      };
      
      // Check if this combination would work (simulating backend)
      const actualRequired = method === 'POST' ? ['name', 'category', 'supplier', 'batchNumber'] : ['name', 'category', 'supplier'];
      const stillMissing = validateRequiredFields(testBody, actualRequired);
      
      if (stillMissing.length > 0) {
        testAttempt2.result = 'FAIL';
        testAttempt2.error = `Still missing undocumented required fields: ${stillMissing.join(', ')}`;
      } else {
        testAttempt2.result = 'SUCCESS';
      }
      
      testResults[methodKey].attempts.push(testAttempt2);
    }
  }
  
  // Test 3: Systematically test undocumented fields
  const potentialUndocumentedFields = ['supplier', 'batchNumber', 'manufacturer', 'expiryDate'];
  
  for (const field of potentialUndocumentedFields) {
    if (requestBody[field]) {
      testBody[field] = requestBody[field];
      const testAttempt3 = {
        timestamp: new Date().toISOString(),
        requestBody: { ...testBody },
        result: null,
        error: null,
        discoveredField: field
      };
      
      // Check if adding this field resolves the issue
      const actualRequired = method === 'POST' ? ['name', 'category', 'supplier', 'batchNumber'] : ['name', 'category', 'supplier'];
      const stillMissing = validateRequiredFields(testBody, actualRequired);
      
      if (stillMissing.length === 0) {
        testAttempt3.result = 'SUCCESS';
        testAttempt3.error = `Field '${field}' appears to be required but undocumented`;
        testResults[methodKey].discoveredFields.push(field);
      } else {
        testAttempt3.result = 'PARTIAL';
        testAttempt3.error = `Field '${field}' helps but still missing: ${stillMissing.join(', ')}`;
      }
      
      testResults[methodKey].attempts.push(testAttempt3);
    }
  }
  
  return testResults[methodKey];
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

// POST (create new resource) - Enhanced with field discovery testing
router.post("/", (req, res) => {
  const allowedFields = ['name', 'category', 'price', 'description', 'supplier', 'batchNumber'];
  const documentedRequiredFields = ['name', 'category'];
  const undocumentedRequiredFields = ['supplier', 'batchNumber'];
  const allRequiredFields = [...documentedRequiredFields, ...undocumentedRequiredFields];
  
  // Run field discovery testing
  const discoveryResults = discoverUndocumentedFields('POST', req.body, ['name', 'category', 'price', 'description'], allowedFields);
  
  // Check for undocumented fields (fields not in allowedFields)
  const undocumentedFields = validateDocumentedFields(req.body, allowedFields);
  if (undocumentedFields.length > 0) {
    return res.status(400).json({
      error: "Undocumented fields detected",
      message: `The following fields are not documented in the API specification: ${undocumentedFields.join(', ')}`,
      undocumentedFields,
      fieldDiscoveryResults: discoveryResults,
      timestamp: new Date().toISOString(),
    });
  }
  
  // Check for missing required fields (including undocumented ones)
  const missingFields = validateRequiredFields(req.body, allRequiredFields);
  if (missingFields.length > 0) {
    return res.status(400).json({
      error: "Missing required fields",
      message: `The following required fields are missing: ${missingFields.join(', ')}`,
      missingFields,
      fieldDiscoveryResults: discoveryResults,
      possibleUndocumentedRequired: undocumentedRequiredFields,
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
    fieldDiscoveryResults: discoveryResults,
    timestamp: new Date().toISOString(),
  });
});

// PUT (replace resource) - Enhanced with field discovery testing
router.put("/:id", (req, res) => {
  const id = req.params.id;
  const allowedFields = ['name', 'category', 'price', 'description', 'supplier'];
  const documentedRequiredFields = ['name', 'category'];
  const undocumentedRequiredFields = ['supplier'];
  const allRequiredFields = [...documentedRequiredFields, ...undocumentedRequiredFields];
  
  // Run field discovery testing
  const discoveryResults = discoverUndocumentedFields('PUT', req.body, ['name', 'category', 'price', 'description'], allowedFields);
  
  // Check for undocumented fields (fields not in allowedFields)
  const undocumentedFields = validateDocumentedFields(req.body, allowedFields);
  if (undocumentedFields.length > 0) {
    return res.status(400).json({
      error: "Undocumented fields detected",
      message: `The following fields are not documented in the API specification: ${undocumentedFields.join(', ')}`,
      undocumentedFields,
      fieldDiscoveryResults: discoveryResults,
      timestamp: new Date().toISOString(),
    });
  }
  
  // Check for missing required fields (including undocumented ones)
  const missingFields = validateRequiredFields(req.body, allRequiredFields);
  if (missingFields.length > 0) {
    return res.status(400).json({
      error: "Missing required fields",
      message: `The following required fields are missing: ${missingFields.join(', ')}`,
      missingFields,
      fieldDiscoveryResults: discoveryResults,
      possibleUndocumentedRequired: undocumentedRequiredFields,
      timestamp: new Date().toISOString(),
    });
  }
  
  medstoreDB[id] = req.body;
  res.status(200).json({
    message: "Medstore: Updated successfully with PUT",
    id,
    data: req.body,
    fieldDiscoveryResults: discoveryResults,
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

// New endpoint to get field discovery test results
router.get("/test/field-discovery", (req, res) => {
  res.status(200).json({
    message: "Field discovery test results",
    results: testResults,
    summary: {
      post: {
        totalAttempts: testResults.post.attempts.length,
        discoveredFields: testResults.post.discoveredFields,
        lastTest: testResults.post.attempts[testResults.post.attempts.length - 1] || null
      },
      put: {
        totalAttempts: testResults.put.attempts.length,
        discoveredFields: testResults.put.discoveredFields,
        lastTest: testResults.put.attempts[testResults.put.attempts.length - 1] || null
      }
    },
    timestamp: new Date().toISOString(),
  });
});

// New endpoint to reset test results
router.post("/test/reset", (req, res) => {
  testResults.post = { attempts: [], discoveredFields: [] };
  testResults.put = { attempts: [], discoveredFields: [] };
  
  res.status(200).json({
    message: "Test results reset successfully",
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