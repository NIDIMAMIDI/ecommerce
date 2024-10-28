import { fetchUsersDetails } from '../../helpers/admin/adminHelpers.js';
import { MultipleProductsOrder } from '../../model/order/multipleProductsOrder.js';
import { Profile } from '../../model/profile/profileModel.js';
import { User } from '../../model/user/userModel.js';

// Get all the Users in the collection by admin
export const getAllUsers = async (req, res, next) => {
  try {
    // Fetch all the usersIds and emails
    const users = await fetchUsersDetails();

    // If Users count is 0 return error
    if (users.length === 0) {
      return res.status(500).json({
        status: 'failure',
        message: 'Collection does not contains any users'
      });
    }

    // success response
    res.status(200).json({
      message: 'success',
      usersCount: users.length,
      usersData: {
        users
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'failure',
      message: err.message
    });
  }
};

// Delete a user in the collection by admin
export const deleteUser = async (req, res, next) => {
  try {
    // Fetch userId from the req.params
    const { userId } = req.params;

    // Fetch the user with his userId
    const user = await User.findById(userId);

    // If user not found throw error
    if (!user) {
      return res.status(500).json({
        status: 'failure',
        message: 'User does not found with this userId'
      });
    }

    // If user present delete the user data
    await User.findByIdAndDelete(userId);
    // Delete the profile data of that respected user.
    await Profile.deleteOne({ userId: userId });

    await MultipleProductsOrder.deleteOne({ userId: userId });

    // Response
    res.status(200).json({
      status: 'success',
      message: 'User Data is deleted Successfully'
    });
  } catch (err) {
    res.status(500).json({
      status: 'failure',
      message: err.message
    });
  }
};
