import mongoose from "mongoose";

// Connecting Our Database to MongoDB
const connectDb = async () => {
  try {
    mongoose.connection.on("connected", () =>
      //? Aur basically jo humne yeha per connection.on likha hai ye ek eventlistener hai jo hamare mongoDb realtime mein monitoring krte hai ki jaise status and all chije,aur ye best way bhi hai connect ke liye
      console.log("✅ Database connected successfully!")
    );

    mongoose.connection.on("error", (error) =>
      console.error("❌ Database connection error:", error)
    );

    await mongoose.connect(`${process.env.MONGODB_URL}/LMS-PRO`);
  } catch (error) {
    console.error("💥 Failed to connect to database:", error.message);
    process.exit(1);
  }
};

export default connectDb;
