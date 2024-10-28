import { User } from '../../model/user/userModel.js';

export const fetchUsersDetails = async () => {
  const users = await User.aggregate([
    {
      $match: {
        role: 'user'
      }
    },
    {
      $project: {
        _id: 1,
        email: 1
      }
    }
  ]);
  return users;
};
