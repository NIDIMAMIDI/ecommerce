import { User } from '../../model/user/userModel.js';
import { sendMail } from '../../utils/email/sendEmail.js';
import { cancelOrderTemplate } from '../../utils/templates/cancelOrderTemplate.js';
import { cancelOrdersTemplate } from '../../utils/templates/canceOrdersTemplate.js';
import { multipleOrdersTemplate } from '../../utils/templates/multipleOrdersTemplate.js';
import { orderDetailsTemplate } from '../../utils/templates/orderPlacedTemplate.js';
import { resetPasswordTemplate } from '../../utils/templates/resetPasswordTemplate.js';

// Send an email with a generated password for forgot password functionality
export const forgortPasswordMailSend = async (email, password) => {
  const toEmail = email; // Recipient's email address
  const subject = 'Generated Password SuccessfullyReset Password Generation Successful'; // Email subject
  const text = '.'; // Plain text body of the email
  const html = resetPasswordTemplate(password); // HTML body of the email using a template

  // Send the email using sendMail function
  await sendMail(toEmail, subject, text, html);
};

// Send an email with order details when an order is placed
export const orderPlaceMail = async (userId, newOrder) => {
  const user = await User.findById(userId); // Find user by userId
  const orderTemplate = orderDetailsTemplate(newOrder); // Generate order details template
  const to = user.email; // Recipient's email address
  const subject = 'Your Order Details'; // Email subject
  const text = '.'; // Plain text body of the email

  // Send the email using sendMail function
  await sendMail(to, subject, text, orderTemplate);
};

// Send a refund confirmation email for order cancellation
export const refundMail = async (userId, order) => {
  const user = await User.findById(userId); // Find user by userId
  const to = user.email; // Recipient's email address
  const subject = 'Order Cancellation Confirmation, Refund is successful'; // Email subject
  const text = '.'; // Plain text body of the email
  const html = cancelOrderTemplate(order); // HTML body of the email using a template

  // Send the email using sendMail function
  await sendMail(to, subject, text, html);
};

// Send an email with order confirmation details
export const orderConformationMail = async (userId, order) => {
  const user = await User.findById(userId); // Find user by userId
  const to = user.email; // Recipient's email address
  const subject = 'Order Confirmation'; // Email subject
  const text = '.'; // Plain text body of the email
  const html = multipleOrdersTemplate(order); // HTML body of the email using a template

  // Send the email using sendMail function
  await sendMail(to, subject, text, html);
};

// Send an email confirming order cancellation and successful refund
export const cancellationEmail = async (userId, order) => {
  const user = await User.findById(userId); // Find user by userId
  const to = user.email; // Recipient's email address
  const subject = 'Order Cancellation Confirmation, Money has been refunded successfully'; // Email subject
  const text = '.'; // Plain text body of the email
  const html = cancelOrdersTemplate(order); // HTML body of the email using a template

  // Send the email using sendMail function
  await sendMail(to, subject, text, html);
};
