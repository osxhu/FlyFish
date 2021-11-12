'use strict';
const _ = require('lodash');
const { camelizeKeys, decamelizeKeys } = require('humps');

const Enum = require('../lib/enum');

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const TradeSchema = new Schema({
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
    status: {
      type: String,
      default: Enum.COMMON_STATUS.VALID,
    },
  });


  TradeSchema.statics._find = async function(query, projection, options) {
    const filter = _toDoc(query);
    const res = await this.find(filter, projection, options).lean(true);
    return res.map(_toObj);
  };


  function _toDoc(obj) {
    if (_.isEmpty(obj)) return;

    if (!_.isNil(obj.id)) {
      obj._id = obj.id;
      delete obj.id;
    }
    return decamelizeKeys(obj);
  }

  function _toObj(doc) {
    if (_.isEmpty(doc)) return;

    const res = {};
    res.id = doc._id.toString();

    const camelizeRes = camelizeKeys(doc);

    if (!_.isNil(camelizeRes.createTime)) res.createTime = camelizeRes.createTime.getTime();
    if (!_.isNil(camelizeRes.updateTime)) res.updateTime = camelizeRes.updateTime.getTime();

    return Object.assign(camelizeRes, res);
  }

  return mongoose.model('Trade', TradeSchema);
};
