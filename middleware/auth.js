const fs = require("fs");
const path = require("path");

// Load users from the JSON file
const loadUsers = () => {
  try {
    const usersPath = path.join(__dirname, "../config/users.json");
    const usersData = fs.readFileSync(usersPath, "utf8");
    return JSON.parse(usersData).users;
  } catch (error) {
    console.error("Error loading users:", error);
    return [];
  }
};

// Basic authentication middleware
const basicAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      status: "fail",
      message: "Authorization header is required",
      timestamp: new Date().toISOString(),
    });
  }

  // Check if it's Basic auth
  if (!authHeader.startsWith("Basic ")) {
    return res.status(401).json({
      status: "fail",
      message: "Basic authentication required",
      timestamp: new Date().toISOString(),
    });
  }

  // Extract and decode credentials
  const base64Credentials = authHeader.split(" ")[1];
  const credentials = Buffer.from(base64Credentials, "base64").toString("ascii");
  const [username, password] = credentials.split(":");

  if (!username || !password) {
    return res.status(401).json({
      status: "fail",
      message: "Username and password are required",
      timestamp: new Date().toISOString(),
    });
  }

  // Load users and validate credentials
  const users = loadUsers();
  const user = users.find((u) => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({
      status: "fail",
      message: "Invalid username or password",
      timestamp: new Date().toISOString(),
    });
  }

  // Add user info to request object (excluding password)
  req.user = {
    id: user.id,
    username: user.username,
    role: user.role,
  };

  next();
};

// Optional: Role-based authorization middleware
const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: "fail",
        message: "Authentication required",
        timestamp: new Date().toISOString(),
      });
    }

    if (req.user.role !== role) {
      return res.status(403).json({
        status: "fail",
        message: `Access denied. ${role} role required`,
        timestamp: new Date().toISOString(),
      });
    }

    next();
  };
};

// Login endpoint for testing credentials
const loginEndpoint = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      status: "fail",
      message: "Username and password are required",
      timestamp: new Date().toISOString(),
    });
  }

  const users = loadUsers();
  const user = users.find((u) => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({
      status: "fail",
      message: "Invalid username or password",
      timestamp: new Date().toISOString(),
    });
  }

  res.json({
    status: "success",
    message: "Login successful",
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
    },
    timestamp: new Date().toISOString(),
  });
};

module.exports = {
  basicAuth,
  requireRole,
  loginEndpoint,
  loadUsers,
};
