import {
  createCardDetails,
  listCardDetails
} from '../../helpers/stripe/createCardHelper.js';
import { Profile } from '../../model/profile/profileModel.js';

// Controller function to create a new card

export const createCard = async (req, res, next) => {
  try {
    const { token } = req.body; // Extract the token from the request body
    const userId = req.user.id; // Get the user ID from the authenticated user
    const profile = await Profile.findOne({ userId }); // Find the profile associated with the user
    const customerId = profile.customerId; // Extract the customer ID from the profile

    // Create the card details using the helper function
    const cardDetails = await createCardDetails(customerId, token);
    // console.log(cardDetails);

    // Success Response
    res.status(201).json({
      status: 'success',
      cardDetails
    });
  } catch (err) {
    // Return a server error response
    res.status(500).json({
      status: 'failure',
      message: err.message
    });
  }
};

//  Controller function to list all cards

export const listCards = async (req, res, next) => {
  try {
    const userId = req.user.id; // Get the user ID from the authenticated user
    const profile = await Profile.findOne({ userId }); // Find the profile associated with the user
    const customerId = profile.customerId; // Extract the customer ID from the profile

    // List the card details using the helper function
    const listCards = await listCardDetails(customerId);
    // console.log(listCards);

    // Success Response
    res.status(200).json({
      status: 'success',
      listCards
    });
  } catch (err) {
    // Return a server error response
    res.status(500).json({
      status: 'failure',
      message: err.message
    });
  }
};
