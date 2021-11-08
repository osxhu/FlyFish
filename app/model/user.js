'use strict';
const _ = require('lodash');
const { camelizeKeys, decamelizeKeys } = require('humps');

const Enum = require('../lib/enum');

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

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
    const doc = _toDoc(params);
    const res = await this.findOne(doc);
    return _toObj(res._doc);
  };

  UserSchema.statics._updateOne = async function(id, params) {
    const doc = _toDoc(params);
    return await this.updateOne({ _id: id }, doc);
  };


  function _toDoc(obj) {
    return decamelizeKeys(obj);
  }

  function _toObj(doc) {
    const res = {};
    res.id = doc._id.toString();

    const camelizeRes = camelizeKeys(doc);

    if (!_.isNil(camelizeRes.createTime)) res.createTime = camelizeRes.createTime.getTime();
    if (!_.isNil(camelizeRes.updateTime)) res.updateTime = camelizeRes.updateTime.getTime();

    return Object.assign(camelizeRes, res);
  }

  return mongoose.model('User', UserSchema);
};
