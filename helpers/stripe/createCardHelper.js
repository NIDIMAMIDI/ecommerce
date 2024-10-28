// utils/stripeHelper.js
import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
// console.log(process.env.STRIPE_SECRET_KEY);
export const createCardDetails = async (customerId, token) => {
  return await stripe.customers.createSource(customerId, {
    source: token
  });
};

export const listCardDetails = async (customerId) => {
  return await stripe.customers.listSources(customerId);
};
