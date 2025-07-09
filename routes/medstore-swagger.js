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
    tags: ["Medstore"],
    summary: "Update medstore with PATCH",
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

// POST (create new resource)
router.post("/", (req, res) => {
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

// PUT (replace resource)
router.put("/:id", (req, res) => {
  const id = req.params.id;
  medstoreDB[id] = req.body;
  res.status(200).json({
    message: "Medstore: Updated successfully with PUT",
    id,
    data: req.body,
    timestamp: new Date().toISOString(),
  });
});

// PATCH (update resource)
router.patch("/:id", (req, res) => {
  const id = req.params.id;
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
