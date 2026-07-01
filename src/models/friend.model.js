import connection from "../lib/connection.js";

const FriendModel = () => {
  const create = async (requesterUserId, addresseeUserId) => {
    const client = await connection.connect();
    try {
      const res = await client.query(
        "INSERT INTO friendships (requesterUserId, addresseeUserId, status, createdAt) VALUES ($1, $2, 'pending', NOW()) RETURNING *",
        [requesterUserId, addresseeUserId]
      );
      return res.rows[0];
    } finally {
      client.release();
    }
  };

  const findBetweenUsers = async (userIdA, userIdB) => {
    const client = await connection.connect();
    try {
      const res = await client.query(
        `SELECT * FROM friendships
         WHERE (requesteruserid = $1 AND addresseeuserid = $2)
            OR (requesteruserid = $2 AND addresseeuserid = $1)`,
        [userIdA, userIdB]
      );
      return res.rows[0];
    } finally {
      client.release();
    }
  };

  const findUnique = async (id) => {
    const client = await connection.connect();
    try {
      const res = await client.query("SELECT * FROM friendships WHERE id = $1", [id]);
      return res.rows[0];
    } finally {
      client.release();
    }
  };

  const findAcceptedForUser = async (userId) => {
    const client = await connection.connect();
    try {
      const res = await client.query(
        `SELECT f.id, f.status, f.createdat,
                u.id AS "friendId", u.name AS "friendName", u.email AS "friendEmail"
         FROM friendships f
         JOIN users u ON u.id = CASE
             WHEN f.requesteruserid = $1 THEN f.addresseeuserid
             ELSE f.requesteruserid
           END
         WHERE (f.requesteruserid = $1 OR f.addresseeuserid = $1)
           AND f.status = 'accepted'
         ORDER BY f.createdat DESC`,
        [userId]
      );
      return res.rows;
    } finally {
      client.release();
    }
  };

  const findPendingForUser = async (userId) => {
    const client = await connection.connect();
    try {
      const res = await client.query(
        `SELECT f.id, f.status, f.createdat,
                u.id AS "friendId", u.name AS "friendName", u.email AS "friendEmail"
         FROM friendships f
         JOIN users u ON u.id = f.requesteruserid
         WHERE f.addresseeuserid = $1
           AND f.status = 'pending'
         ORDER BY f.createdat DESC`,
        [userId]
      );
      return res.rows;
    } finally {
      client.release();
    }
  };

  const updateStatus = async (id, status) => {
    const client = await connection.connect();
    try {
      const res = await client.query(
        "UPDATE friendships SET status = $1 WHERE id = $2 RETURNING *",
        [status, id]
      );
      return res.rows[0];
    } finally {
      client.release();
    }
  };

  const removeById = async (id) => {
    const client = await connection.connect();
    try {
      const res = await client.query("DELETE FROM friendships WHERE id = $1", [id]);
      return res.rowCount > 0;
    } finally {
      client.release();
    }
  };

  return {
    create,
    findBetweenUsers,
    findUnique,
    findAcceptedForUser,
    findPendingForUser,
    updateStatus,
    delete: removeById,
  };
};

export default FriendModel;
