const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path"); // Added for robustness
const connectDB = require("./config/db");

// --- Load environment variables FIRST ---
// This ensures all subsequent code can access process.env
dotenv.config();

const app = express();

// --- Apply middleware SECOND ---
// These prepare the app to handle requests
app.use(cors());
app.use(express.json());

// --- Define routes THIRD ---
// Import the route handlers
const progressRoutes = require("./routes/progressRoutes");
const contentRoutes = require("./routes/contentRoutes");

// --- Health Check Route (for debugging) ---
// This route is at the root and helps confirm the server is running.
app.get("/", (req, res) => {
  res.status(200).send("Sentiment Adventure API is running!");
});

// --- API Routes ---
// Mount the route handlers at their specific paths
app.use("/api/progress", progressRoutes);
app.use("/api/content", contentRoutes);

// --- Connect to database FOURTH ---
// Now that the app is configured, connect to the database
connectDB();

// --- Start the server LAST ---
// This makes the app listen for incoming requests
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is live and listening on port ${PORT}`);
  // Log all registered routes for debugging purposes on startup
  const registeredRoutes = app._router.stack
    .filter((r) => r.route)
    .map(
      (r) =>
        `${Object.keys(r.route.methods).join(", ").toUpperCase()} ${
          r.route.path
        }`
    );
  console.log("Registered routes:", registeredRoutes);
});
