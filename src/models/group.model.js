import connection from "../lib/connection.js";

const GroupModel = (initialEntities) => {
  const entities = initialEntities || [];

  const findUnique = async (id) => {
    const client = await connection.connect();

    const res = await client.query("SELECT  * FROM groups WHERE id = $1", [id]);

    client.release();

    return res.rows[0];
  };

  const findMany = async (sort) => {
    const client = await connection.connect();

    let query = "SELECT * FROM groups";
    if (sort === "desc") {
      query += " ORDER BY createdAt DESC";
    }

    const res = await client.query(query);
    client.release();
    return res.rows;
  };

  const findByName = async (name) => {
    const client = await connection.connect();
    const res = await client.query(
      "SELECT * FROM groups WHERE name = $1",[name]
    );
    client.release();
    return res.rows.length > 0 ? res.rows[0] : null;
  };

  const create = async (entity) => {
    const client = await connection.connect();

    const res = await client.query(
      "INSERT INTO groups (name, color, ownerUserid, createdAt) VALUES ($1, $2, $3, NOW())", [entity.name, entity.color, 1]);

    client.release();

    return res.rows[0];
  };

  const removeById = async (id) => {
    const client = await connection.connect();

    const res = await client.query("DELETE FROM groups WHERE id = $1", [id]);

    client.release();

    return res.rowCount > 0;
  };

  const update = async (id, newEntity) => {
    const client = await connection.connect();

    const res = await client.query(
      "UPDATE groups SET name = $1, color = $2 WHERE id = $3", [newEntity.name, newEntity.color, id]);

    client.release();

    return res.rowCount > 0;
  };

  return {
    findUnique,
    findMany,
    create,
    delete: removeById,
    update,
    findByName
  };
};

export default GroupModel;
