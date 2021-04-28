import mongoose from "mongoose";

class db {

  public async createConnection(){
    try {
      let mongooseUrl = process.env.MONGO_URI;
      if (!mongooseUrl) {
        console.error("The mongoURI was not set in the env variables");
        process.exit(1);
      }
      await mongoose.connect(mongooseUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    }).then(()=>{
      console.log("MongoDB is connected")
    }).catch(err => {
      console.log(err.message)
    });

      await mongoose.connection.on('connected', ()=>{
        console.log("Mongoose connected to database")
        
      })
    } catch (error) {
      console.log(error);
      process.exit(1);
      
    }
  }
}

const connectDB = new db();
export { connectDB as db };