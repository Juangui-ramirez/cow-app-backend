import FriendModel from "../models/friend.model.js";
import UserModel from "../models/user.model.js";

const FriendService = () => {
  const friendModel = FriendModel();
  const userModel = UserModel();

  const sendRequest = async (requesterUserId, addresseeEmail) => {
    const addressee = await userModel.getByEmail(addresseeEmail);

    if (!addressee) {
      return { success: false, message: "User not found", code: 404 };
    }

    if (addressee.id === requesterUserId) {
      return { success: false, message: "You cannot add yourself as a friend", code: 400 };
    }

    const existing = await friendModel.findBetweenUsers(requesterUserId, addressee.id);
    if (existing) {
      return { success: false, message: "Friend request already exists", code: 400 };
    }

    const friendship = await friendModel.create(requesterUserId, addressee.id);
    return { friendship, success: true, message: "Friend request sent", code: 201 };
  };

  const listFriends = async (userId) => {
    return await friendModel.findAcceptedForUser(userId);
  };

  const listPendingRequests = async (userId) => {
    return await friendModel.findPendingForUser(userId);
  };

  const acceptRequest = async (id, userId) => {
    const friendship = await friendModel.findUnique(id);

    if (!friendship) {
      return { success: false, message: "Friend request not found", code: 404 };
    }

    if (friendship.addresseeuserid !== userId) {
      return { success: false, message: "You cannot accept this request", code: 403 };
    }

    const updated = await friendModel.updateStatus(id, "accepted");
    return { friendship: updated, success: true, message: "Friend request accepted", code: 200 };
  };

  const removeFriendship = async (id, userId) => {
    const friendship = await friendModel.findUnique(id);

    if (!friendship) {
      return { success: false, message: "Friend request not found", code: 404 };
    }

    if (friendship.requesteruserid !== userId && friendship.addresseeuserid !== userId) {
      return { success: false, message: "You cannot remove this friendship", code: 403 };
    }

    const removed = await friendModel.delete(id);
    return { success: removed, code: removed ? 204 : 500 };
  };

  return {
    sendRequest,
    listFriends,
    listPendingRequests,
    acceptRequest,
    removeFriendship,
  };
};

export default FriendService;
