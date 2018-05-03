const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();
app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/main", function(req, res) {
  res.render("main.ejs");
});

app.get("/signIn", function(req, res) {
  res.render(path.join(__dirname, "templates", "signIn.ejs"));
});
app.get("/signUp", function(req, res) {
  res.render(path.join(__dirname, "templates", "signUp.ejs"));
});
app.get("/aboutUs", function(req, res) {
  res.render(path.join(__dirname, "templates", "aboutUs.ejs"));
});

app.post("/", function(req, res) {
  console.log(req.body);
  res.send("ok");
});

app.listen(3000, function() {
  console.log("Example app listening on port 3000!");
});
