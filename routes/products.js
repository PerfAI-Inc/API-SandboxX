const express = require("express");
const router = express.Router();

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

module.exports = router;
