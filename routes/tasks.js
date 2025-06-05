const express = require("express");
const router = express.Router();

// Define the OpenAPI path specifications for this router
const tasksPathSpec = {
  "/": {
    get: {
      tags: ["Tasks"],
      summary: "Task management endpoints",
      description: "API endpoints for task operations with buggy sorting implementation",
      parameters: [
        {
          name: "order",
          in: "query",
          description: "Sort order (asc or desc) - has a bug that ignores this parameter",
          required: false,
          schema: {
            type: "string",
            enum: ["asc", "desc"],
          },
        },
      ],
      responses: {
        200: {
          description: "Successful response with tasks list",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: {
                    type: "string",
                    example: "success",
                  },
                  count: {
                    type: "integer",
                    description: "Number of tasks returned",
                  },                  data: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        title: { type: "string" },
                        priority: { type: "string" },
                        dueDate: { type: "string", format: "date" },
                        status: { type: "string" }
                      }
                    },
                  },
                  timestamp: {
                    type: "string",
                    format: "date-time",
                    description: "Response timestamp",
                  },
                  requestedOrder: {
                    type: "string",
                    description: "The sort order that was requested",
                    example: "asc",
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

// Mock tasks data
const tasks = [
  { id: "t001", title: "Complete project proposal", priority: "High", dueDate: "2025-05-25", status: "Pending" },
  { id: "t002", title: "Review code changes", priority: "Medium", dueDate: "2025-05-20", status: "In Progress" },
  { id: "t003", title: "Update documentation", priority: "Low", dueDate: "2025-05-30", status: "Pending" },
  { id: "t004", title: "Fix reported bug", priority: "High", dueDate: "2025-05-19", status: "In Progress" },
  { id: "t005", title: "Implement new feature", priority: "Medium", dueDate: "2025-06-05", status: "Not Started" },
  { id: "t006", title: "Prepare presentation", priority: "High", dueDate: "2025-05-28", status: "Not Started" },
  { id: "t007", title: "Attend team meeting", priority: "Medium", dueDate: "2025-05-21", status: "Pending" },
  { id: "t008", title: "Conduct testing", priority: "Medium", dueDate: "2025-05-26", status: "Not Started" },
  { id: "t009", title: "Deploy to production", priority: "High", dueDate: "2025-06-10", status: "Not Started" },
  { id: "t010", title: "Client follow-up", priority: "Low", dueDate: "2025-05-22", status: "Pending" },
];

/**
 * Tasks Endpoint - Poorly Implements Sorting
 * GET /api/tasks
 * Query parameters:
 *   - order: Accepts values like asc or desc
 * This endpoint attempts to sort but has a bug where it always sorts in ascending
 * order regardless of the parameter
 */
router.get("/", (req, res) => {
  const { order } = req.query;
  let sortedTasks = [...tasks];

  // Bug: Always sorts in ascending order regardless of the order parameter
  if (order) {
    // This is intentionally buggy! Always sorts by title in ascending order
    sortedTasks.sort((a, b) => {
      return a.title.localeCompare(b.title);
      // The bug is that we ignore the 'order' parameter and always sort ascending
    });
  }

  res.status(200).json({
    status: "success",
    count: sortedTasks.length,
    data: sortedTasks,
    timestamp: new Date().toISOString(),
    // Include requested order in response for testing purposes
    requestedOrder: order || "none",
  });
});

// Export both the router and the OpenAPI path specs
module.exports = router;
module.exports.apiSpec = tasksPathSpec;
