const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const { createUserTable, addUser } = require("./db");
const { hash } = require("./utils");

createUserTable().then(console.log);

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res) {
  return res.render("main.ejs", {
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
  return res.render("signIn.ejs", { message: null });
});
app.get("/signUp", function(req, res) {
  return res.render("signUp.ejs");
});
app.get("/aboutUs", function(req, res) {
  return res.render("aboutUs.ejs");
});

app.post("/signUp", async function(req, res) {
  const {
    firstName,
    lastName,
    phoneNumber,
    password,
    "notify-via-email": notify,
    email
  } = req.body;
  try {
    await addUser({
      phoneNumber,
      passwordHash: hash(password),
      firstName,
      lastName,
      email,
      notify: notify === "on" ? true : false
    });
  } catch (error) {
    if (error.message.includes("ER_DUP_ENTRY")) {
      return res.render("signIn.ejs", {
        message: {
          header: "شما قبلا ثبت نام کرده اید",
          body: "وارد شوید",
          alert: "negative"
        }
      });
    }
  }
  return res.render("signIn.ejs", {
    message: {
      header: "ثبت نام شما با موفقبت انجام شد",
      body: "وارد شوید",
      alert: "positive"
    }
  });
});

app.post("/", async function(req, res) {
  console.log("inja inja", req.body);
  res.send("ok");
});

app.listen(3000, function() {
  console.log("Example app listening on port 3000!");
});
