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

  UserSchema.statics._find = async function(params, projection, options) {
    const doc = _toDoc(params);
    const res = await this.find(doc, projection, options);
    return res.map(_toObj);
  };

  UserSchema.statics._count = async function(params) {
    const doc = _toDoc(params);
    return await this.count(doc);
  };

  UserSchema.statics._create = async function(params) {
    const doc = _toDoc(params);
    return await this.create(doc);
  };

  UserSchema.statics._findOne = async function(params) {
    const doc = _toDoc(params);
    const res = await this.findOne(doc);
    return _toObj(res);
  };

  UserSchema.statics._updateOne = async function(cond, params) {
    const docCond = _toDoc(cond);
    const docData = _toDoc(params, true);
    return await this.updateOne(docCond, docData);
  };

  UserSchema.statics._updateMany = async function(cond, params) {
    const docCond = _toDoc(cond);
    const docData = _toDoc(params, true);
    return await this.updateMany(docCond, docData);
  };

  function _toDoc(obj, update = false) {
    if (_.isEmpty(obj)) return;

    if (obj.id) obj._id = obj.id; delete (obj.id);
    if (update) obj.updateTime = Date.now();
    return decamelizeKeys(obj);
  }

  function _toObj(model) {
    if (_.isEmpty(model)) return;

    const res = {};
    res.id = model._id.toString();

    const camelizeRes = camelizeKeys(model);

    if (!_.isNil(camelizeRes.createTime)) res.createTime = camelizeRes.createTime.getTime();
    if (!_.isNil(camelizeRes.updateTime)) res.updateTime = camelizeRes.updateTime.getTime();

    delete camelizeRes.doc.password;
    return Object.assign({}, camelizeRes.doc, res);
  }

  return mongoose.model('User', UserSchema);
};
