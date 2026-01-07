require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const path = require("path");
const apiRoutes = require("./routes");
const { connectToDB } = require("./database/db");

// server init
const server = express();

// database connection
connectToDB();

// middlewares
server.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
    exposedHeaders: ["X-Total-Count"],
    methods: ["GET", "POST", "PATCH", "DELETE"],
  })
);
server.use(express.json());
server.use(cookieParser());
server.use(morgan("tiny"));

// api routes
server.use("/api/v1", apiRoutes);

// Serve static files from React build (for production)
if (process.env.NODE_ENV === "production") {
  const frontendBuildPath = path.join(__dirname, "../frontend/build");

  // Serve static files
  server.use(express.static(frontendBuildPath));

  // Handle React routing, return all requests to React app
  server.use((req, res) => {
    res.sendFile(path.join(frontendBuildPath, "index.html"));
  });
} else {
  // Development mode - just return API status
  server.get("/", (req, res) => {
    res
      .status(200)
      .json({ message: "Backend API running in development mode" });
  });
}

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
  console.log(`server [STARTED] ~ http://localhost:${PORT}`);
});
