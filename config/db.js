const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://sagarshah8090:sagarshah8090@ac-rrnc509-shard-00-00.bcgbj4e.mongodb.net:27017,ac-rrnc509-shard-00-01.bcgbj4e.mongodb.net:27017,ac-rrnc509-shard-00-02.bcgbj4e.mongodb.net:27017/?ssl=true&replicaSet=atlas-114sl0-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0");
    console.log("MongoDB connected");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectDB;
