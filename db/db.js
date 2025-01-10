import mongoose from "mongoose";

const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log(
      "Connected to mongoDB with url: ",
      process.env.MONGODB_URL,
      " with type: ",
      typeof process.env.MONGODB_URL
    );
  } catch (err) {
    console.log(err);
  }
};

export default connectToDatabase;
