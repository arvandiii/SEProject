const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res) {
  res.render("main.ejs", {
    books: [
      {
        name: "مردی به نام اوه",
        cover: "a_man_called_ove.png",
        author: "فردریک بکمن"
      },
      {
        name: "مردی به نام اوه",
        cover: "a_man_called_ove.png",
        author: "فردریک بکمن"
      },
      {
        name: "مردی به نام اوه",
        cover: "a_man_called_ove.png",
        author: "فردریک بکمن"
      },
      {
        name: "مردی به نام اوه",
        cover: "a_man_called_ove.png",
        author: "فردریک بکمن"
      },
      {
        name: "مردی به نام اوه",
        cover: "a_man_called_ove.png",
        author: "فردریک بکمن"
      },
      {
        name: "مردی به نام اوه",
        cover: "a_man_called_ove.png",
        author: "فردریک بکمن"
      },
      {
        name: "مردی به نام اوه",
        cover: "a_man_called_ove.png",
        author: "فردریک بکمن"
      },
      {
        name: "مردی به نام اوه",
        cover: "a_man_called_ove.png",
        author: "فردریک بکمن"
      }
    ]
  });
});

app.get("/signIn", function(req, res) {
  res.render("signIn.ejs");
});
app.get("/signUp", function(req, res) {
  res.render("signUp.ejs");
});
app.get("/aboutUs", function(req, res) {
  res.render("aboutUs.ejs");
});

app.post("/", function(req, res) {
  console.log(req.body);
  res.send("ok");
});

app.listen(3000, function() {
  console.log("Example app listening on port 3000!");
});
