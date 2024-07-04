import GroupService from "../services/group.service.js";

const GroupController = () => {
  const groupService = GroupService();

  const getAll = async (req, res) => {
    try {
      const sort = req.query.sort || "desc";
      const userId = req.user.id; // Obtén userId del token JWT o de la sesión

      if (!userId) {
        return res.status(400).json({ message: "Invalid userId" });
      }

      const groups = await groupService.getAll(sort, userId); // Llama al servicio con userId
      return res.status(200).json(groups);
    } catch (error) {
      console.error("Error in getAll controller:", error);
      return res.status(500).json({ message: "Error fetching groups" });
    }
  };

  const getById = async (req, res) => {
    try {
      const group = await groupService.getById(Number(req.params.id));
      if (!group) {
        return res.status(404).json({ message: `Group with id ${req.params.id} doesn't exist` });
      }
      return res.status(200).json(group);
      
    } catch (error) {
      return res.status(500).json({ message: "Error fetching group" });
    }
    
  };

  const getByName = async (req, res) => {
    try {
      const groupName = req.params.name;
      const group = await groupService.getByName(groupName);
      if (!group) {
        return res.status(404).json({ error: `${groupName} not exist` });
      }
      return res.status(200).json(group);
    } catch (error) {
      return res.status(500).json({ message: "Error fetching group by name" });
    }
  };

  const create = async (req, res) => {
    try {
      const { name, color } = req.body;
      const ownerUserId = req.user.id; // Obtiene el ID del usuario autenticado desde req.user
  
      if (!name || !color) {
        return res.status(400).json({ message: "The fields name and color are required" });
      }
  
      if (typeof name !== "string" || !name.trim()) {
        return res.status(400).json({ message: "The field name should be a non-empty string" });
      }
  
      if (typeof color !== "string" || !color.trim()) {
        return res.status(400).json({ message: "The field color should be a non-empty string" });
      }
  
      const sanitizedBody = { name: name.trim(), color: color.trim(), ownerUserId };
      const { newGroup, success, message, code } = await groupService.create(sanitizedBody);
  
      return res.status(code).json(success ? { newGroup, message } : { message });
    } catch (error) {
      return res.status(500).json({ message: "Error creating group" });
    }
  };
  
  

  const editById = async (req, res) => {
    try {
      const updated = await groupService.editById(Number(req.params.id), req.body);
  
      if (updated.success) {
        return res.status(updated.code).json({ message: updated.message });
      }
      return res.status(updated.code).json({ message: updated.message });
    } catch (error) {
      return res.status(500).json({ message: "Error updating group" });
    }
  };
  

  const removeById = async (req, res) => {
    try {
      const removed = await groupService.removeById(Number(req.params.id));
      if (removed.success) {
        return res.status(204).send();
      }
    } catch (error) {
      return res.status(500).json({ message: "Error deleting group" });
    }
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
