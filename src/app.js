const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const {
  createUserTable,
  addUser,
  getUser,
  createBookTable,
  getBook
} = require("./db");
const { hash } = require("./utils");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const _ = require("underscore");

const SECRET = "salam";

createUserTable().then(console.log);
createBookTable().then(console.log);

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(async (req, res, next) => {
  const { cookies } = req;
  const { token } = cookies;
  try {
    const { phoneNumber } = jwt.verify(token, SECRET);
    const [user] = await getUser({ phoneNumber });
    const { firstName, lastName, email, role } = user;
    req.user = {
      phoneNumber,
      firstName,
      lastName,
      email,
      role: role || "user"
    };
  } catch (error) {
    req.user = null;
  }
  next();
});

app.get("/", async function(req, res) {
  const { user } = req;
  const books = await getBook({});
  console.log("inja", user, books);
  return res.render("main.ejs", {
    books,
    user
  });
});

app.get("/signIn", async function(req, res) {
  return res.render("signIn.ejs", { message: null, user: null });
});
app.get("/signUp", function(req, res) {
  return res.render("signUp.ejs", { user: null });
});
app.get("/aboutUs", function(req, res) {
  return res.render("aboutUs.ejs", { user: null });
});

app.get("/book/:bookId", async function(req, res) {
  const { bookId } = req.params;
  const { user } = req;
  const [book] = await getBook({ bookId });
  // console.log(bookId, book);
  return res.render("book.ejs", {
    book,
    user
  });
});

app.post("/signIn", async function(req, res) {
  const { phoneNumber, password } = req.body;
  const [user] = await getUser({ phoneNumber });
  if (!user) {
    return res.render("signIn.ejs", {
      message: {
        header: "شما قبلا ثبت نام نکرده اید",
        body: "ثبت نام کنید",
        alert: "negative"
      },
      user: null
    });
  }
  const { passwordHash } = user;
  if (passwordHash === hash(password)) {
    const token = jwt.sign({ phoneNumber }, SECRET);
    return res.cookie("token", token).redirect("/");
  }
  return res.render("signIn.ejs", {
    message: {
      header: "رمز عبور شما اشتباه است",
      body: "دوباره تلاش کنید",
      alert: "negative"
    },
    user: null
  });
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
        },
        user: null
      });
    }
    console.log(error);
  }
  return res.render("signIn.ejs", {
    message: {
      header: "ثبت نام شما با موفقبت انجام شد",
      body: "وارد شوید",
      alert: "positive"
    },
    user: null
  });
});

app.get("/admin", async function(req, res) {
  const { user } = req;
  if (user.role === "admin") {
    return res.render("adminPanel.ejs", {
      user
    });
  }
  return res.send("permission denied");
});

app.get("/cookie", async function(req, res) {
  res.cookie("token", "cookie_value").send("ok");
});

app.get("/cc", function(req, res) {
  res.clearCookie("token").send("Cookie deleted");
});

app.listen(3000, function() {
  console.log("Example app listening on port 3000!");
});
