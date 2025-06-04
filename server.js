const express = require("express");
const cors = require("cors");
const path = require("path");
const openapi = require("@wesleytodd/openapi");

// Import routers for new endpoints
const usersRouter = require("./routes/users");
const productsRouter = require("./routes/products");
const ordersRouter = require("./routes/orders");
const tasksRouter = require("./routes/tasks");
const remediationRouter = require("./routes/automated-code-remediation");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Configure OpenAPI
app.use(
  openapi({
    openapi: "3.0.0",
    info: {
      title: "PerfAI Test Endpoints",
      description: "API endpoints for performance testing",
      version: "2.0.0",
    },
    ui: true,
    explorer: true,
  })
);

// Register routers
app.use("/api/users", usersRouter);
app.use("/api/products", productsRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/tasks", tasksRouter);
app.use("/api/remediation", remediationRouter);

// Root route - redirect to API documentation
app.get("/", (req, res) => {
  res.redirect("/api/docs");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API documentation available at http://localhost:${PORT}/api/docs`);
});
