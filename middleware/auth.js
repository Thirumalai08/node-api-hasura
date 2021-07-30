const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
    // getting token from header
    const token = req.header("x-auth-token");
    // check whether it is token
    if (!token) {
        return res.status(401).json({ msg: "No Token!. Authorization Denied" });
    }
    // verify token
    try {
        const decoded = jwt.verify(token, config.get("jwtSecret"));
        req.user = decoded.user;
        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({
            msg: "Token is not valid",
        });
    }
};
