import mongoose from "mongoose";

class db {

  public async createConnection(){
    try {
      let mongooseUrl = process.env.MONGO_URI;
      if (!mongooseUrl) {
        console.error("The mongoURI was not set in the env variables");
        process.exit(1);
      }
      await mongoose.connect(mongooseUrl);
    } catch (error) {
      console.log(error);
      process.exit(1);
      
    }
  }
}

const connectDB = new db();
export { connectDB as db };