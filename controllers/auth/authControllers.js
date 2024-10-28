import { User } from '../../model/user/userModel.js';
import dotenv from 'dotenv';
import { createToken } from '../../helpers/jwt/indexJwt.js';
import { hashPassword, passwordChecking } from '../../helpers/bycrypt/bcryptHelpers.js';
import { randomPasswordGenerator } from '../../helpers/password/passwordGeneratorHelpers.js';
// import { sendMail } from '../../utils/email/sendEmail.js';
// import { resetPasswordTemplate } from '../../utils/templates/resetPasswordTemplate.js';
import { storeLoginHistory, userCreate } from '../../helpers/user/userHelpers.js';
import { forgortPasswordMailSend } from '../../helpers/email/emailSendHelper.js';

dotenv.config({ path: './.env' });

// ============================   Signup Functionality   ============================================

export const signup = async (req, res, next) => {
  try {
    // Fetching validated from the  authValidator File
    const { email, password, role } = req.body;

    // convert the email to the lowercase email
    const loweredEmail = email.toLowerCase();

    // check if there email is already exists are not
    const existingUser = await User.findOne({ email: loweredEmail });
    if (existingUser) {
      return res.status(500).json({
        status: 'failure',
        message: 'User Email is already exits'
      });
    }

    // hash the password with bcrypt module (plain password to hash password)
    const hashedPassword = await hashPassword(password, 12);

    // creating a new user with the mail, password and role and storing in User collection
    const newUser = await userCreate(User, loweredEmail, hashedPassword, role);

    // creating JWT token and fetching cookie options/parametrs
    const { token, cookieOptions } = createToken(newUser);

    // save user signup and login History by its storing user id and token into LoginHistory collection
    storeLoginHistory(newUser._id, token);

    // setting token as a cookie
    res.cookie('jwt', token, cookieOptions);

    // success response
    res.status(201).json({
      status: 'success',
      message: 'User signup registration successfull',
      data: {
        newUser,
        token
      }
    });
  } catch (error) {
    // error response
    res.status(500).json({
      status: 'failure',
      message: error.message
    });
  }
};

// ============================   Login Functionality   ============================================

export const login = async (req, res, next) => {
  try {
    // fetching validated data from the authValidator
    const { email, password } = req.body;

    // converting email to a lowerCase
    const loweredEmail = email.toLowerCase();

    // check if user email exists in database
    const user = await User.findOne({ email: loweredEmail });

    // if user does not found with the provided mail it will give error response
    if (!user) {
      return res.status(500).json({
        status: 'failure',
        message: 'Invalid email'
      });
    }

    // check if password is correct or not
    const isPAsswordCorrect = await passwordChecking(password, user.password);

    // if provided password does not match stored password it will throw the error response
    if (!isPAsswordCorrect) {
      return res.status(500).json({
        status: 'failure',
        message: 'Invalid Password'
      });
    }

    // fetching jwt token and cookie options
    const { token, cookieOptions } = createToken(user);

    // save user signup and login History by its storing user id and token into LoginHistory collection
    storeLoginHistory(user._id, token);

    // setting token as a cookie
    res.cookie('jwt', token, cookieOptions);

    // success response
    res.status(200).json({
      status: 'success',
      message: 'Login Successfull',
      data: {
        user,
        token
      }
    });
  } catch (err) {
    // error response
    res.status(500).json({
      status: 'failure',
      message: err.message
    });
  }
};

// ============================   Forgot Password Functionality   ============================================

export const forgotPassWord = async (req, res, next) => {
  try {
    // fetching the mail from request body
    const { email } = req.body;

    // converting mail to lowercase
    const loweredCaseEmail = email.toLowerCase();

    // check if user exists or not
    const user = await User.findOne({ email: loweredCaseEmail });

    // if user is not there give error response
    if (!user) {
      return res.status(404).json({
        status: 'faulire',
        message: 'User with this email does not exist'
      });
    }

    // Generating a random password
    const randomPassword = await randomPasswordGenerator();

    // Hashing the random password
    const hashedPassword = await hashPassword(randomPassword, 12);

    // stroing the hashed random generated password into the user collection database
    user.password = hashedPassword;
    user.save();

    // send the generated password mail to user
    forgortPasswordMailSend(loweredCaseEmail, randomPassword);

    // Success Response
    res.status(200).json({
      status: 'success',
      data: {
        message: 'Generated Password has been sent to the registered email Successfully'
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
