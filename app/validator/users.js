'use strict';

module.exports = app => {
  const Joi = app.Joi;
  return {
    login: Joi.object().keys({
      phone: Joi.number().required(),
      email: Joi.string().email().required(),
      password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
      rePassword: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
    }),
  };
};
