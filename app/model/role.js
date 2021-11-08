'use strict';
const Enum = require('../lib/enum');

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const RoleSchema = new Schema({
    create_time: {
      type: Date,
      default: Date.now,
    },
    update_time: {
      type: Date,
      default: Date.now,
    },
    name: {
      type: String,
    },
    desc: {
      type: String,
    },
    menus: [ String ],
    status: {
      type: String,
      default: Enum.COMMON_STATUS.VALID,
    },
  });

  return mongoose.model('Role', RoleSchema);
};
