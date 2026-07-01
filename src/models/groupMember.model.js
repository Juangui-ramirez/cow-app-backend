import connection from "../lib/connection.js";

const GroupMemberModel = () => {
  const add = async (groupId, userId) => {
    const client = await connection.connect();
    try {
      const res = await client.query(
        "INSERT INTO group_members (groupId, userId, joinedAt) VALUES ($1, $2, NOW()) ON CONFLICT (groupId, userId) DO NOTHING RETURNING *",
        [groupId, userId]
      );
      return res.rows[0];
    } finally {
      client.release();
    }
  };

  const findByGroup = async (groupId) => {
    const client = await connection.connect();
    try {
      const res = await client.query(
        `SELECT gm.userid AS "userId", u.name, u.email
         FROM group_members gm
         JOIN users u ON u.id = gm.userid
         WHERE gm.groupid = $1
         ORDER BY gm.joinedat ASC`,
        [groupId]
      );
      return res.rows;
    } finally {
      client.release();
    }
  };

  const isMember = async (groupId, userId) => {
    const client = await connection.connect();
    try {
      const res = await client.query(
        "SELECT 1 FROM group_members WHERE groupid = $1 AND userid = $2",
        [groupId, userId]
      );
      return res.rowCount > 0;
    } finally {
      client.release();
    }
  };

  const remove = async (groupId, userId) => {
    const client = await connection.connect();
    try {
      const res = await client.query(
        "DELETE FROM group_members WHERE groupid = $1 AND userid = $2",
        [groupId, userId]
      );
      return res.rowCount > 0;
    } finally {
      client.release();
    }
  };

  return { add, findByGroup, isMember, remove };
};

export default GroupMemberModel;
