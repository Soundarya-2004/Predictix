const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`⚠️ MongoDB Connection Failed: ${error.message}`);
    console.warn('Running in Demo Mode without database persistence.');
  }
};

module.exports = connectDB;
