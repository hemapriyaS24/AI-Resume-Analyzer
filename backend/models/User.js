const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dbConfig = require('../config/db');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const MongoUser = mongoose.models.User || mongoose.model('User', UserSchema);

const UserModelWrapper = {
  findOne: async (query) => {
    if (dbConfig.isLocal()) {
      return dbConfig.getLocalDb().collection('users').findOne(query);
    }
    return await MongoUser.findOne(query);
  },

  create: async (data) => {
    if (dbConfig.isLocal()) {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      return dbConfig.getLocalDb().collection('users').create({
        ...data,
        password: hashedPassword
      });
    }
    const user = new MongoUser(data);
    user.password = await bcrypt.hash(user.password, 10);
    return await user.save();
  },

  findById: async (id) => {
    if (dbConfig.isLocal()) {
      return dbConfig.getLocalDb().collection('users').findById(id);
    }
    return await MongoUser.findById(id);
  }
};

module.exports = UserModelWrapper;
