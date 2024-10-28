import Stripe from 'stripe';
// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// chargeId

export const refundMoney = async (chargeId) => {
  return await stripe.refunds.create({ charge: chargeId });
};
