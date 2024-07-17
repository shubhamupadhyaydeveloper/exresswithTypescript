import { RequestHandler } from "express";
import Joi from "joi";

export const validate = (schema: Joi.ObjectSchema): RequestHandler => {
  return async (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((detail) => detail.message); // Collect all error messages
      return res.status(400).json({ errors });
    }
    req.body = value;
    next();
  };
};
