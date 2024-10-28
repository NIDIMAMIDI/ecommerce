import Joi from 'joi';
import { validateSchema } from '../../../helpers/validation/validationHelpers.js';
export const schemaValidator = async (req, res, next) => {
  const schema = Joi.object({
    orders: Joi.array()
      .items({
        productId: Joi.string().required().messages({
          'string.base': 'Product Id should be of type of Object Id',
          'string.empty': 'Product Id cannot be empty',
          'any.required': 'User ID is a required field'
        }),
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
            'any.only': 'Status can only be pending completed or canceled'
          })
      })
      .required()
      .messages({
        'array.base': 'Orders should be an array',
        'any.required': 'Orders is a required field'
      })
  });
  const error = await validateSchema(schema, req.body);
  if (error) {
    return res.status(404).json({
      status: 'failure',
      message: error.details[0].message
    });
  }
  next();
};
