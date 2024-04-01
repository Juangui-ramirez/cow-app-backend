const groupService = require("../services/groups");

const getAll = (req, res) => {
  const group = groupService.getAll();
  res.json(group);
};

const get = (req, res) => {
  const groupName = req.params.name;
  const group = groupService.get(groupName);

  if (!group) {
    res.status(404);
    return;
  }
  res.status(200).json(group);
};

const create = (req, res) => {
    const newGroup = req.body;
    const createdGroup = groupService.create(newGroup);
    res.status(201).json(createdGroup)
};

module.exports = {
  getAll,
  get,
  create
};
