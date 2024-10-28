/* eslint-disable no-case-declarations */
// utils/stripeHelper.js
import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCustomer = async (email, name) => {
  try {
    // Check if a Stripe customer with this email already exists
    const customers = await stripe.customers.list({ email, limit: 1 });

    if (customers.data.length > 0) {
      return customers.data[0];
    } else {
      // Create a customer in Stripe
      const customer = await stripe.customers.create({
        email,
        name
      });
      return customer;
    }
  } catch (err) {
    throw new Error('Error creating or retrieving Stripe customer');
  }
};

export const webHook = async (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      request.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET // Use environment variable for the secret
    );
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntentSucceeded = event.data.object;
      // Handle successful payment intent
      console.log('PaymentIntent was successful:', paymentIntentSucceeded);
      break;

    case 'customer.subscription.created':
      const subscriptionCreated = event.data.object;
      // Handle subscription creation
      console.log('Subscription was created:', subscriptionCreated);
      break;

    case 'customer.subscription.updated':
      const subscriptionUpdated = event.data.object;
      // Handle subscription update
      console.log('Subscription was updated:', subscriptionUpdated);
      break;

    case 'customer.subscription.deleted':
      const subscriptionDeleted = event.data.object;
      // Handle subscription deletion
      console.log('Subscription was deleted:', subscriptionDeleted);
      break;

    case 'invoice.payment_succeeded':
      const invoicePaymentSucceeded = event.data.object;
      // Handle successful invoice payment
      console.log('Invoice payment succeeded:', invoicePaymentSucceeded);
      break;

    case 'invoice.payment_failed':
      const invoicePaymentFailed = event.data.object;
      // Handle failed invoice payment
      console.log('Invoice payment failed:', invoicePaymentFailed);
      break;

    case 'charge.succeeded':
      const chargeSucceeded = event.data.object;
      console.log('Charge was successful:', chargeSucceeded);
      // Handle successful charge
      break;

    case 'charge.failed':
      const chargeFailed = event.data.object;
      console.log('Charge failed:', chargeFailed);
      // Handle failed charge
      break;

    case 'charge.refunded':
      const chargeRefunded = event.data.object;
      console.log('Charge was refunded:', chargeRefunded);
      // Handle refunded charge
      break;

    case 'charge.refund.updated':
      const chargeRefundUpdate = event.data.object;
      console.log('Charge refund Updates are:', chargeRefundUpdate);
      // Handle refunded charge
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
};
