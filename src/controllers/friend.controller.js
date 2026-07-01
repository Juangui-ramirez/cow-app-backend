import FriendService from "../services/friend.service.js";

const FriendController = () => {
  const friendService = FriendService();

  const getAll = async (req, res) => {
    try {
      const userId = req.user.id;
      if (req.query.status === "pending") {
        const pending = await friendService.listPendingRequests(userId);
        return res.status(200).json(pending);
      }
      const friends = await friendService.listFriends(userId);
      return res.status(200).json(friends);
    } catch (error) {
      console.error("Error in getAll friends controller:", error);
      return res.status(500).json({ message: "Error fetching friends" });
    }
  };

  const create = async (req, res) => {
    try {
      const { email } = req.body;
      const userId = req.user.id;

      if (!email || typeof email !== "string" || !email.trim()) {
        return res.status(400).json({ message: "The field email is required" });
      }

      const { friendship, success, message, code } = await friendService.sendRequest(userId, email.trim());
      return res.status(code).json(success ? { friendship, message } : { message });
    } catch (error) {
      console.error("Error in create friend controller:", error);
      return res.status(500).json({ message: "Error sending friend request" });
    }
  };

  const accept = async (req, res) => {
    try {
      const userId = req.user.id;
      const { friendship, success, message, code } = await friendService.acceptRequest(Number(req.params.id), userId);
      return res.status(code).json(success ? { friendship, message } : { message });
    } catch (error) {
      console.error("Error in accept friend controller:", error);
      return res.status(500).json({ message: "Error accepting friend request" });
    }
  };

  const removeById = async (req, res) => {
    try {
      const userId = req.user.id;
      const { success, code, message } = await friendService.removeFriendship(Number(req.params.id), userId);
      if (success) {
        return res.status(204).send();
      }
      return res.status(code).json({ message });
    } catch (error) {
      console.error("Error in remove friend controller:", error);
      return res.status(500).json({ message: "Error removing friendship" });
    }
  };

  return {
    getAll,
    create,
    accept,
    removeById,
  };
};

export default FriendController;
