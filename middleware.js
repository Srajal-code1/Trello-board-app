const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
    const token = req.headers.token;  // valid jwt token

    try {
        const decoded = jwt.verify(token, "attlasiansupersecret123123password");
        const userId = decoded.userId;
        if(userId) {
            req.userId = userId;
            next();
            return;
        }
    } catch (e) {
        // missing or invalid token -> fall through to 403
    }

    res.status(403).json({
        msg: "Token was incorrect"
    })
}

module.exports = {
    authMiddleware: authMiddleware
}