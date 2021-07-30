const express = require("express");
const router = express.Router();
// importing User models
const User = require("../models/User");
// middleware custom auth
const auth = require("../middleware/auth");

// get api/auth
// test route
// private access
router.get("/auth", auth, async (req, res) => {
    try {
        const user = await User.findOneById(req.user.id).select("-password");
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});
