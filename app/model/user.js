'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const ObjectId = mongoose.Schema.Types.ObjectId;
  const UserSchema = new Schema({
    name: {
      type: String,
    },
  });
  return mongoose.model('User', UserSchema);
};
