const express = require("express");
const cors = require("cors");
const path = require("path");
const port = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + '/views/index.html'));
});

app.listen(port);
