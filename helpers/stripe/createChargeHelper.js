import Stripe from 'stripe';

import { Profile } from '../../model/profile/profileModel.js';
import { listCardDetails } from './createCardHelper.js';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// creating a charge with amount and userID
export const createCharge = async (amount, userId) => {
  const user = await Profile.findOne({ userId });
  const customerId = user.customerId;
  const cards = await listCardDetails(customerId);
  // checking weather it contains the cards
  if (cards.data.length == 0) {
    throw new Error('No stored cards found for the user');
  }
  const cardId = cards.data[0].id;
  const charge = await stripe.charges.create({
    amount: amount * 100,
    currency: 'usd',
    customer: customerId,
    source: cardId
  });
  //   console.log(charge);
  return charge;
};
// createCharge(15, "66a8d7c43ef765a8916460fd");
