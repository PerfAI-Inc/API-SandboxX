const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

// Multer config: store files in memory for test purposes
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  },
});

// OpenAPI path spec for malicious file acceptance test
const apiSpec = {
  "/api/file/pdf/upload": {
    post: {
      tags: ["Security"],
      summary: "PDF Upload Endpoint",
      description: "Accepts a PDF file upload and returns basic info. Only PDF files are allowed.",
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                file: {
                  type: "string",
                  format: "binary",
                  description: "PDF file to upload",
                },
              },
              required: ["file"],
            },
          },
        },
      },
      responses: {
        200: {
          description: "File received and analyzed",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  filename: { type: "string" },
                  mimetype: { type: "string" },
                  size: { type: "number" },
                  message: { type: "string" },
                  timestamp: { type: "string", format: "date-time" },
                },
              },
            },
          },
        },
        400: {
          description: "No file uploaded",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: { type: "string" },
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

// POST /api/pdf/upload
router.post("/pdf/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      error: "No PDF file uploaded or invalid file type",
      timestamp: new Date().toISOString(),
    });
  }
  // Basic file info (no actual malicious analysis)
  res.status(200).json({
    filename: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size,
    message: "PDF file received.",
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
module.exports.apiSpec = apiSpec;
