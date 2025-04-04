const express = require("express");
const router = express.Router();

// Simple endpoint returning 200 OK
router.get("/simple", (req, res) => {
  res.status(200).json({ message: "OK", timestamp: new Date().toISOString() });
});

// Endpoint with delay (simulating slow response)
router.get("/delay/:ms", (req, res) => {
  const delay = parseInt(req.params.ms) || 1000;
  setTimeout(() => {
    res.status(200).json({
      message: `Response after ${delay}ms delay`,
      timestamp: new Date().toISOString(),
      delay: delay,
    });
  }, delay);
});

// Echo endpoint (returns whatever is sent in request body)
router.post("/echo", (req, res) => {
  res.status(200).json({
    message: "Echo response",
    data: req.body,
    timestamp: new Date().toISOString(),
  });
});

// Endpoint that returns large payload
router.get("/largepayload/:size", (req, res) => {
  const size = parseInt(req.params.size) || 1000;
  const data = generateRandomData(size);
  res.status(200).json({
    message: `Generated ${size} items`,
    count: data.length,
    data: data,
    timestamp: new Date().toISOString(),
  });
});

// Endpoint that simulates CPU-intensive operation
router.get("/cpu/:load", (req, res) => {
  const load = parseInt(req.params.load) || 100;
  const startTime = new Date().getTime();

  // Simulate CPU-intensive operation
  let result = 0;
  for (let i = 0; i < load * 1000000; i++) {
    result += Math.sqrt(i);
  }

  const endTime = new Date().getTime();
  res.status(200).json({
    message: `Completed CPU-intensive operation`,
    executionTime: endTime - startTime,
    load: load,
    timestamp: new Date().toISOString(),
  });
});

// Status codes endpoint
router.get("/status/:code", (req, res) => {
  const statusCode = parseInt(req.params.code) || 200;
  res.status(statusCode).json({
    message: `Responding with status code ${statusCode}`,
    status: statusCode,
    timestamp: new Date().toISOString(),
  });
});

// Helper function to generate random data
function generateRandomData(size) {
  const data = [];
  for (let i = 0; i < size; i++) {
    data.push({
      id: i,
      value: Math.random().toString(36).substring(2, 15),
      number: Math.floor(Math.random() * 1000),
    });
  }
  return data;
}

module.exports = router;
