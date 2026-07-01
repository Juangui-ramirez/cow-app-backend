import connection from "../lib/connection.js";

const BillSplitModel = () => {
  const createMany = async (billId, splits) => {
    const client = await connection.connect();
    try {
      const values = [];
      const placeholders = splits.map((split, index) => {
        const base = index * 3;
        values.push(billId, split.userId, split.amountOwed);
        return `($${base + 1}, $${base + 2}, $${base + 3})`;
      });

      const res = await client.query(
        `INSERT INTO bill_splits (billId, userId, amountOwed) VALUES ${placeholders.join(", ")} RETURNING *`,
        values
      );
      return res.rows;
    } finally {
      client.release();
    }
  };

  const findByBill = async (billId) => {
    const client = await connection.connect();
    try {
      const res = await client.query(
        `SELECT bs.id, bs.billid AS "billId", bs.userid AS "userId", bs.amountowed AS "amountOwed", bs.settled,
                u.name, u.email
         FROM bill_splits bs
         JOIN users u ON u.id = bs.userid
         WHERE bs.billid = $1`,
        [billId]
      );
      return res.rows;
    } finally {
      client.release();
    }
  };

  const findUnique = async (id) => {
    const client = await connection.connect();
    try {
      const res = await client.query("SELECT * FROM bill_splits WHERE id = $1", [id]);
      return res.rows[0];
    } finally {
      client.release();
    }
  };

  const settle = async (id) => {
    const client = await connection.connect();
    try {
      const res = await client.query(
        "UPDATE bill_splits SET settled = TRUE WHERE id = $1 RETURNING *",
        [id]
      );
      return res.rows[0];
    } finally {
      client.release();
    }
  };

  const summaryForUser = async (userId) => {
    const client = await connection.connect();
    try {
      const owedByYou = await client.query(
        `SELECT COALESCE(SUM(bs.amountowed), 0) AS total
         FROM bill_splits bs
         WHERE bs.userid = $1 AND bs.settled = FALSE`,
        [userId]
      );

      const owedToYou = await client.query(
        `SELECT COALESCE(SUM(bs.amountowed), 0) AS total
         FROM bill_splits bs
         JOIN bills b ON b.id = bs.billid
         WHERE b.paidbyuserid = $1 AND bs.userid != $1 AND bs.settled = FALSE`,
        [userId]
      );

      return {
        youOwe: Number(owedByYou.rows[0].total),
        youAreOwed: Number(owedToYou.rows[0].total),
      };
    } finally {
      client.release();
    }
  };

  return { createMany, findByBill, findUnique, settle, summaryForUser };
};

export default BillSplitModel;
