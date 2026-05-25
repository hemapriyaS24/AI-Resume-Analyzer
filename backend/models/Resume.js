const mongoose = require('mongoose');
const dbConfig = require('../config/db');

const ResumeSchema = new mongoose.Schema({
  userId: { type: String, default: null },
  originalName: { type: String, required: true },
  parsedText: { type: String, required: true },
  language: { type: String, default: 'English' },
  atsScore: { type: Number, default: 0 },
  analysis: { type: Object, default: {} },
  ranking: { type: Object, default: {} },
  createdAt: { type: Date, default: Date.now }
});

const MongoResume = mongoose.models.Resume || mongoose.model('Resume', ResumeSchema);

const ResumeModelWrapper = {
  find: async (query = {}) => {
    if (dbConfig.isLocal()) {
      return dbConfig.getLocalDb().collection('resumes').find(query);
    }
    return await MongoResume.find(query).sort({ createdAt: -1 });
  },

  findOne: async (query = {}) => {
    if (dbConfig.isLocal()) {
      return dbConfig.getLocalDb().collection('resumes').findOne(query);
    }
    return await MongoResume.findOne(query);
  },

  findById: async (id) => {
    if (dbConfig.isLocal()) {
      return dbConfig.getLocalDb().collection('resumes').findById(id);
    }
    return await MongoResume.findById(id);
  },

  create: async (data) => {
    if (dbConfig.isLocal()) {
      return dbConfig.getLocalDb().collection('resumes').create(data);
    }
    const resume = new MongoResume(data);
    return await resume.save();
  },

  findByIdAndUpdate: async (id, update) => {
    if (dbConfig.isLocal()) {
      return dbConfig.getLocalDb().collection('resumes').findByIdAndUpdate(id, update);
    }
    return await MongoResume.findByIdAndUpdate(id, update, { new: true });
  },

  countDocuments: async (query = {}) => {
    if (dbConfig.isLocal()) {
      return dbConfig.getLocalDb().collection('resumes').countDocuments(query);
    }
    return await MongoResume.countDocuments(query);
  }
};

module.exports = ResumeModelWrapper;
