const express = require("express");
const router = express.Router();

// getting api users
router.get("/users", (req, res) => res.send("User Route"));

module.exports = router;
