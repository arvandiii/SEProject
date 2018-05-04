const mysql = require("promise-mysql");
const Promise = require("bluebird");

let conn = null;

const getConn = async () => {
  if (conn) {
    return conn;
  }
  const newConn = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "`",
    database: "ketabche"
  });
  conn = newConn;
  return conn;
};

const createUserTable = async () => {
  const c = await getConn();
  await c.query(`CREATE TABLE IF NOT EXISTS user (
      phoneNumber VARCHAR(30),
      passwordHash VARCHAR(200),
      firstName VARCHAR(30),
      lastName VARCHAR(30),
      email VARCHAR(30),
      notify BINARY,
      role VARCHAR(30),
      PRIMARY KEY (phoneNumber)
    );`);
  await c.query(`ALTER TABLE user MODIFY COLUMN firstName VARCHAR(255)
    CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL;`);
  await c.query(`ALTER TABLE user MODIFY COLUMN lastName VARCHAR(255)
  CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL;`);
  return "user table ok";
};

const addUser = async ({
  phoneNumber,
  passwordHash,
  firstName,
  lastName,
  email,
  notify
}) => {
  const c = await getConn();
  return c.query(
    `INSERT INTO user (phoneNumber, passwordHash, firstName, lastName, email, notify) 
        VALUES (\'${phoneNumber}\', \'${passwordHash}\', \'${firstName}\', \'${lastName}\', \'${email}\', ${notify});`
  );
};

const getUser = async ({ phoneNumber }) => {
  const c = await getConn();
  return c.query(`SELECT * FROM user where user.phoneNumber = ${phoneNumber};`);
};

const createBookTable = async () => {
  const c = await getConn();
  await c.query(`CREATE TABLE IF NOT EXISTS book (
      id MEDIUMINT NOT NULL AUTO_INCREMENT,
      name VARCHAR(30),
      author VARCHAR(30),
      cover VARCHAR(30),
      PRIMARY KEY (id)
    );`);
  await c.query(`ALTER TABLE book MODIFY COLUMN name VARCHAR(255)
    CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL;`);
  await c.query(`ALTER TABLE book MODIFY COLUMN author VARCHAR(255)
    CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL;`);
  const books = [
    {
      name: "مردی به نام اوه",
      cover: "1.png",
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
  ];
  await Promise.map(books, async b => {
    return // if needed remove this line
    const { name, author, cover } = b;
    return await c.query(`INSERT INTO book (name, author, cover) 
    VALUES (\'${name}\', \'${author}\', \'${cover}\');`);
  });
  return "book table ok";
};

const getBook = async ({ bookId }) => {
  const c = await getConn();
  return c.query(
    `SELECT * FROM book ${bookId ? `where book.id = ${bookId};` : ""}`
  );
};

module.exports = {
  createUserTable,
  addUser,
  getUser,
  createBookTable,
  getBook
};
