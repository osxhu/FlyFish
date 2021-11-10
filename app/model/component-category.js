'use strict';
const _ = require('lodash');
const { camelizeKeys, decamelizeKeys } = require('humps');

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const ComponentCategorySchema = new Schema({
    create_time: {
      type: Date,
      default: Date.now,
    },
    update_time: {
      type: Date,
      default: Date.now,
    },

    categories: [{
      name: {
        type: String,
      },
      children: [{
        name: {
          type: String,
        },
      }],
    }],
  });

  ComponentCategorySchema.statics._find = async function(params, projection, options) {
    const doc = _toDoc(params);
    const res = await this.find(doc, projection, options);
    return res.map(_toObj);
  };

  ComponentCategorySchema.statics._create = async function(params) {
    const doc = _toDoc(params);
    return await this.create(doc);
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

    const camelizeRes = camelizeKeys(model._doc);

    if (!_.isNil(camelizeRes.createTime)) res.createTime = camelizeRes.createTime.getTime();
    if (!_.isNil(camelizeRes.updateTime)) res.updateTime = camelizeRes.updateTime.getTime();

    return Object.assign({}, camelizeRes, res);
  }

  return mongoose.model('ComponentCategory', ComponentCategorySchema, 'component-category');
};
