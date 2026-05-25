const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const localDbPath = path.join(__dirname, '../data/localdb.json');
let useLocalDb = false;

// Ensure local db file exists
const initializeLocalDb = () => {
  const dir = path.dirname(localDbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(localDbPath)) {
    fs.writeFileSync(localDbPath, JSON.stringify({ users: [], resumes: [] }, null, 2));
  }
};

const connectDB = async () => {
  initializeLocalDb();
  
  try {
    console.log('Attempting to connect to MongoDB...');
    // Connect to MongoDB with a 2-second timeout to check availability
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-resume-analyzer', {
      serverSelectionTimeoutMS: 2000
    });
    console.log('🟢 MongoDB Connected Successfully.');
  } catch (err) {
    console.log('🔴 MongoDB connection failed or timed out. Falling back to Local JSON Database.');
    useLocalDb = true;
    console.log(`🟢 Local JSON Database initialized at: ${localDbPath}`);
  }
};

// Local DB operations wrapper (mimics basic Mongoose operations)
const localDb = {
  read: () => {
    try {
      initializeLocalDb();
      const data = fs.readFileSync(localDbPath, 'utf8');
      return JSON.parse(data);
    } catch (e) {
      return { users: [], resumes: [] };
    }
  },
  
  write: (data) => {
    try {
      fs.writeFileSync(localDbPath, JSON.stringify(data, null, 2));
      return true;
    } catch (e) {
      console.error('Error writing to local DB:', e);
      return false;
    }
  },

  collection: (name) => {
    return {
      find: (query = {}) => {
        const db = localDb.read();
        let items = db[name] || [];
        
        // Simple query matching
        return items.filter(item => {
          for (let key in query) {
            if (item[key] !== query[key]) return false;
          }
          return true;
        });
      },

      findOne: (query = {}) => {
        const db = localDb.read();
        const items = db[name] || [];
        return items.find(item => {
          for (let key in query) {
            if (item[key] !== query[key]) return false;
          }
          return true;
        }) || null;
      },

      create: (doc) => {
        const db = localDb.read();
        if (!db[name]) db[name] = [];
        
        const newDoc = {
          _id: Math.random().toString(36).substring(2, 11),
          createdAt: new Date(),
          updatedAt: new Date(),
          ...doc
        };
        
        db[name].push(newDoc);
        localDb.write(db);
        return newDoc;
      },

      findByIdAndUpdate: (id, update) => {
        const db = localDb.read();
        const items = db[name] || [];
        const index = items.findIndex(item => item._id === id);
        
        if (index === -1) return null;
        
        // Apply simple update
        const updatedDoc = {
          ...items[index],
          ...update,
          updatedAt: new Date()
        };
        
        items[index] = updatedDoc;
        localDb.write(db);
        return updatedDoc;
      },

      findById: (id) => {
        const db = localDb.read();
        const items = db[name] || [];
        return items.find(item => item._id === id) || null;
      },

      countDocuments: (query = {}) => {
        const db = localDb.read();
        const items = db[name] || [];
        return items.filter(item => {
          for (let key in query) {
            if (item[key] !== query[key]) return false;
          }
          return true;
        }).length;
      }
    };
  }
};

module.exports = {
  connectDB,
  isLocal: () => useLocalDb,
  getLocalDb: () => localDb
};
