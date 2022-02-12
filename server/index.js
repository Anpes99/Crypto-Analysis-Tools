const express = require("express");
const app = express();
require("dotenv").config();
const path = require("path");
app.use(express.static("build"));
const port = process.env.PORT;

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
