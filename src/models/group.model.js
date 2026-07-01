import connection from "../lib/connection.js";

const GroupModel = () => {
  const findUnique = async (id) => {
    const client = await connection.connect();
    try {
      const res = await client.query("SELECT * FROM groups WHERE id = $1", [id]);
      return res.rows[0];
    } finally {
      client.release();
    }
  };

  const findMany = async (sort, userId) => {
    const client = await connection.connect();
    try {
      // Lists every group the user belongs to (not just ones they own), and
      // includes how much they currently owe in each one so the frontend
      // doesn't need one request per group card.
      let query = `
        SELECT g.*,
          COALESCE(SUM(bs.amountowed) FILTER (WHERE bs.userid = $1 AND bs.settled = FALSE), 0) AS totalowed
        FROM groups g
        JOIN group_members gm ON gm.groupid = g.id AND gm.userid = $1
        LEFT JOIN bills b ON b.groupid = g.id
        LEFT JOIN bill_splits bs ON bs.billid = b.id
        GROUP BY g.id
      `;
      if (sort === "desc") {
        query += " ORDER BY g.createdat DESC";
      }

      const res = await client.query(query, [userId]);
      return res.rows;
    } finally {
      client.release();
    }
  };

  const findByName = async (name) => {
    const client = await connection.connect();
    try {
      const res = await client.query("SELECT * FROM groups WHERE name = $1", [name]);
      return res.rows[0] || null;
    } finally {
      client.release();
    }
  };

  const create = async (entity) => {
    const client = await connection.connect();
    try {
      const res = await client.query(
        "INSERT INTO groups (name, color, ownerUserId, createdAt) VALUES ($1, $2, $3, NOW()) RETURNING *",
        [entity.name, entity.color, entity.ownerUserId]
      );
      return res.rows[0];
    } finally {
      client.release();
    }
  };

  const removeById = async (id) => {
    const client = await connection.connect();
    try {
      const res = await client.query("DELETE FROM groups WHERE id = $1", [id]);
      return res.rowCount > 0;
    } finally {
      client.release();
    }
  };

  const update = async (id, newEntity) => {
    const client = await connection.connect();
    try {
      const res = await client.query(
        "UPDATE groups SET name = $1, color = $2 WHERE id = $3",
        [newEntity.name, newEntity.color, id]
      );
      return res.rowCount > 0;
    } finally {
      client.release();
    }
  };

  return {
    findUnique,
    findMany,
    create,
    delete: removeById,
    update,
    findByName,
  };
};

export default GroupModel;
