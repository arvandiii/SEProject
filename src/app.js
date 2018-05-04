const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const { createUserTable, addUser, getUser } = require("./db");
const { hash } = require("./utils");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const SECRET = "salam";

createUserTable().then(console.log);

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
      role
    };
  } catch (error) {
    req.user = null;
  }
  next();
});

app.get("/", function(req, res) {
  const { user } = req;
  console.log("inja", user);
  return res.render("main.ejs", {
    books: [
      {
        name: "مردی به نام اوه",
        cover: "a_man_called_ove.png",
        author: "فردریک بکمن"
      },
      {
        name: "معلم پیانو",
        cover: "8470.png",
        author: "چیستا یثربی"
      },
      {
        name: "شازده کوچولو",
        cover: "6426.png",
        author: "آنتوان دو سنت اگزوپری"
      },
      {
        name: "دختری که رهایش کردی",
        cover: "13998.png",
        author: "جوجو مویز"
      }
    ],
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
  return res.
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
