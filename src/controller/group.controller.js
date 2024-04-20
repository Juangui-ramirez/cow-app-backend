import GroupService from "../services/group.service.js";

const GroupController = () => {
  const groupService = GroupService();

  const getAll = async (req, res) => {
    const sort = req.query.sort || "asc";
    const groups = groupService.getAll(sort);

    return res.status(200).json(groups);
  };

  const getById = async (req, res) => {
    const group = groupService.getById(Number(req.params.id));

    if (!group) {
      return res
        .status(404)
        .json({ message: `Group with id ${req.params.id} doesn't exist` });
    }

    return res.status(200).json(group);
  };

  const getByName = async (req, res) => {
    const groupName = req.params.name;
    const group = groupService.getByName(groupName);

    if (!group) {
      return res.status(404).json({ error: `${groupName} not exist` });
    }
    res.status(200).json(group);
    return;
  };

  const create = async (req, res) => {
    const { name, color } = req.body;

    if (!name || !color) {
      return res.status(400).json({
        message: "The field name is missing",
      });
    }

    if (typeof name !== "string") {
      return res.status(400).json({
        message: "The field name should be a string",
      });
    }

    if (!name.trim()) {
      return res.status(400).json({
        message: "The field name can not be empty",
      });
    }

    if (typeof color !== "string") {
      return res.status(400).json({
        message: "The field color should be a string",
      });
    }

    if (!color.trim()) {
      return res.status(400).json({
        message: "The field color can not be empty",
      });
    }

    const currentDate = new Date().toLocaleDateString("en-GB");

    // creating our own body only with the fields we really need (name & color only)
    // doing this we discard the rest of the fields we may receive in the body
    const sanitizedBody = {
      name: name.trim(),
      color: color.trim(),
      createdAt: currentDate,
    };

    const { newGroup, success, message, code } =
      groupService.create(sanitizedBody);

    if (success) {
      return res.status(code).json(newGroup);
    } else {
      return res.status(code).json(message);
    }
  };

  const editById = async (req, res) => {
    const updated = groupService.editById(Number(req.params.id), req.body);

    if (updated) {
      return res.status(204).send();
    }
    return res.status(404).json({
      message: `Group with id ${req.params.id} does not exist`,
    });
  };

  const removeById = async (req, res) => {
    const removed = groupService.removeById(Number(req.params.id));

    if (removed) {
      return res.status(204).send();
    }
    return res.status(404).json({
      message: `Group with id ${req.params.id} does not exist`,
    });
  };

  return {
    getById,
    getAll,
    getByName,
    create,
    editById,
    removeById,
  };
};

export default GroupController;
