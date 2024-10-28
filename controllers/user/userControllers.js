import { User } from '../../model/user/userModel.js';
import { Profile } from '../../model/profile/profileModel.js';
import { createCustomer } from '../../helpers/stripe/stripeHelper.js';

//   Get all the Users in the collection

export const getUsers = async (req, res, next) => {
  try {
    // Fetching users in the collection
    const users = await User.find();

    // Success Response
    res.status(200).json({
      status: 'success',
      count: users.length,
      data: {
        users
      }
    });
  } catch (err) {
    // Error Response
    res.status(500).json({
      status: 'failure',
      message: err.message
    });
  }
};

//   Creating the profile for the user

export const createProfile = async (req, res, next) => {
  try {
    // Extract userId details from authorization middleware
    const userId = req.user.id;

    // Fetching profile details from the Profile collection by userId
    const existingProfile = await Profile.findOne({ userId });

    // Check if a profile already exists for the user then show Error Response
    if (existingProfile) {
      return res.status(400).json({
        status: 'failure',
        message: 'Profile already exists for this user'
      });
    }

    // Extract profile data from req.body
    const { firstName, lastName, email, bio } = req.body;

    // creating stripe customer
    const customer = await createCustomer(email, `${firstName} ${lastName}`);

    // Create a new profile using the Profile model
    const profile = await Profile.create({
      userId,
      firstName,
      lastName,
      email,
      bio,
      customerId: customer.id
    });

    // Respond with success message and created profile data
    res.status(201).json({
      status: 'success',
      profileCreatedData: {
        profile
      }
    });
  } catch (err) {
    // Handle any errors that occur during profile creation
    res.status(500).json({
      status: 'failure',
      message: err.message
    });
  }
};

//   Edit the profile for the user

export const editProfille = async (req, res, next) => {
  try {
    // Extract userId details from authorization middleware
    const userId = req.user.id;

    // Extract updated profile data from req.body
    const { firstName, lastName, bio } = req.body;

    // Update the profile with the provided profileId
    const updatedProfile = await Profile.findOneAndUpdate(
      { userId },
      { firstName: firstName, lastName: lastName, bio: bio },
      { new: true, runValidators: true }
    );

    // If no profile is found, respond with a 404 status and failure message
    if (!updatedProfile) {
      return res.status(404).json({
        status: 'failure',
        message: 'User profile is not found'
      });
    }
    // Respond with success message and updated profile data
    res.status(200).json({
      status: 'success',
      updatedProfileData: {
        updatedProfile
      }
    });
  } catch (err) {
    // Handle any errors that occur during profile update
    res.status(500).json({
      status: 'failure',
      message: err.message
    });
  }
};

//   Get the profile for the user

export const getProfile = async (req, res, next) => {
  try {
    // Extract userId details from authorization middleware
    const userId = req.user.id;

    // Find the profile with the provided profileId
    // const profile = await Profile.findOne({_id:profileId})
    const profile = await Profile.find({ userId });

    // If no profile is found, respond with a 404 status and failure message
    if (!profile) {
      return res.status(404).json({
        status: 'failure',
        message: 'Profile not Found'
      });
    }
    // Respond with success message and profile data
    res.status(200).json({
      status: 'success',
      data: {
        profile
      }
    });
  } catch (err) {
    // Error Response
    res.status(500).json({
      status: 'failure',
      message: err.message
    });
  }
};

export const deleteProfile = async (req, res, next) => {
  try {
    // Get the profileId from parameters
    const { profileId } = req.params;

    // Find the profile with the provided profileId and delete it
    const profile = await Profile.findByIdAndDelete(profileId);

    // If profile does not found with that id throw Error Response
    if (!profile) {
      return res.status(404).json({
        status: 'failure',
        message: 'Profile not found'
      });
    }

    // Respond with success message
    res.status(200).json({
      status: 'success',
      message: 'Profile deleted successfully'
    });
  } catch (err) {
    // Error Response
    res.status(500).json({
      status: 'failure',
      message: err.message
    });
  }
};
