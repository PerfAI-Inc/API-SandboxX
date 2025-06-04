const express = require("express");
const router = express.Router();
const openapi = require("@wesleytodd/openapi");

// Define OpenAPI specifications for this router
const patientPathSpec = {
  tags: ["Patient"],
  summary: "Patient medical records",
  description: "API endpoints for managing patient medical records",
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
