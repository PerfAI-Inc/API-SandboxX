const express = require("express");
const router = express.Router();

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

module.exports = router;
