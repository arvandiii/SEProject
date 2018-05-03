const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "/index.html"));
});

app.post("/", function(req, res) {
  console.log(req.body);
  res.send("ok");
});

app.listen(3000, function() {
  console.log("Example app listening on port 3000!");
});
