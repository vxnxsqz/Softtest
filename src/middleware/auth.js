const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET || "software-testing-secret";

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "TOKEN_REQUIRED", message: "Bearer token is required" });
  }
  try {
    req.user = jwt.verify(authHeader.split(" ")[1], SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "INVALID_TOKEN", message: "Token is invalid or expired" });
  }
}
module.exports = { authenticate, SECRET };
