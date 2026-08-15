const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Temporary test endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "My Key System API is working!"
  });
});

// Key verification endpoint
app.get("/api/verify", (req, res) => {
  const key = req.query.key;

  if (!key) {
    return res.status(400).json({
      success: false,
      message: "Key is required"
    });
  }

  // Temporary test key
  if (key === "TEST-12345") {
    return res.json({
      success: true,
      valid: true,
      message: "Key is valid"
    });
  }

  res.json({
    success: false,
    valid: false,
    message: "Invalid key"
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
