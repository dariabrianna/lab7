// src/index.js
const express = require("express");
const cors    = require("cors");
require("dotenv").config();

const app = express();

// 1) Middleware CORS
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3004"],
  })
);

// 2) Middleware JSON
app.use(express.json());

// 3) Swagger UI (opțional)
require("./swagger")(app);

// 4) Rutele tale
app.use("/token",  require("./routes/auth"));   // <– aici e ruta POST /token
app.use("/boards", require("./routes/boards"));
app.use("/cards",  require("./routes/cards"));
app.use("/tasks",  require("./routes/tasks"));

// 5) Pornire server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API on http://localhost:${PORT}`);
});
