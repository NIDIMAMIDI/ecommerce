import { LoginHistory } from '../../model/loginHistory/loginHistoryModel.js';

export const userCreate = async (User, loweredEmail, hashedPassword, role) => {
  const newUser = await User.create({
    email: loweredEmail,
    password: hashedPassword,
    role
  });
  return newUser;
};

export const storeLoginHistory = async (userId, token) => {
  await LoginHistory.create({
    userId,
    token
  });
};
