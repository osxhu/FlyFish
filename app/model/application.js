'use strict';
const _ = require('lodash');
const { camelizeKeys, decamelizeKeys } = require('humps');

const Enum = require('../lib/enum');

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const ApplicationSchema = new Schema({
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
    projects: {
      type: [ String ],
    },
    tags: {
      type: [ String ],
    },
    develop_status: {
      type: String,
    },
    type: {
      type: String,
    },
    cover: {
      type: String,
    },
    creator: {
      type: String,
    },
    updater: {
      type: String,
    },
    status: {
      type: String,
      default: Enum.COMMON_STATUS.VALID,
    },
    screens: {
      type: [ new Schema({
        uid: { type: String },
        name: { type: String },
        components: { type: [
          new Schema({
            id: { type: String },
            version: { type: String },
          }),
        ] },
      }) ],
    },
  });

  function _toDoc(obj, update = false) {
    if (_.isEmpty(obj)) return;

    if (obj.id) obj._id = obj.id; delete (obj.id);
    if (update) obj.updateTime = Date.now();
    return decamelizeKeys(obj);
  }

  function _toObj(doc) {
    if (_.isEmpty(doc)) return;

    const res = {};
    res.id = doc._id.toString();

    const camelizeRes = camelizeKeys(doc);

    if (!_.isNil(camelizeRes.createTime)) res.createTime = camelizeRes.createTime.getTime();
    if (!_.isNil(camelizeRes.updateTime)) res.updateTime = camelizeRes.updateTime.getTime();

    delete camelizeRes.password;
    return Object.assign({}, camelizeRes, res);
  }

  return mongoose.model('Application', ApplicationSchema);
};
