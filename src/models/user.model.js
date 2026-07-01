import connection from "../lib/connection.js";
import bcrypt from "bcrypt";

const UserModel = () => {
  const findMany = async (sort) => {
    const client = await connection.connect();
    try {
      let query = "SELECT * FROM users";
      if (sort === "desc") {
        query += " ORDER BY createdAt DESC";
      }

      const res = await client.query(query);
      return res.rows;
    } finally {
      client.release();
    }
  };

  const create = async (user) => {
    const client = await connection.connect();
    try {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const { name, email } = user;
      const result = await client.query(
        "INSERT INTO Users (name, email, password, createdAt) VALUES ($1, $2, $3, NOW()) RETURNING *",
        [name, email, hashedPassword]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  };

  const getById = async (id) => {
    const client = await connection.connect();
    try {
      const result = await client.query("SELECT * FROM Users WHERE id = $1", [id]);
      return result.rows[0];
    } finally {
      client.release();
    }
  };

  const getByEmail = async (email) => {
    const client = await connection.connect();
    try {
      const result = await client.query("SELECT * FROM Users WHERE email = $1", [email]);
      return result.rows[0];
    } finally {
      client.release();
    }
  };

  return {
    findMany,
    create,
    getById,
    getByEmail,
  };
};

export default UserModel;
