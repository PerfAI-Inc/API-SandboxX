const express = require("express");
const router = express.Router();

// Import authentication middleware
const { basicAuth } = require("../middleware/auth");

// In-memory store for medstore resources
const medstoreDB = {};

// Medicine schema definition (similar to Pet in Petstore)
const medicineSchema = {
  type: "object",
  required: ["name", "category"],
  properties: {
    id: {
      type: "integer",
      format: "int64",
      example: 1
    },
    name: {
      type: "string",
      example: "Aspirin"
    },
    category: {
      $ref: "#/components/schemas/Category"
    },
    manufacturer: {
      type: "string",
      example: "PharmaCorp"
    },
    dosage: {
      type: "string",
      example: "500mg"
    },
    price: {
      type: "number",
      format: "float",
      example: 29.99
    },
    stock: {
      type: "integer",
      format: "int32",
      example: 100
    },
    expiryDate: {
      type: "string",
      format: "date",
      example: "2025-12-31"
    },
    prescriptionRequired: {
      type: "boolean",
      example: false
    },
    status: {
      type: "string",
      description: "medicine status in the store",
      enum: ["available", "out_of_stock", "discontinued"],
      example: "available"
    },
    tags: {
      type: "array",
      items: {
        $ref: "#/components/schemas/Tag"
      }
    }
  }
};

// Category schema
const categorySchema = {
  type: "object",
  properties: {
    id: {
      type: "integer",
      format: "int64",
      example: 1
    },
    name: {
      type: "string",
      example: "Pain Relief"
    }
  }
};

// Tag schema
const tagSchema = {
  type: "object",
  properties: {
    id: {
      type: "integer",
      format: "int64",
      example: 1
    },
    name: {
      type: "string",
      example: "analgesic"
    }
  }
};

// Order schema
const orderSchema = {
  type: "object",
  properties: {
    id: {
      type: "integer",
      format: "int64",
      example: 1
    },
    medicineId: {
      type: "integer",
      format: "int64",
      example: 1
    },
    quantity: {
      type: "integer",
      format: "int32",
      example: 2
    },
    shipDate: {
      type: "string",
      format: "date-time"
    },
    status: {
      type: "string",
      description: "Order Status",
      enum: ["placed", "approved", "delivered"],
      example: "placed"
    },
    complete: {
      type: "boolean",
      example: false
    }
  }
};

// User schema
const userSchema = {
  type: "object",
  properties: {
    id: {
      type: "integer",
      format: "int64",
      example: 1
    },
    username: {
      type: "string",
      example: "theUser"
    },
    firstName: {
      type: "string",
      example: "John"
    },
    lastName: {
      type: "string",
      example: "James"
    },
    email: {
      type: "string",
      example: "john@email.com"
    },
    password: {
      type: "string",
      example: "12345"
    },
    phone: {
      type: "string",
      example: "12345"
    },
    userStatus: {
      type: "integer",
      format: "int32",
      description: "User Status",
      example: 1
    }
  }
};

// Error schema
const errorSchema = {
  type: "object",
  properties: {
    code: {
      type: "integer",
      format: "int32"
    },
    type: {
      type: "string"
    },
    message: {
      type: "string"
    }
  }
};

// API Response schema
const apiResponseSchema = {
  type: "object",
  properties: {
    code: {
      type: "integer",
      format: "int32"
    },
    type: {
      type: "string"
    },
    message: {
      type: "string"
    }
  }
};

// OpenAPI path specifications for Medstore endpoints
const medstorePathSpec = {
  get: {
    tags: ["medicine"],
    summary: "Get all medicines",
    description: "Returns all medicines from the store",
    operationId: "getMedicines",
    produces: ["application/json"],
    responses: {
      200: {
        description: "successful operation",
        content: {
          "application/json": {
            schema: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Medicine"
              }
            }
          }
        }
      },
      400: {
        description: "Invalid status value",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Error"
            }
          }
        }
      }
    }
  },
  post: {
    tags: ["medicine"],
    summary: "Add a new medicine to the store",
    description: "Add a new medicine to the store",
    operationId: "addMedicine",
    consumes: ["application/json"],
    produces: ["application/json"],
    requestBody: {
      description: "Medicine object that needs to be added to the store",
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/Medicine"
          }
        }
      }
    },
    responses: {
      201: {
        description: "Medicine created successfully",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Medicine"
            }
          }
        }
      },
      400: {
        description: "Invalid input",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Error"
            }
          }
        }
      },
      422: {
        description: "Validation exception",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Error"
            }
          }
        }
      }
    },
    security: [
      {
        medstore_auth: ["write:medicines", "read:medicines"]
      }
    ]
  }
};

const medstoreByIdPathSpec = {
  parameters: [
    {
      name: "medicineId",
      in: "path",
      description: "ID of medicine to return",
      required: true,
      schema: {
        type: "integer",
        format: "int64"
      }
    }
  ],
  get: {
    tags: ["medicine"],
    summary: "Find medicine by ID",
    description: "Returns a single medicine",
    operationId: "getMedicineById",
    produces: ["application/json"],
    responses: {
      200: {
        description: "successful operation",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Medicine"
            }
          }
        }
      },
      400: {
        description: "Invalid ID supplied",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Error"
            }
          }
        }
      },
      404: {
        description: "Medicine not found",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Error"
            }
          }
        }
      }
    },
    security: [
      {
        api_key: []
      }
    ]
  },
  put: {
    tags: ["medicine"],
    summary: "Update an existing medicine",
    description: "Update an existing medicine by Id",
    operationId: "updateMedicine",
    consumes: ["application/json"],
    produces: ["application/json"],
    requestBody: {
      description: "Update an existent medicine in the store",
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/Medicine"
          }
        }
      }
    },
    responses: {
      200: {
        description: "Medicine updated successfully",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Medicine"
            }
          }
        }
      },
      400: {
        description: "Invalid ID supplied",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Error"
            }
          }
        }
      },
      404: {
        description: "Medicine not found",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Error"
            }
          }
        }
      },
      422: {
        description: "Validation exception",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Error"
            }
          }
        }
      }
    },
    security: [
      {
        medstore_auth: ["write:medicines", "read:medicines"]
      }
    ]
  },
  patch: {
    tags: ["medicine"],
    summary: "Partially update medicine",
    description: "Partially update medicine by Id",
    operationId: "patchMedicine",
    consumes: ["application/json"],
    produces: ["application/json"],
    requestBody: {
      description: "Medicine object with fields to update",
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object"
          }
        }
      }
    },
    responses: {
      200: {
        description: "Medicine updated successfully",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Medicine"
            }
          }
        }
      },
      400: {
        description: "Invalid ID supplied",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Error"
            }
          }
        }
      },
      404: {
        description: "Medicine not found",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Error"
            }
          }
        }
      }
    },
    security: [
      {
        medstore_auth: ["write:medicines", "read:medicines"]
      }
    ]
  },
  delete: {
    tags: ["medicine"],
    summary: "Delete medicine",
    description: "Delete a medicine",
    operationId: "deleteMedicine",
    produces: ["application/json"],
    responses: {
      200: {
        description: "Medicine deleted successfully",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/ApiResponse"
            }
          }
        }
      },
      400: {
        description: "Invalid ID supplied",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Error"
            }
          }
        }
      },
      404: {
        description: "Medicine not found",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Error"
            }
          }
        }
      }
    },
    security: [
      {
        medstore_auth: ["write:medicines", "read:medicines"]
      }
    ]
  }
};

// Additional endpoints for finding medicines by status (like petstore)
const medstoreByStatusPathSpec = {
  get: {
    tags: ["medicine"],
    summary: "Finds Medicines by status",
    description: "Multiple status values can be provided with comma separated strings",
    operationId: "findMedicinesByStatus",
    produces: ["application/json"],
    parameters: [
      {
        name: "status",
        in: "query",
        description: "Status values that need to be considered for filter",
        required: true,
        explode: true,
        schema: {
          type: "array",
          items: {
            type: "string",
            enum: ["available", "out_of_stock", "discontinued"],
            default: "available"
          }
        }
      }
    ],
    responses: {
      200: {
        description: "successful operation",
        content: {
          "application/json": {
            schema: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Medicine"
              }
            }
          }
        }
      },
      400: {
        description: "Invalid status value",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Error"
            }
          }
        }
      }
    },
    security: [
      {
        medstore_auth: ["write:medicines", "read:medicines"]
      }
    ]
  }
};

// Store/inventory endpoints
const storeInventoryPathSpec = {
  get: {
    tags: ["store"],
    summary: "Returns medicine inventories by status",
    description: "Returns a map of status codes to quantities",
    operationId: "getInventory",
    produces: ["application/json"],
    responses: {
      200: {
        description: "successful operation",
        content: {
          "application/json": {
            schema: {
              type: "object",
              additionalProperties: {
                type: "integer",
                format: "int32"
              }
            }
          }
        }
      }
    },
    security: [
      {
        api_key: []
      }
    ]
  }
};

const storeOrderPathSpec = {
  post: {
    tags: ["store"],
    summary: "Place an order for a medicine",
    description: "Place a new order in the store",
    operationId: "placeOrder",
    consumes: ["application/json"],
    produces: ["application/json"],
    requestBody: {
      description: "Order placed for purchasing the medicine",
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/Order"
          }
        }
      }
    },
    responses: {
      200: {
        description: "successful operation",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Order"
            }
          }
        }
      },
      400: {
        description: "Invalid Order",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Error"
            }
          }
        }
      }
    }
  }
};

const storeOrderByIdPathSpec = {
  parameters: [
    {
      name: "orderId",
      in: "path",
      description: "ID of order that needs to be fetched",
      required: true,
      schema: {
        type: "integer",
        format: "int64",
        minimum: 1,
        maximum: 10
      }
    }
  ],
  get: {
    tags: ["store"],
    summary: "Find purchase order by ID",
    description: "For valid response try integer IDs with value >= 1 and <= 10. Other values will generated exceptions",
    operationId: "getOrderById",
    produces: ["application/json"],
    responses: {
      200: {
        description: "successful operation",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Order"
            }
          }
        }
      },
      400: {
        description: "Invalid ID supplied",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Error"
            }
          }
        }
      },
      404: {
        description: "Order not found",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Error"
            }
          }
        }
      }
    }
  },
  delete: {
    tags: ["store"],
    summary: "Delete purchase order by ID",
    description: "For valid response try integer IDs with positive integer value. Negative or non-integer values will generate API errors",
    operationId: "deleteOrder",
    produces: ["application/json"],
    responses: {
      400: {
        description: "Invalid ID supplied",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Error"
            }
          }
        }
      },
      404: {
        description: "Order not found",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Error"
            }
          }
        }
      }
    }
  }
};

// GET all medicines
router.get("/", (req, res) => {
  const medicines = Object.values(medstoreDB);
  res.status(200).json(medicines);
});

// GET medicines by status
router.get("/findByStatus", (req, res) => {
  const { status } = req.query;
  if (!status) {
    return res.status(400).json({
      code: 400,
      type: "error",
      message: "Status parameter is required"
    });
  }
  
  const statusArray = Array.isArray(status) ? status : [status];
  const medicines = Object.values(medstoreDB).filter(medicine => 
    statusArray.includes(medicine.status)
  );
  
  res.status(200).json(medicines);
});

// GET by ID
router.get("/:id", (req, res) => {
  const id = req.params.id;
  if (medstoreDB[id]) {
    res.status(200).json(medstoreDB[id]);
  } else {
    res.status(404).json({
      code: 404,
      type: "error",
      message: "Medicine not found"
    });
  }
});

// POST (create new medicine)
router.post("/", (req, res) => {
  // Generate a simple numeric ID
  const newId = (Object.keys(medstoreDB).length + 1).toString();
  const medicine = {
    id: parseInt(newId),
    ...req.body
  };
  medstoreDB[newId] = medicine;
  res.status(201).json(medicine);
});

// PUT (replace medicine)
router.put("/:id", (req, res) => {
  const id = req.params.id;
  const medicine = {
    id: parseInt(id),
    ...req.body
  };
  medstoreDB[id] = medicine;
  res.status(200).json(medicine);
});

// PATCH (update medicine)
router.patch("/:id", (req, res) => {
  const id = req.params.id;
  if (!medstoreDB[id]) {
    return res.status(404).json({
      code: 404,
      type: "error",
      message: "Medicine not found"
    });
  }
  Object.assign(medstoreDB[id], req.body);
  res.status(200).json(medstoreDB[id]);
});

// DELETE
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  const existed = !!medstoreDB[id];
  if (existed) {
    delete medstoreDB[id];
    res.status(200).json({
      code: 200,
      type: "success",
      message: "Medicine deleted successfully"
    });
  } else {
    res.status(404).json({
      code: 404,
      type: "error",
      message: "Medicine not found"
    });
  }
});

// Store inventory endpoint
router.get("/inventory", (req, res) => {
  const inventory = {};
  Object.values(medstoreDB).forEach(medicine => {
    const status = medicine.status || 'available';
    inventory[status] = (inventory[status] || 0) + (medicine.stock || 0);
  });
  res.status(200).json(inventory);
});

// Complete API specification (similar to Petstore structure)
const apiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Medstore API",
    description: "This is a sample Medstore Server based on the OpenAPI 3.0 specification. You can find out more about Swagger at [https://swagger.io](https://swagger.io).",
    termsOfService: "https://swagger.io/terms/",
    contact: {
      email: "apiteam@swagger.io"
    },
    license: {
      name: "Apache 2.0",
      url: "https://www.apache.org/licenses/LICENSE-2.0.html"
    },
    version: "1.0.11"
  },
  externalDocs: {
    description: "Find out more about Swagger",
    url: "https://swagger.io"
  },
  servers: [
    {
      url: "https://medstore.swagger.io/v3"
    }
  ],
  tags: [
    {
      name: "medicine",
      description: "Everything about your Medicines",
      externalDocs: {
        description: "Find out more",
        url: "https://swagger.io"
      }
    },
    {
      name: "store",
      description: "Access to Medstore orders",
      externalDocs: {
        description: "Find out more about our store",
        url: "https://swagger.io"
      }
    },
    {
      name: "user",
      description: "Operations about user"
    }
  ],
  paths: {
    "/medicine": medstorePathSpec,
    "/medicine/findByStatus": medstoreByStatusPathSpec,
    "/medicine/{medicineId}": medstoreByIdPathSpec,
    "/store/inventory": storeInventoryPathSpec,
    "/store/order": storeOrderPathSpec,
    "/store/order/{orderId}": storeOrderByIdPathSpec
  },
  components: {
    schemas: {
      Order: orderSchema,
      Category: categorySchema,
      User: userSchema,
      Tag: tagSchema,
      Medicine: medicineSchema,
      ApiResponse: apiResponseSchema,
      Error: errorSchema
    },
    securitySchemes: {
      medstore_auth: {
        type: "oauth2",
        flows: {
          implicit: {
            authorizationUrl: "https://medstore.swagger.io/oauth/authorize",
            scopes: {
              "write:medicines": "modify medicines in your account",
              "read:medicines": "read your medicines"
            }
          }
        }
      },
      api_key: {
        type: "apiKey",
        name: "api_key",
        in: "header"
      }
    }
  }
};

module.exports = router;
module.exports.apiSpec = apiSpec;
module.exports.medstoreDB = medstoreDB;