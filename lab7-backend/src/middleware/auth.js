const jwt = require("jsonwebtoken");
require("dotenv").config();

function auth(requiredPerms = []) {
  return (req, res, next) => {
    const header = req.headers.authorization || "";
    const token  = header.replace("Bearer ", "");
    if (!token) return res.status(401).json({ error: "No token" });

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      // roles OR permissions
      if (requiredPerms.length) {
        const ok = requiredPerms.every(p =>
          (payload.permissions || []).includes(p) ||
          p === payload.role
        );
        if (!ok) return res.status(403).json({ error: "Forbidden" });
      }
      req.user = payload;
      next();
    } catch (e) {
      res.status(401).json({ error: "Invalid / expired token" });
    }
  };
}

module.exports = auth;
