const express = require("express");
const usersRouter = express.Router();

usersRouter.use((req, res, next) => {
  console.log("A request is being made to /users");

  next();
});

usersRouter.get("/", (req, res) => {
  res.send({
    users: [],
  });
});

async function createUser({ username, password }) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
        INSERT INTO users(id, username, password)
        VALUES($1, $2, $3)
        ON CONFLICT (username) DO NOTHING
        RETURNING *;
        `,
      [username, password]
    );
    return user;
  } catch (error) {
    throw error;
  }
}

async function getUser(username) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
          SELECT *
          FROM users
          WHERE username=$2
        `,
      [username]
    );
    return user;
  } catch (error) {
    throw error;
  }
}

module.exports = usersRouter;
