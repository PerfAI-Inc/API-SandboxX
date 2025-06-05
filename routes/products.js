const express = require("express");
const router = express.Router();

// Define the product schema
const productSchema = {
  type: "object",
  properties: {
    id: { type: "string" },
    name: { type: "string" },
    price: { type: "number" },
    category: { type: "string" },
  },
};

// Define the OpenAPI path specifications for this router
const productsPathSpec = {
  get: {
    tags: ["Products"],
    summary: "Get all products",
    description: "Returns a list of products with optional sorting",
    parameters: [
      {
        name: "sortBy",
        in: "query",
        description: "Sort field and order, e.g., name:asc, price:desc",
        required: false,
        schema: {
          type: "string",
        },
      },
    ],
    responses: {
      200: {
        description: "Successful response with products list",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                status: { type: "string" },
                count: { type: "integer" },
                data: {
                  type: "array",
                  items: productSchema,
                },
                timestamp: { type: "string", format: "date-time" },
              },
            },
          },
        },
      },
  },
  "/{id}": {
    put: {
      tags: ["Products"],
      summary: "Update a product",
      description: "Updates a product with the specified ID",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "Product ID",
          schema: {
            type: "string",
          },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["name", "price", "category"],
              properties: {
                name: { type: "string" },
                price: { type: "number" },
                category: { type: "string" },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Product updated successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string" },
                  data: productSchema,
                  timestamp: { type: "string", format: "date-time" },
                },
              },
            },
          },
        },
        400: {
          description: "Bad request - missing required fields",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string" },
                  message: { type: "string" },
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

// Mock products data
const products = [
  { id: "p001", name: "Laptop", price: 1200, category: "Electronics" },
  { id: "p002", name: "Smartphone", price: 800, category: "Electronics" },
  { id: "p003", name: "Coffee Maker", price: 150, category: "Kitchen" },
  { id: "p004", name: "Desk Chair", price: 220, category: "Furniture" },
  { id: "p005", name: "Headphones", price: 180, category: "Electronics" },
  { id: "p006", name: "Monitor", price: 350, category: "Electronics" },
  { id: "p007", name: "Desk", price: 300, category: "Furniture" },
  { id: "p008", name: "Blender", price: 120, category: "Kitchen" },
  { id: "p009", name: "Keyboard", price: 100, category: "Electronics" },
  { id: "p010", name: "Bookshelf", price: 250, category: "Furniture" },
];

/**
 * Products Endpoint - Correctly Implements Sorting with Different Format
 * GET /api/products
 * Query parameters:
 *   - sortBy: Accepts values like name:asc, name:desc, price:asc, price:desc
 */
router.get("/", (req, res) => {
  const { sortBy } = req.query;
  let sortedProducts = [...products];

  if (sortBy) {
    const [sortField, sortOrder] = sortBy.split(":");

    // Check if the sort field exists in our product object
    if (sortField && (sortField === "name" || sortField === "price" || sortField === "category")) {
      sortedProducts.sort((a, b) => {
        if (sortOrder === "asc") {
          return a[sortField] > b[sortField] ? 1 : -1;
        } else if (sortOrder === "desc") {
          return a[sortField] < b[sortField] ? 1 : -1;
        }
        return 0;
      });
    }
  }

  res.status(200).json({
    status: "success",
    count: sortedProducts.length,
    data: sortedProducts,
    timestamp: new Date().toISOString(),
  });
});

/**
 * Products Update Endpoint - Updates a product with required fields
 * PUT /api/products/:id
 * Required body fields:
 *   - name: String - Product name
 *   - price: Number - Product price
 *   - category: String - Product category
 */
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { name, price, category } = req.body;

  // Check if all required fields are provided
  if (!name || !price || !category) {
    return res.status(400).json({
      status: "fail",
      message: "Missing required fields: name, price, and category are all required",
      timestamp: new Date().toISOString(),
    });
  }

  const updatedProduct = {
    id,
    name,
    price,
    category,
  };

  res.status(200).json({
    status: "success",
    data: updatedProduct,
    timestamp: new Date().toISOString(),
  });
});

// Export both the router and the OpenAPI path specs
module.exports = router;
module.exports.apiSpec = productsPathSpec;
