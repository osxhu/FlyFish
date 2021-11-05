'use strict';
const Enum = require('../lib/enum');

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  // const ObjectId = mongoose.Schema.Types.ObjectId;

  const UserSchema = new Schema({
    create_time: {
      type: Date,
      default: Date.now,
    },
    update_time: {
      type: Date,
      default: Date.now,
    },

    username: {
      type: String,
    },
    role: {
      type: String,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    password: {
      type: String,
    },
    status: {
      type: String,
      default: Enum.COMMON_STATUS.VALID,
    },
  });

  return mongoose.model('User', UserSchema);
};
