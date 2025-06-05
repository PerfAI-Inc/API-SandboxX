const express = require("express");
const router = express.Router();
const openapi = require("@wesleytodd/openapi");

// Define OpenAPI specifications for this router
const patientPathSpec = {
  "/history/record": {
    get: {
      tags: ["Patient"],
      summary: "Get patient record",
      description: "Retrieve patient medical record",
      operationId: "getPatientRecord",
      responses: {
        200: {
          description: "Successful response",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string" },
                  id: { type: "string" },
                  timestamp: { type: "string", format: "date-time" },
                },
              },
            },
          },
        },
      },
    },
  },
  "/history/record/modify": {
    post: {
      tags: ["Patient"],
      summary: "Create patient record",
      description: "Create a new patient medical record",
      operationId: "createPatientRecord",
      requestBody: {
        description: "Patient record data",
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
          description: "Record created successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string" },
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
  },
  "/history/record/modify/{id}": {
    delete: {
      tags: ["Patient"],
      summary: "Delete patient record",
      description: "Delete an existing patient medical record",
      operationId: "deletePatientRecord",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "ID of the patient record to delete",
          schema: {
            type: "string",
          },
        },
      ],
      responses: {
        200: {
          description: "Record deleted successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string" },
                  deleted: { type: "string" },
                  timestamp: { type: "string", format: "date-time" },
                },
              },
            },
          },
        },
      },
    },
  },
  "/history/record/update/{id}": {
    put: {
      tags: ["Patient"],
      summary: "Update patient record",
      description: "Update an existing patient medical record",
      operationId: "updatePatientRecord",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "ID of the patient record to update",
          schema: {
            type: "string",
          },
        },
      ],
      requestBody: {
        description: "Updated patient record data",
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
          description: "Record updated successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string" },
                  id: { type: "string" },
                  updated: { type: "object" },
                  timestamp: { type: "string", format: "date-time" },
                },
              },
            },
          },
        },
      },
    },
  },
  "/history/record/update/modify/{id}": {
    patch: {
      tags: ["Patient"],
      summary: "Partially update patient record",
      description: "Update parts of an existing patient medical record",
      operationId: "patchPatientRecord",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "ID of the patient record to patch",
          schema: {
            type: "string",
          },
        },
      ],
      requestBody: {
        description: "Partial patient record data",
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
          description: "Record patched successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string" },
                  id: { type: "string" },
                  patched: { type: "object" },
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

// ================= PATIENT HISTORY RECORD ENDPOINTS =================

// GET - Get Patient Record
router.get("/history/record", (req, res) => {
  res.status(200).json({
    status: "success",
    id: generateRandomId(),
    timestamp: new Date().toISOString(),
  });
});

// POST - Create Patient Record
router.post("/history/record/modify", (req, res) => {
  const id = generateRandomId();
  res.status(200).json({
    status: "success",
    id: id,
    data: req.body,
    timestamp: new Date().toISOString(),
  });
});

// DELETE - Delete Patient Record
router.delete("/history/record/modify/:id", (req, res) => {
  const id = req.params.id;
  res.status(200).json({
    status: "success",
    deleted: id,
    timestamp: new Date().toISOString(),
  });
});

// PUT - Update Patient Record
router.put("/history/record/update/:id", (req, res) => {
  const id = req.params.id;
  res.status(200).json({
    status: "success",
    id: id,
    updated: req.body,
    timestamp: new Date().toISOString(),
  });
});

// PATCH - Partially Update Patient Record
router.patch("/history/record/update/modify/:id", (req, res) => {
  const id = req.params.id;
  res.status(200).json({
    status: "success",
    id: id,
    patched: req.body,
    timestamp: new Date().toISOString(),
  });
});

// Helper function to generate random ID
function generateRandomId() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Export both the router and the OpenAPI path specs
module.exports = router;
module.exports.apiSpec = patientPathSpec;
