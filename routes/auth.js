const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// importing config
const config = require("config");
// importing User models
const User = require("../models/User");
// middleware custom auth
const auth = require("../middleware/auth");

// get api/auth
// test route authenticates specific user
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

// post api/login or api/auth
// login user with authenticate token
// public access
router.post(
    "/login",
    [
        // checking validator
        check("email", "Please include a valid email !!!").isEmail(),
        check("password", "Password required !!!").exists(),
    ],
    async (req, res) => {
        // consoling request body
        console.log(req.body);
        // validation result
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // 400 bad req
            return res.status(400).json({ errors: errors.array() });
        }
        // destructing our request body
        const { email, password } = req.body;
        try {
            // returning if user exists
            let user = await User.findOne({ email });
            if (!user) {
                // bad req
                return res.status(400).json({ errors: [{ msg: "User Not found" }] });
            }
            // password checking
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                // bad req
                return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
            }
            // return token
            const payload = {
                // because mongoDB has _id
                user: {
                    id: user._id,
                },
            };
            // jwt sign
            jwt.sign(payload, config.get("jwtSecret"), { expiresIn: 36000 }, (err, token) => {
                if (err) throw err;
                res.json({ token });
            });
            // res.send("user register success");
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server Error");
        }
    }
);

module.exports = router;
