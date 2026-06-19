require("dotenv").config();

const express = require("express");
const cors = require("cors");
const client = require("prom-client");

const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");

const app = express();

// Prometheus Metrics
client.collectDefaultMetrics();
const register = client.register;

// MongoDB Connection
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/products", productRoutes);

app.get("/", (req, res) => {
  res.send("E-Commerce Backend Running");
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "UP",
    timestamp: new Date()
  });
});

app.get("/test", (req, res) => {
  res.send("Test Route Working");
});

app.post("/test", (req, res) => {
  console.log("Received Body:", req.body);
  res.json(req.body);
});

// Prometheus Metrics Endpoint
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
