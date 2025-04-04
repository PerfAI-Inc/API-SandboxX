const express = require("express");
const cors = require("cors");
const path = require("path");

// Import routers
const basicTestRouter = require("./routes/basicTest");
const patientRouter = require("./routes/patient");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Register routers
app.use("/api/test", basicTestRouter);
app.use("/patient", patientRouter);

// Root route - documentation
app.get("/", (req, res) => {
  res.json({
    name: "PerfAI Test Endpoints",
    description: "API endpoints for performance testing",
    endpoints: [
      { path: "/api/test/simple", method: "GET", description: "Simple 200 OK response" },
      {
        path: "/api/test/delay/:ms",
        method: "GET",
        description: "Response with specified delay in ms",
      },
      { path: "/api/test/echo", method: "POST", description: "Echoes back the request body" },
      {
        path: "/api/test/largepayload/:size",
        method: "GET",
        description: "Returns payload with specified number of items",
      },
      {
        path: "/api/test/cpu/:load",
        method: "GET",
        description: "Simulates CPU load (higher number = more load)",
      },
      {
        path: "/api/test/status/:code",
        method: "GET",
        description: "Returns specified HTTP status code",
      },

      // Patient history record endpoints
      { path: "/patient/history/record", method: "GET", description: "Get patient history record" },
      {
        path: "/patient/history/record/modify",
        method: "POST",
        description: "Create patient history record",
      },
      {
        path: "/patient/history/record/modify/:id",
        method: "DELETE",
        description: "Delete patient history record",
      },
      {
        path: "/patient/history/record/update/:id",
        method: "PUT",
        description: "Update patient history record",
      },
      {
        path: "/patient/history/record/update/modify/:id",
        method: "PATCH",
        description: "Partially update patient history record",
      },
    ],
    version: "1.0.0",
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API documentation available at http://localhost:${PORT}/`);
});
