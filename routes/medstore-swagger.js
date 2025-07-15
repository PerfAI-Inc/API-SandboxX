const express = require("express");
const router = express.Router();

// In-memory store for medstore resources
const medstoreDB = {};

// Validate fields not defined in allowed spec list
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

// Validate required fields (both documented and undocumented)
function validateRequiredFields(requestBody, requiredFields) {
  const missingFields = [];
  requiredFields.forEach(field => {
    if (
      !requestBody.hasOwnProperty(field) ||
      requestBody[field] === null ||
      requestBody[field] === undefined ||
      requestBody[field] === ''
    ) {
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

// POST (Create) with undocumented required fields
router.post("/", (req, res) => {
  const allowedFields = ['name', 'category', 'price', 'description', 'supplier', 'batchNumber'];
  const documentedRequiredFields = ['name', 'category'];
  const undocumentedRequiredFields = ['supplier', 'batchNumber'];
  const allRequiredFields = [...documentedRequiredFields, ...undocumentedRequiredFields];

  const undocumentedFields = validateDocumentedFields(req.body, allowedFields);
  if (undocumentedFields.length > 0) {
    console.log("❌ FAIL: Undocumented fields present in POST:", undocumentedFields);
    return res.status(400).json({
      error: "Undocumented fields detected",
      message: `The following fields are not documented in the API specification: ${undocumentedFields.join(', ')}`,
      undocumentedFields,
      timestamp: new Date().toISOString(),
    });
  }

  const missingFields = validateRequiredFields(req.body, allRequiredFields);
  if (missingFields.length > 0) {
    console.log("❌ FAIL: Missing required fields in POST:", missingFields);
    return res.status(400).json({
      error: "Missing required fields",
      message: `The following required fields are missing: ${missingFields.join(', ')}`,
      missingFields,
      timestamp: new Date().toISOString(),
    });
  }

  const newId = (Object.keys(medstoreDB).length + 1).toString();
  medstoreDB[newId] = req.body;
  console.log("✅ PASS: POST with all documented + undocumented required fields present.");
  res.status(201).json({
    id: newId,
    message: "Medstore: Created successfully",
    data: req.body,
    timestamp: new Date().toISOString(),
  });
});

// PUT (Replace) with undocumented required field 'supplier'
router.put("/:id", (req, res) => {
  const id = req.params.id;
  const allowedFields = ['name', 'category', 'price', 'description', 'supplier'];
  const documentedRequiredFields = ['name', 'category'];
  const undocumentedRequiredFields = ['supplier'];
  const allRequiredFields = [...documentedRequiredFields, ...undocumentedRequiredFields];

  const undocumentedFields = validateDocumentedFields(req.body, allowedFields);
  if (undocumentedFields.length > 0) {
    console.log("❌ FAIL: Undocumented fields present in PUT:", undocumentedFields);
    return res.status(400).json({
      error: "Undocumented fields detected",
      message: `The following fields are not documented in the API specification: ${undocumentedFields.join(', ')}`,
      undocumentedFields,
      timestamp: new Date().toISOString(),
    });
  }

  const missingFields = validateRequiredFields(req.body, allRequiredFields);
  if (missingFields.length > 0) {
    console.log("❌ FAIL: Missing required fields in PUT:", missingFields);
    return res.status(400).json({
      error: "Missing required fields",
      message: `The following required fields are missing: ${missingFields.join(', ')}`,
      missingFields,
      timestamp: new Date().toISOString(),
    });
  }

  medstoreDB[id] = req.body;
  console.log("✅ PASS: PUT with all documented + undocumented required fields present.");
  res.status(200).json({
    message: "Medstore: Updated successfully with PUT",
    id,
    data: req.body,
    timestamp: new Date().toISOString(),
  });
});

// PATCH (Partial Update) - no undocumented fields allowed
router.patch("/:id", (req, res) => {
  const id = req.params.id;
  const allowedFields = ['name', 'category', 'price', 'description'];

  const undocumentedFields = validateDocumentedFields(req.body, allowedFields);
  if (undocumentedFields.length > 0) {
    console.log("❌ FAIL: Undocumented fields present in PATCH:", undocumentedFields);
    return res.status(400).json({
      error: "Undocumented fields detected",
      message: `The following fields are not documented in the API specification: ${undocumentedFields.join(', ')}`,
      undocumentedFields,
      timestamp: new Date().toISOString(),
    });
  }

  if (!medstoreDB[id]) medstoreDB[id] = {};
  Object.assign(medstoreDB[id], req.body);
  console.log("✅ PASS: PATCH with only allowed fields.");
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
  console.log("✅ DELETE request handled:", existed ? "Deleted" : "Not Found");
  res.status(200).json({
    message: existed ? "Medstore: Deleted successfully" : "Medstore: Item not found",
    id,
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
