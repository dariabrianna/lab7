const router = require("express").Router();
const jwt    = require("jsonwebtoken");
require("dotenv").config();

/*  Body JSON:
    {
      "role": "ADMIN",
      "permissions": ["READ","WRITE"]
    }
*/
router.post("/", (req, res) => {
  const { role, permissions = [] } = req.body;
  const token = jwt.sign(
    { role, permissions },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES }
  );
  res.json({ token, expiresIn: process.env.JWT_EXPIRES });
});

module.exports = router;
