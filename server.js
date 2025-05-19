const express = require("express");
const cors = require("cors");
const path = require("path");

// Import routers for new endpoints
const usersRouter = require("./routes/users");
const productsRouter = require("./routes/products");
const ordersRouter = require("./routes/orders");
const tasksRouter = require("./routes/tasks");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Register routers
app.use("/api/users", usersRouter);
app.use("/api/products", productsRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/tasks", tasksRouter);

// Root route - documentation
app.get("/", (req, res) => {
  res.json({
    name: "PerfAI Test Endpoints",
    description: "API endpoints for performance testing",
    endpoints: [
      {
        path: "/api/users",
        method: "GET",
        description: "Returns a list of users with support for sorting",
        query: "sort (+name, -name, +age, -age)",
        behavior: "Correctly implements sorting",
      },
      {
        path: "/api/products",
        method: "GET",
        description: "Returns a list of products with support for sorting",
        query: "sortBy (name:asc, name:desc, price:asc, price:desc)",
        behavior: "Correctly implements sorting with different format",
      },
      {
        path: "/api/orders",
        method: "GET",
        description: "Returns a list of orders",
        query: "sortOrder (asc, desc), sortField (date, total, etc.)",
        behavior: "Ignores sorting parameters",
      },
      {
        path: "/api/tasks",
        method: "GET",
        description: "Returns a list of tasks",
        query: "order (asc, desc)",
        behavior: "Poorly implements sorting - always sorts in ascending order",
      },
    ],
    version: "2.0.0",
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API documentation available at http://localhost:${PORT}/`);
});
