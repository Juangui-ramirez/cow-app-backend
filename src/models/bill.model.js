import connection from "../lib/connection.js";

const BillModel = () => {
  const create = async ({ groupId, description, amount, paidByUserId }) => {
    const client = await connection.connect();
    try {
      const res = await client.query(
        "INSERT INTO bills (groupId, description, amount, paidByUserId, createdAt) VALUES ($1, $2, $3, $4, NOW()) RETURNING *",
        [groupId, description, amount, paidByUserId]
      );
      return res.rows[0];
    } finally {
      client.release();
    }
  };

  const findUnique = async (id) => {
    const client = await connection.connect();
    try {
      const res = await client.query("SELECT * FROM bills WHERE id = $1", [id]);
      return res.rows[0];
    } finally {
      client.release();
    }
  };

  const findByGroup = async (groupId) => {
    const client = await connection.connect();
    try {
      const res = await client.query(
        "SELECT * FROM bills WHERE groupid = $1 ORDER BY createdat DESC",
        [groupId]
      );
      return res.rows;
    } finally {
      client.release();
    }
  };

  const removeById = async (id) => {
    const client = await connection.connect();
    try {
      const res = await client.query("DELETE FROM bills WHERE id = $1", [id]);
      return res.rowCount > 0;
    } finally {
      client.release();
    }
  };

  return { create, findUnique, findByGroup, delete: removeById };
};

export default BillModel;
