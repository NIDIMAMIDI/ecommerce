import Joi from 'joi';
import { validateSchema } from '../../../helpers/validation/validationHelpers.js';
export const orderValidation = (req, res, next) => {
  const Schema = Joi.object({
    quantity: Joi.number().integer().min(1).required().messages({
      'number.base': 'Quantity should be a type of number',
      'number.min': 'Quantity should have a minimum value of 1',
      'any.required': 'Quantity is a required field'
    }),
    price: Joi.number().integer().min(0),
    name: Joi.string().trim().messages(),
    status: Joi.string()
      .valid('pending', 'completed', 'canceled')
      .default('pending')
      .messages({
        'string.base': 'Status should be a string',
        'any.only': 'Status can only be pending, canceled or completed'
      })
  });
  const error = validateSchema(Schema, req.body);
  if (error) {
    return res.status(404).json({
      status: 'failure',
      message: error.details[0].message
    });
  }
  next();
};
