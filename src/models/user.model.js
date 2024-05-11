import connection from "../lib/connection.js";
import bcrypt from "bcrypt";

const UserModel = () => {

    const findMany = async (sort) => {
        const client = await connection.connect();
    
        let query = "SELECT * FROM users";
        if (sort === "desc") {
          query += " ORDER BY createdAt DESC";
        }
    
        const res = await client.query(query);
        return res.rows;
      };

  const create = async (user) => {
    const client = await connection.connect();
    user.password = await bcrypt.hash(user.password, 10);
    const { name, email, password } = user;
    const result = await client.query(
      "INSERT INTO Users (name, email, password, createdAt) VALUES ($1, $2, $3, NOW())",
      [name, email, password]
    );
    client.release();
    return result.rows[0];
  };

  const getById = async (id) => {
    const client = await connection.connect();

    const result = await client.query("SELECT * FROM Users WHERE id = $1", [
      id,
    ]);

    client.release();

    return result.rows[0];
  };

  const getByEmail = async (email) => {
    const client = await connection.connect();

    const result = await client.query("SELECT * FROM Users WHERE email = $1", [
      email,
    ]);

    client.release();

    return result.rows[0];
  };

  return {
    findMany,
    create,
    getById,
    getByEmail,
  };
};

export default UserModel ;