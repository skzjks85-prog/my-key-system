const express = require("express");
const cors = require("cors");
const crypto = require("crypto");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// In-memory keys for initial testing.
// Later we can move these to a persistent database.
const keys = new Map();

// Generate a random key
function generateKey() {
  const part1 = crypto.randomBytes(3).toString("hex").toUpperCase();
  const part2 = crypto.randomBytes(3).toString("hex").toUpperCase();
  const part3 = crypto.randomBytes(3).toString("hex").toUpperCase();

  return `AMIT-${part1}-${part2}-${part3}`;
}

// Home
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "My Key System API is working!"
  });
});

// Generate a key
app.post("/api/generate", (req, res) => {
  const days = Number(req.body.days || 30);

  if (!Number.isInteger(days) || days <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid expiry days"
    });
  }

  const key = generateKey();

  const expiresAt = Date.now() + days * 24 * 60 * 60 * 1000;

  keys.set(key, {
    active: true,
    expiresAt
  });

  res.json({
    success: true,
    key,
    expiresAt: new Date(expiresAt).toISOString()
  });
});

// Verify a key
app.get("/api/verify", (req, res) => {
  const key = String(req.query.key || "").trim();

  if (!key) {
    return res.status(400).json({
      success: false,
      valid: false,
      message: "Key is required"
    });
  }

  const data = keys.get(key);

  if (!data) {
    return res.json({
      success: true,
      valid: false,
      message: "Invalid key"
    });
  }

  if (!data.active) {
    return res.json({
      success: true,
      valid: false,
      message: "Key is disabled"
    });
  }

  if (Date.now() > data.expiresAt) {
    return res.json({
      success: true,
      valid: false,
      message: "Key has expired"
    });
  }

  res.json({
    success: true,
    valid: true,
    message: "Key is valid",
    expiresAt: new Date(data.expiresAt).toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
