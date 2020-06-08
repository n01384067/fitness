const { client } = require("../db/client");

async function createUser({ id, username, password }) {
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
      [id, username, password]
    );
    return user;
  } catch (error) {
    throw error;
  }
}

async function getAllUsers() {
  try {
    const { rows } = await client.query(`
      SELECT id, username 
      FROM users;
    `);
    return rows;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createUser,
  getAllUsers,
};
