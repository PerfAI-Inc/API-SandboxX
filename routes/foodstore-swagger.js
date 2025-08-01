const express = require("express");
const router = express.Router();

// Import authentication middleware
const { basicAuth } = require("../middleware/auth");

// OpenAPI path specifications for Foodstore endpoints (mirroring automated-code-remediation.js)
const foodstorePathSpec = {
  // MODIFICATION START: Updated GET endpoint specification
  get: {
    tags: ["Foodstore"],
    summary: "Get all foodstore data",
    security: [{ basicAuth: [] }],
    responses: {
      200: {
        description: "A list of food items without pagination",
        content: {
          "application/json": {
            schema: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  category: { type: "string" },
                  price: { type: "number" },
                  description: { type: "string" },
                  brand: { type: "string" },
                  lotNumber: { type: "string" },
                },
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
  // MODIFICATION END
  post: {
    tags: ["Foodstore"],
    summary: "Create new foodstore entry",
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
                description: "Food item name"
              },
              category: {
                type: "string",
                description: "Food category"
              },
              price: {
                type: "number",
                description: "Food price (optional)"
              },
              description: {
                type: "string",
                description: "Food description (optional)"
              },
              // Note: 'brand' is NOT documented but is required by backend
              // Note: 'lotNumber' is NOT documented but is required by backend
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

const foodstoreByIdPathSpec = {
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
    tags: ["Foodstore"],
    summary: "Get foodstore by ID",
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
    tags: ["Foodstore"],
    summary: "Update foodstore with PUT",
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
                description: "Food item name"
              },
              category: {
                type: "string",
                description: "Food category"
              },
              price: {
                type: "number",
                description: "Food price (optional)"
              },
              description: {
                type: "string",
                description: "Food description (optional)"
              },
              // Note: 'brand' is NOT documented but is required by backend
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
    tags: ["Foodstore"],
    summary: "Update foodstore with PATCH",
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              name: {
                type: "string",
                description: "Food item name"
              },
              category: {
                type: "string",
                description: "Food category"
              },
              price: {
                type: "number",
                description: "Food price (optional)"
              },
              description: {
                type: "string",
                description: "Food description (optional)"
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

// In-memory store for foodstore resources
const foodstoreDB = {};

// Test results storage for field discovery
const fieldDiscoveryResults = {
  post: {
    testSequence: [],
    discoveredUndocumentedRequired: [],
    discoveredUndocumentedOptional: [],
    completedAt: null,
    status: 'NOT_STARTED'
  },
  put: {
    testSequence: [],
    discoveredUndocumentedRequired: [],
    discoveredUndocumentedOptional: [],
    completedAt: null,
    status: 'NOT_STARTED'
  }
};

// Configuration for field discovery testing
const fieldDiscoveryConfig = {
  post: {
    documentedRequired: ['name', 'category'],
    documentedOptional: ['price', 'description'],
    potentialUndocumented: ['brand', 'lotNumber', 'producer', 'expirationDate', 'storageLocation', 'inventoryCount'],
    // Backend simulation: actual required fields (including undocumented)
    actualRequired: ['name', 'category', 'brand', 'lotNumber']
  },
  put: {
    documentedRequired: ['name', 'category'],
    documentedOptional: ['price', 'description'],
    potentialUndocumented: ['brand', 'lotNumber', 'producer', 'expirationDate', 'storageLocation', 'inventoryCount'],
    // Backend simulation: actual required fields (including undocumented)
    actualRequired: ['name', 'category', 'brand']
  }
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

// Simulate backend validation (this would be the actual backend logic)
function simulateBackendValidation(method, requestBody) {
  const config = fieldDiscoveryConfig[method.toLowerCase()];
  const missingRequired = validateRequiredFields(requestBody, config.actualRequired);

  if (missingRequired.length > 0) {
    return {
      success: false,
      error: 'MISSING_REQUIRED_FIELDS',
      missingFields: missingRequired,
      message: `Missing required fields: ${missingRequired.join(', ')}`
    };
  }

  return {
    success: true,
    message: 'Request would succeed'
  };
}

// Advanced field discovery logic - systematically tests field combinations
function performFieldDiscovery(method, originalRequestBody) {
  const methodKey = method.toLowerCase();
  const config = fieldDiscoveryConfig[methodKey];
  const testResults = fieldDiscoveryResults[methodKey];

  // Reset test results
  testResults.testSequence = [];
  testResults.discoveredUndocumentedRequired = [];
  testResults.discoveredUndocumentedOptional = [];
  testResults.status = 'RUNNING';

  // Sample values for testing
  const sampleValues = {
    name: 'Test Food',
    category: 'Test Category',
    price: 10.99,
    description: 'Test description',
    brand: 'Test Brand',
    lotNumber: 'LOT001',
    producer: 'Test Producer',
    expirationDate: '2025-12-31',
    storageLocation: 'Warehouse A',
    inventoryCount: 100
  };

  // Phase 1: Test with only documented required fields
  console.log(`\n=== Phase 1: Testing ${methodKey.toUpperCase()} with documented required fields only ===`);

  let testBody = {};
  config.documentedRequired.forEach(field => {
    testBody[field] = originalRequestBody[field] || sampleValues[field];
  });

  let testResult = {
    phase: 1,
    description: 'Documented required fields only',
    requestBody: { ...testBody },
    backendResult: simulateBackendValidation(method, testBody),
    timestamp: new Date().toISOString()
  };

  testResults.testSequence.push(testResult);
  console.log(`Test 1 - Documented required only: ${testResult.backendResult.success ? 'SUCCESS' : 'FAILED'}`);

  // Phase 2: Add documented optional fields one by one
  console.log(`\n=== Phase 2: Adding documented optional fields one by one ===`);

  config.documentedOptional.forEach((field, index) => {
    if (originalRequestBody[field] || sampleValues[field]) {
      testBody[field] = originalRequestBody[field] || sampleValues[field];

      testResult = {
        phase: 2,
        description: `Added documented optional field: ${field}`,
        requestBody: { ...testBody },
        backendResult: simulateBackendValidation(method, testBody),
        timestamp: new Date().toISOString()
      };

      testResults.testSequence.push(testResult);
      console.log(`Test 2.${index + 1} - Added ${field}: ${testResult.backendResult.success ? 'SUCCESS' : 'FAILED'}`);
    }
  });

  // Phase 3: Systematically test undocumented fields
  console.log(`\n=== Phase 3: Testing potential undocumented fields ===`);

  config.potentialUndocumented.forEach((field, index) => {
    let testBodyWithUndocumented = { ...testBody };
    testBodyWithUndocumented[field] = originalRequestBody[field] || sampleValues[field];

    testResult = {
      phase: 3,
      description: `Testing undocumented field: ${field}`,
      requestBody: { ...testBodyWithUndocumented },
      backendResult: simulateBackendValidation(method, testBodyWithUndocumented),
      timestamp: new Date().toISOString()
    };

    testResults.testSequence.push(testResult);
    console.log(`Test 3.${index + 1} - Testing ${field}: ${testResult.backendResult.success ? 'SUCCESS' : 'FAILED'}`);

    // If this field makes the request succeed, it's likely required
    if (testResult.backendResult.success && !testResults.discoveredUndocumentedRequired.includes(field)) {
      testResults.discoveredUndocumentedRequired.push(field);
      testBody[field] = testBodyWithUndocumented[field]; // Keep this field for subsequent tests
      console.log(`  → DISCOVERED: ${field} appears to be an undocumented required field`);
    }
  });

  // Phase 4: Test combinations to identify minimum required undocumented fields
  console.log(`\n=== Phase 4: Testing minimum required undocumented field combinations ===`);

  if (testResults.discoveredUndocumentedRequired.length > 1) {
    // Test removing each discovered field to see if it's truly required
    testResults.discoveredUndocumentedRequired.forEach((field, index) => {
      let testBodyWithoutField = { ...testBody };
      delete testBodyWithoutField[field];

      testResult = {
        phase: 4,
        description: `Testing without discovered field: ${field}`,
        requestBody: { ...testBodyWithoutField },
        backendResult: simulateBackendValidation(method, testBodyWithoutField),
        timestamp: new Date().toISOString()
      };

      testResults.testSequence.push(testResult);
      console.log(`Test 4.${index + 1} - Without ${field}: ${testResult.backendResult.success ? 'SUCCESS' : 'FAILED'}`);

      // If request fails without this field, it's definitely required
      if (!testResult.backendResult.success) {
        console.log(`  → CONFIRMED: ${field} is definitely required`);
      }
    });
  }

  // Phase 5: Test other undocumented fields as optional
  console.log(`\n=== Phase 5: Testing remaining fields as optional ===`);

  const remainingFields = config.potentialUndocumented.filter(
    field => !testResults.discoveredUndocumentedRequired.includes(field)
  );

  remainingFields.forEach((field, index) => {
    let testBodyWithOptional = { ...testBody };
    testBodyWithOptional[field] = originalRequestBody[field] || sampleValues[field];

    testResult = {
      phase: 5,
      description: `Testing potential optional undocumented field: ${field}`,
      requestBody: { ...testBodyWithOptional },
      backendResult: simulateBackendValidation(method, testBodyWithOptional),
      timestamp: new Date().toISOString()
    };

    testResults.testSequence.push(testResult);
    console.log(`Test 5.${index + 1} - Optional ${field}: ${testResult.backendResult.success ? 'SUCCESS' : 'FAILED'}`);

    // If it still works, it's an optional undocumented field
    if (testResult.backendResult.success) {
      testResults.discoveredUndocumentedOptional.push(field);
      console.log(`  → DISCOVERED: ${field} appears to be an undocumented optional field`);
    }
  });

  testResults.completedAt = new Date().toISOString();
  testResults.status = 'COMPLETED';

  console.log(`\n=== Field Discovery Complete for ${methodKey.toUpperCase()} ===`);
  console.log(`Total tests performed: ${testResults.testSequence.length}`);
  console.log(`Discovered undocumented required fields: ${testResults.discoveredUndocumentedRequired.join(', ') || 'None'}`);
  console.log(`Discovered undocumented optional fields: ${testResults.discoveredUndocumentedOptional.join(', ') || 'None'}`);

  return testResults;
}

// MODIFICATION START: Updated GET all handler
// GET all
router.get("/", (req, res) => {
  // Return a flat array of food items, simulating a non-paginated response.
  res.status(200).json(Object.values(foodstoreDB));
});
// MODIFICATION END

// GET by ID
router.get("/:id", (req, res) => {
  const id = req.params.id;
  if (foodstoreDB[id]) {
    res.status(200).json({
      message: "Foodstore: Retrieved item by ID",
      id,
      data: foodstoreDB[id],
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(404).json({
      message: "Foodstore: Item not found",
      id,
      timestamp: new Date().toISOString(),
    });
  }
});

// POST (create new resource) - Enhanced with comprehensive field discovery
router.post("/", (req, res) => {
  const allowedFields = ['name', 'category', 'price', 'description', 'brand', 'lotNumber'];
  const documentedRequiredFields = ['name', 'category'];
  const undocumentedRequiredFields = ['brand', 'lotNumber'];
  const allRequiredFields = [...documentedRequiredFields, ...undocumentedRequiredFields];

  // Perform comprehensive field discovery testing
  const discoveryResults = performFieldDiscovery('POST', req.body);

  // Check for undocumented fields (fields not in allowedFields)
  const undocumentedFields = validateDocumentedFields(req.body, allowedFields);
  if (undocumentedFields.length > 0) {
    return res.status(400).json({
      error: "Undocumented fields detected",
      message: `The following fields are not documented in the API specification: ${undocumentedFields.join(', ')}`,
      undocumentedFields,
      fieldDiscoveryResults: discoveryResults,
      detailedAnalysis: {
        totalTestsPerformed: discoveryResults.testSequence.length,
        discoveredUndocumentedRequired: discoveryResults.discoveredUndocumentedRequired,
        discoveredUndocumentedOptional: discoveryResults.discoveredUndocumentedOptional,
        testSummary: discoveryResults.testSequence.map(test => ({
          phase: test.phase,
          description: test.description,
          success: test.backendResult.success,
          error: test.backendResult.error || null
        }))
      },
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
      detailedAnalysis: {
        totalTestsPerformed: discoveryResults.testSequence.length,
        discoveredUndocumentedRequired: discoveryResults.discoveredUndocumentedRequired,
        discoveredUndocumentedOptional: discoveryResults.discoveredUndocumentedOptional,
        recommendedAction: `Add these undocumented required fields: ${discoveryResults.discoveredUndocumentedRequired.join(', ')}`,
        testSummary: discoveryResults.testSequence.map(test => ({
          phase: test.phase,
          description: test.description,
          success: test.backendResult.success,
          error: test.backendResult.error || null
        }))
      },
      timestamp: new Date().toISOString(),
    });
  }

  // Generate a simple numeric ID
  const newId = (Object.keys(foodstoreDB).length + 1).toString();
  foodstoreDB[newId] = req.body;
  res.status(201).json({
    id: newId,
    message: "Foodstore: Created successfully",
    data: req.body,
    fieldDiscoveryResults: discoveryResults,
    detailedAnalysis: {
      totalTestsPerformed: discoveryResults.testSequence.length,
      discoveredUndocumentedRequired: discoveryResults.discoveredUndocumentedRequired,
      discoveredUndocumentedOptional: discoveryResults.discoveredUndocumentedOptional,
      conclusion: "Request succeeded with all required fields (including undocumented ones)"
    },
    timestamp: new Date().toISOString(),
  });
});

// PUT (replace resource) - Enhanced with comprehensive field discovery
router.put("/:id", (req, res) => {
  const id = req.params.id;
  const allowedFields = ['name', 'category', 'price', 'description', 'brand'];
  const documentedRequiredFields = ['name', 'category'];
  const undocumentedRequiredFields = ['brand'];
  const allRequiredFields = [...documentedRequiredFields, ...undocumentedRequiredFields];

  // Perform comprehensive field discovery testing
  const discoveryResults = performFieldDiscovery('PUT', req.body);

  // Check for undocumented fields (fields not in allowedFields)
  const undocumentedFields = validateDocumentedFields(req.body, allowedFields);
  if (undocumentedFields.length > 0) {
    return res.status(400).json({
      error: "Undocumented fields detected",
      message: `The following fields are not documented in the API specification: ${undocumentedFields.join(', ')}`,
      undocumentedFields,
      fieldDiscoveryResults: discoveryResults,
      detailedAnalysis: {
        totalTestsPerformed: discoveryResults.testSequence.length,
        discoveredUndocumentedRequired: discoveryResults.discoveredUndocumentedRequired,
        discoveredUndocumentedOptional: discoveryResults.discoveredUndocumentedOptional,
        testSummary: discoveryResults.testSequence.map(test => ({
          phase: test.phase,
          description: test.description,
          success: test.backendResult.success,
          error: test.backendResult.error || null
        }))
      },
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
      detailedAnalysis: {
        totalTestsPerformed: discoveryResults.testSequence.length,
        discoveredUndocumentedRequired: discoveryResults.discoveredUndocumentedRequired,
        discoveredUndocumentedOptional: discoveryResults.discoveredUndocumentedOptional,
        recommendedAction: `Add these undocumented required fields: ${discoveryResults.discoveredUndocumentedRequired.join(', ')}`,
        testSummary: discoveryResults.testSequence.map(test => ({
          phase: test.phase,
          description: test.description,
          success: test.backendResult.success,
          error: test.backendResult.error || null
        }))
      },
      timestamp: new Date().toISOString(),
    });
  }

  foodstoreDB[id] = req.body;
  res.status(200).json({
    message: "Foodstore: Updated successfully with PUT",
    id,
    data: req.body,
    fieldDiscoveryResults: discoveryResults,
    detailedAnalysis: {
      totalTestsPerformed: discoveryResults.testSequence.length,
      discoveredUndocumentedRequired: discoveryResults.discoveredUndocumentedRequired,
      discoveredUndocumentedOptional: discoveryResults.discoveredUndocumentedOptional,
      conclusion: "Request succeeded with all required fields (including undocumented ones)"
    },
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

  if (!foodstoreDB[id]) foodstoreDB[id] = {};
  Object.assign(foodstoreDB[id], req.body);
  res.status(200).json({
    message: "Foodstore: Updated successfully with PATCH",
    id,
    data: foodstoreDB[id],
    timestamp: new Date().toISOString(),
  });
});

// DELETE
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  const existed = !!foodstoreDB[id];
  delete foodstoreDB[id];
  res.status(200).json({
    message: existed ? "Foodstore: Deleted successfully" : "Foodstore: Item not found",
    id,
    timestamp: new Date().toISOString(),
  });
});

// Enhanced endpoint to get comprehensive field discovery test results
router.get("/test/field-discovery", (req, res) => {
  res.status(200).json({
    message: "Comprehensive field discovery test results",
    results: fieldDiscoveryResults,
    configuration: fieldDiscoveryConfig,
    summary: {
      post: {
        status: fieldDiscoveryResults.post.status,
        totalTests: fieldDiscoveryResults.post.testSequence.length,
        discoveredUndocumentedRequired: fieldDiscoveryResults.post.discoveredUndocumentedRequired,
        discoveredUndocumentedOptional: fieldDiscoveryResults.post.discoveredUndocumentedOptional,
        completedAt: fieldDiscoveryResults.post.completedAt,
        lastTestResult: fieldDiscoveryResults.post.testSequence[fieldDiscoveryResults.post.testSequence.length - 1] || null
      },
      put: {
        status: fieldDiscoveryResults.put.status,
        totalTests: fieldDiscoveryResults.put.testSequence.length,
        discoveredUndocumentedRequired: fieldDiscoveryResults.put.discoveredUndocumentedRequired,
        discoveredUndocumentedOptional: fieldDiscoveryResults.put.discoveredUndocumentedOptional,
        completedAt: fieldDiscoveryResults.put.completedAt,
        lastTestResult: fieldDiscoveryResults.put.testSequence[fieldDiscoveryResults.put.testSequence.length - 1] || null
      }
    },
    timestamp: new Date().toISOString(),
  });
});

// Enhanced endpoint to get detailed test sequence for a specific method
router.get("/test/field-discovery/:method", (req, res) => {
  const method = req.params.method.toLowerCase();

  if (!fieldDiscoveryResults[method]) {
    return res.status(404).json({
      error: "Method not found",
      message: `Method '${method}' not found. Available methods: post, put`,
      timestamp: new Date().toISOString(),
    });
  }

  const results = fieldDiscoveryResults[method];

  res.status(200).json({
    message: `Detailed field discovery results for ${method.toUpperCase()}`,
    method: method.toUpperCase(),
    status: results.status,
    totalTests: results.testSequence.length,
    discoveredUndocumentedRequired: results.discoveredUndocumentedRequired,
    discoveredUndocumentedOptional: results.discoveredUndocumentedOptional,
    completedAt: results.completedAt,
    testSequence: results.testSequence,
    phaseBreakdown: {
      phase1: results.testSequence.filter(test => test.phase === 1).length,
      phase2: results.testSequence.filter(test => test.phase === 2).length,
      phase3: results.testSequence.filter(test => test.phase === 3).length,
      phase4: results.testSequence.filter(test => test.phase === 4).length,
      phase5: results.testSequence.filter(test => test.phase === 5).length
    },
    timestamp: new Date().toISOString(),
  });
});

// New endpoint to reset field discovery test results
router.post("/test/field-discovery/reset", (req, res) => {
  const method = req.body.method ? req.body.method.toLowerCase() : 'all';

  if (method === 'all') {
    // Reset all methods
    Object.keys(fieldDiscoveryResults).forEach(key => {
      fieldDiscoveryResults[key] = {
        testSequence: [],
        discoveredUndocumentedRequired: [],
        discoveredUndocumentedOptional: [],
        completedAt: null,
        status: 'NOT_STARTED'
      };
    });

    res.status(200).json({
      message: "All field discovery test results reset successfully",
      resetMethods: Object.keys(fieldDiscoveryResults),
      timestamp: new Date().toISOString(),
    });
  } else if (fieldDiscoveryResults[method]) {
    // Reset specific method
    fieldDiscoveryResults[method] = {
      testSequence: [],
      discoveredUndocumentedRequired: [],
      discoveredUndocumentedOptional: [],
      completedAt: null,
      status: 'NOT_STARTED'
    };

    res.status(200).json({
      message: `Field discovery test results for ${method.toUpperCase()} reset successfully`,
      resetMethod: method.toUpperCase(),
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(400).json({
      error: "Invalid method",
      message: `Method '${method}' not found. Available methods: post, put, all`,
      timestamp: new Date().toISOString(),
    });
  }
});

// New endpoint to manually trigger field discovery testing
router.post("/test/field-discovery/run", (req, res) => {
  const method = req.body.method ? req.body.method.toLowerCase() : null;
  const testData = req.body.testData || {};

  if (!method || !fieldDiscoveryResults[method]) {
    return res.status(400).json({
      error: "Invalid method",
      message: "Please specify a valid method (post or put) in the request body",
      availableMethods: Object.keys(fieldDiscoveryResults),
      timestamp: new Date().toISOString(),
    });
  }

  try {
    const results = performFieldDiscovery(method.toUpperCase(), testData);

    res.status(200).json({
      message: `Field discovery testing completed for ${method.toUpperCase()}`,
      method: method.toUpperCase(),
      results: results,
      summary: {
        status: results.status,
        totalTests: results.testSequence.length,
        discoveredUndocumentedRequired: results.discoveredUndocumentedRequired,
        discoveredUndocumentedOptional: results.discoveredUndocumentedOptional,
        completedAt: results.completedAt
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      error: "Field discovery testing failed",
      message: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// New endpoint to get field discovery configuration
router.get("/test/field-discovery/config", (req, res) => {
  res.status(200).json({
    message: "Field discovery configuration",
    configuration: fieldDiscoveryConfig,
    description: {
      documentedRequired: "Fields that are documented as required in the API specification",
      documentedOptional: "Fields that are documented as optional in the API specification",
      potentialUndocumented: "Fields that might exist but are not documented in the API spec",
      actualRequired: "Fields that are actually required by the backend (including undocumented ones)"
    },
    testingPhases: {
      phase1: "Test with only documented required fields",
      phase2: "Add documented optional fields one by one",
      phase3: "Test potential undocumented fields",
      phase4: "Test minimum required undocumented field combinations",
      phase5: "Test remaining fields as optional"
    },
    timestamp: new Date().toISOString(),
  });
});

// New endpoint to update field discovery configuration
router.put("/test/field-discovery/config", (req, res) => {
  const method = req.body.method ? req.body.method.toLowerCase() : null;
  const config = req.body.config || {};

  if (!method || !fieldDiscoveryConfig[method]) {
    return res.status(400).json({
      error: "Invalid method",
      message: "Please specify a valid method (post or put) in the request body",
      availableMethods: Object.keys(fieldDiscoveryConfig),
      timestamp: new Date().toISOString(),
    });
  }

  // Update configuration
  if (config.documentedRequired) {
    fieldDiscoveryConfig[method].documentedRequired = config.documentedRequired;
  }
  if (config.documentedOptional) {
    fieldDiscoveryConfig[method].documentedOptional = config.documentedOptional;
  }
  if (config.potentialUndocumented) {
    fieldDiscoveryConfig[method].potentialUndocumented = config.potentialUndocumented;
  }
  if (config.actualRequired) {
    fieldDiscoveryConfig[method].actualRequired = config.actualRequired;
  }

  res.status(200).json({
    message: `Field discovery configuration updated for ${method.toUpperCase()}`,
    method: method.toUpperCase(),
    updatedConfig: fieldDiscoveryConfig[method],
    timestamp: new Date().toISOString(),
  });
});

// New endpoint to simulate different backend behaviors
router.post("/test/simulate-backend", (req, res) => {
  const method = req.body.method ? req.body.method.toLowerCase() : null;
  const requestBody = req.body.requestBody || {};

  if (!method || !fieldDiscoveryConfig[method]) {
    return res.status(400).json({
      error: "Invalid method",
      message: "Please specify a valid method (post or put) in the request body",
      availableMethods: Object.keys(fieldDiscoveryConfig),
      timestamp: new Date().toISOString(),
    });
  }

  const backendResult = simulateBackendValidation(method.toUpperCase(), requestBody);

  res.status(200).json({
    message: `Backend simulation for ${method.toUpperCase()}`,
    method: method.toUpperCase(),
    requestBody: requestBody,
    backendResult: backendResult,
    configuration: fieldDiscoveryConfig[method],
    analysis: {
      providedFields: Object.keys(requestBody),
      requiredFields: fieldDiscoveryConfig[method].actualRequired,
      missingFields: fieldDiscoveryConfig[method].actualRequired.filter(field => !requestBody[field]),
      extraFields: Object.keys(requestBody).filter(field => !fieldDiscoveryConfig[method].actualRequired.includes(field))
    },
    timestamp: new Date().toISOString(),
  });
});

// Create order with cost elevation issue endpoint
router.post("/order", (req, res) => {
  // Reject if client tries to provide orderDate
  if (req.body.orderDate) {
    return res.status(400).json({
      status: 400,
      statusText: "Bad Request",
      error: "Client-provided orderDate is not allowed. Server will generate the timestamp."
    });
  }

  // Simulate cost elevation by manipulating prices and quantities
  const order = {
    id: req.body.id || Math.floor(Math.random() * 1000),
    foodId: req.body.foodId,
    quantity: req.body.quantity || 1,
    orderDate: new Date().toISOString(), // Always use server-side timestamp
    status: req.body.status || "pending",
    complete: req.body.complete || false,
    basePrice: req.body.basePrice || 10.00,
  };

  // Simulate cost elevation based on quantity
  const elevatedCost = order.quantity * order.basePrice * (1 + Math.random()); // Random cost elevation

  // Add artificial processing delay
  setTimeout(() => {
    res.status(200).json({
      status: 200,
      statusText: "OK",
      headers: {
        "date": new Date().toUTCString(),
        "content-type": "application/json",
        "connection": "keep-alive",
        "access-control-allow-origin": "*",
        "access-control-allow-methods": "GET, POST, DELETE, PUT",
        "access-control-allow-headers": "Content-Type, api_key, Authorization",
        "server": "TestEndpoints/1.0"
      },
      data: {
        ...order,
        calculatedCost: elevatedCost.toFixed(2),
        processingTime: Math.floor(Math.random() * 1000), // Random processing time
        costElevationFactor: (elevatedCost / (order.quantity * order.basePrice)).toFixed(2)
      }
    });
  }, Math.floor(Math.random() * 1000)); // Random delay between 0-1000ms
});

// Add order endpoint to API spec
const orderPathSpec = {
  post: {
    tags: ["Foodstore"],
    summary: "Create a new order with potential cost elevation",
    description: "Creates a new order. The orderDate is automatically generated on the server and cannot be provided by the client to prevent timestamp manipulation.",
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              id: { type: "string" },
              foodId: { type: "string" },
              quantity: { type: "number" },
              status: { type: "string", enum: ["pending", "approved", "delivered"] },
              complete: { type: "boolean" },
              basePrice: { type: "number" }
            },
            required: ["foodId"]
          }
        }
      }
    },
    responses: {
      200: {
        description: "Order created successfully",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                status: { type: "number" },
                statusText: { type: "string" },
                headers: { type: "object" },
                data: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    foodId: { type: "string" },
                    quantity: { type: "number" },
                    orderDate: { type: "string" },
                    status: { type: "string" },
                    complete: { type: "boolean" },
                    basePrice: { type: "number" },
                    calculatedCost: { type: "string" },
                    processingTime: { type: "number" },
                    costElevationFactor: { type: "string" }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};

// Combined API spec for Foodstore
const apiSpec = {
  "/api/foodstore": foodstorePathSpec,
  "/api/foodstore/{id}": foodstoreByIdPathSpec,
  "/api/foodstore/order": orderPathSpec
};

module.exports = router;
module.exports.apiSpec = apiSpec;