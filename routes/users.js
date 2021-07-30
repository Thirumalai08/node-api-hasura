const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
// importing User models
const User = require("../models/User");
// get api/users
// getting users
// public access
router.get("/users", (req, res) => res.send("User Route"));

// post api/users
// registering new user
// public access
router.post(
    "/users",
    [
        // checking validator
        check("name", "Name is required!!!").not().isEmpty(),
        check("email", "Please include a valid email !!!").isEmail(),
        check("password", "Please enter a password with 6 or more characters !!!").isLength({ min: 6 }),
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
        const { name, email, password } = req.body;
        try {
            // returning if user exists
            let user = await User.findOne({ email });
            if (user) {
                // bad req
                return res.status(400).json({ errors: [{ msg: "User with same email already exists !!!" }] });
            }
            user = new User({
                name,
                email,
                password,
            });
            // encrypt password
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            await user.save();
            // return token
            res.send("user register success");
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server Error");
        }
    }
);

module.exports = router;
