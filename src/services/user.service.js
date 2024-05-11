import  UserModel  from '../models/user.model.js';

const UserService = () => {
    const userModel = UserModel();

    const getAll = async () => {
        const users = await userModel.findMany();
       
        return users;
      };

  const getById = (id) => {

    return userModel.getById(id);
  };

  const create = async (newUser) => {
    const createdUser = await userModel.create(newUser);

    return {
      newUser: createdUser,
      success: true,
      message: 'User created successfully',
      code: 201,
    };
  };

  const getByEmail = (email) => {
    return userModel.getByEmail(email);
  };

  return {
    getAll,
    getById,
    create,
    getByEmail,
  };
};

export default UserService ;