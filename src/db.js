const mysql = require("promise-mysql");

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
  return c.query(`CREATE TABLE IF NOT EXISTS user (
      phoneNumber VARCHAR(30),
      passwordHash VARCHAR(200),
      firstName VARCHAR(30),
      lastName VARCHAR(30),
      email VARCHAR(30),
      notify BINARY,
      PRIMARY KEY (phoneNumber)
    );`);
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

module.exports = { createUserTable, addUser };
