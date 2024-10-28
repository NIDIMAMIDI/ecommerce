import Joi from 'joi';
import { validateSchema } from '../../../helpers/validation/validationHelpers.js';

export const productValidator = async (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required().messages({
      'string.base': 'Name should be a type of text',
      'string.empty': 'Name cannot be empty',
      'any.required': 'Name is a required field'
    }),
    image: Joi.array().items(Joi.string()).required().messages({
      'array.base': 'Image should be an array of strings',
      'any.required': 'Image is a required field'
    }),
    quantity: Joi.number().required().messages({
      'number.base': 'Quantity should be a number',
      'any.required': 'Quantity is a required field'
    }),
    price: Joi.number().required().messages({
      'number.base': 'Price should be a number',
      'any.required': 'Price is a required field'
    }),
    status: Joi.string().valid('active', 'inactive').default('active').messages({
      'string.base': 'Status should be a type of text',
      'any.only': 'Status must be either active or inactive'
    }),
    description: Joi.string().messages({
      'string.base': 'Description should be a type of text',
      'string.empty': 'Description cannot be empty',
      'any.required': 'Description is a required field'
    })
  });
  const error = validateSchema(schema, req.body);
  if (error) {
    return res.status(400).json({
      status: 'failure',
      message: error.details[0].message
    });
  }

  next();
};
