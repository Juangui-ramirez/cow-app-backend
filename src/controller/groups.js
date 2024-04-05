const groupService = require("../services/groups");

const getAll = (req, res) => {
  const sort = req.query.sort || "asc";
  const group = groupService.getAll(sort);
  res.json(group);
};

const get = (req, res) => {
  const groupName = req.params.name;
  const group = groupService.get(groupName);

  if (!group) {
    return res.status(404).json({ error: "Group not found" });
    return;
  }
  res.status(200).json(group);
  return;
};

const create = (req, res) => {
  const newGroup = req.body;
  const createdGroup = groupService.create(newGroup);

  if (!createdGroup) {
    res.status(400).json({ error: "Group already exists" });
    return;
  }

  res.status(201).json(createdGroup);
};

module.exports = {
  getAll,
  get,
  create,
};
