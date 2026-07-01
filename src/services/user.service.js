import UserModel from "../models/user.model.js";

const UserService = () => {
  const userModel = UserModel();

  const getAll = async (sort) => {
    return await userModel.findMany(sort);
  };

  const getById = async (id) => {
    return await userModel.getById(id);
  };

  const getByEmail = async (email) => {
    return await userModel.getByEmail(email);
  };

  const create = async (newUser) => {
    const createdUser = await userModel.create(newUser);

    return {
      newUser: createdUser,
      success: true,
      message: "User created successfully",
      code: 201,
    };
  };

  return {
    getAll,
    getById,
    getByEmail,
    create,
  };
};

export default UserService;
