'use strict';
const Enum = require('../lib/enum');
const { camelizeKeys, decamelizeKeys } = require('humps');

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

  UserSchema.statics._findOne = async function(params) {
    const decamelizeParams = decamelizeKeys(params);
    const doc = Object.assign({}, decamelizeParams, {
      // 处理value转化
      // create_time: new Date(),
      // v: decamelizeParams.v.toString(),
    });

    const res = await this.findOne(doc);
    const camelizeRes = camelizeKeys(res._doc);
    return Object.assign({}, camelizeRes, {
      // 处理value转化
      id: camelizeRes.toString(),
      createTime: camelizeRes.createTime.getTime(),
      updateTime: camelizeRes.updateTime.getTime(),
    });
  };

  // UserSchema.statics._updateOne = function(id, params) {
  //   const doc = decamelizeKeys(params);
  //   return this.updateOne({ _id: id, doc });
  // };

  return mongoose.model('User', UserSchema);
};
