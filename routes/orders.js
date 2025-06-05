const express = require("express");
const router = express.Router();
const openapi = require("@wesleytodd/openapi");

// Define the order schema
const orderSchema = {
  type: "object",
  properties: {
    id: { type: "string" },
    customer: { type: "string" },
    total: { type: "number" },
    date: { type: "string", format: "date" },
    status: { type: "string" },
  },
};

// Define the OpenAPI path specifications for this router
const ordersPathSpec = {
  "/": {
    get: {
      tags: ["Orders"],
      summary: "Order management endpoints",
      description: "API endpoints for order operations",
      parameters: [
        {
          name: "sortField",
          in: "query",
          description: "Field to sort by (ignored in current implementation)",
          required: false,
          schema: { type: "string" },
        },
        {
          name: "sortOrder",
          in: "query",
          description: "Sort order - asc or desc (ignored in current implementation)",
          required: false,
          schema: {
            type: "string",
            enum: ["asc", "desc"],
          },
        },
      ],
      responses: {
        200: {
          description: "Successful response with orders list",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string" },
                  count: { type: "integer" },
                  data: {
                    type: "array",
                    items: orderSchema,
                  },
                  timestamp: { type: "string", format: "date-time" },
                  requestedSort: {
                    type: "object",
                    properties: {
                      sortField: { type: "string" },
                      sortOrder: { type: "string" },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

// Mock orders data
const orders = [
  { id: "o001", customer: "Alice Johnson", total: 1580, date: "2025-05-15", status: "Delivered" },
  { id: "o002", customer: "Bob Smith", total: 950, date: "2025-05-16", status: "Processing" },
  { id: "o003", customer: "Charlie Brown", total: 325, date: "2025-05-14", status: "Shipped" },
  { id: "o004", customer: "Diana Prince", total: 780, date: "2025-05-17", status: "Processing" },
  { id: "o005", customer: "Edward Cullen", total: 1200, date: "2025-05-12", status: "Delivered" },
  { id: "o006", customer: "Fiona Gallagher", total: 450, date: "2025-05-18", status: "Pending" },
  { id: "o007", customer: "George Lucas", total: 2500, date: "2025-05-13", status: "Shipped" },
  { id: "o008", customer: "Hannah Montana", total: 320, date: "2025-05-19", status: "Processing" },
  { id: "o009", customer: "Ian Somerhalder", total: 1100, date: "2025-05-10", status: "Delivered" },
  { id: "o010", customer: "Julia Roberts", total: 960, date: "2025-05-11", status: "Delivered" },
];

/**
 * Orders Endpoint - Ignores Sorting Parameter
 * GET /api/orders
 * Query parameters:
 *   - sortOrder: Accepts values like asc or desc
 *   - sortField: Accepts values like date, total, etc.
 * This endpoint IGNORES the sorting parameters and always returns data in the same order
 */
router.get("/", (req, res) => {
  // Deliberately ignoring sortOrder and sortField parameters
  const { sortOrder, sortField } = req.query;

  // Always return the original array without sorting
  res.status(200).json({
    status: "success",
    count: orders.length,
    data: orders,
    timestamp: new Date().toISOString(),
    // Include requested sort params in response for testing purposes
    requestedSort: {
      sortField: sortField || "none",
      sortOrder: sortOrder || "none",
    },
  });
});

// Export both the router and the OpenAPI path specs
module.exports = router;
module.exports.apiSpec = ordersPathSpec;
