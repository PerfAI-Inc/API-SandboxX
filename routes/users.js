const express = require("express");
const router = express.Router();
const { generateRandomId } = require("../utils/helpers");

// Mock users data
const users = [
  { id: "001", name: "Alice Johnson", age: 32, email: "alice@example.com" },
  { id: "002", name: "Bob Smith", age: 45, email: "bob@example.com" },
  { id: "003", name: "Charlie Brown", age: 28, email: "charlie@example.com" },
  { id: "004", name: "Diana Prince", age: 35, email: "diana@example.com" },
  { id: "005", name: "Edward Cullen", age: 24, email: "edward@example.com" },
  { id: "006", name: "Fiona Gallagher", age: 29, email: "fiona@example.com" },
  { id: "007", name: "George Lucas", age: 50, email: "george@example.com" },
  { id: "008", name: "Hannah Montana", age: 22, email: "hannah@example.com" },
  { id: "009", name: "Ian Somerhalder", age: 38, email: "ian@example.com" },
  { id: "010", name: "Julia Roberts", age: 53, email: "julia@example.com" },
];

/**
 * Users Endpoint - Correctly Implements Sorting
 * GET /api/users
 * Query parameters:
 *  - sort: Accepts values like +name, -name, +age, -age
 *  - The + prefix means ascending, the - prefix means descending
 */
router.get("/", (req, res) => {
  const { sort } = req.query;
  let sortedUsers = [...users];

  if (sort) {
    const sortField = sort.substring(1); // Remove the first character (+ or -)
    const sortOrder = sort.charAt(0);

    // Check if the sort field exists in our user object
    if (sortField && (sortField === "name" || sortField === "age")) {
      sortedUsers.sort((a, b) => {
        // Sort in ascending order by default
        if (sortOrder === "+") {
          return a[sortField] > b[sortField] ? 1 : -1;
        }
        // Sort in descending order if - prefix
        else if (sortOrder === "-") {
          return a[sortField] < b[sortField] ? 1 : -1;
        }
        return 0;
      });
    }
  }

  res.status(200).json({
    status: "success",
    count: sortedUsers.length,
    data: sortedUsers,
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
