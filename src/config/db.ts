import mongoose from "mongoose";

class db {
  public async createConnection() {
    try {
      let mongooseUrl = process.env.MONGO_URI;
      if (!mongooseUrl) {
        console.error("The mongoURI was not set in the env variables");
        process.exit(1);
      }
      await mongoose
        .connect(mongooseUrl, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useFindAndModify: false,
          useCreateIndex: true,
        })
        .then(() => {
          console.log("MongoDB is connected");
        })
        .catch((err) => {
          console.log(err.message);
        });
    } catch (error) {
      console.log(error);
      process.exit(1);
    }

    // await mongoose.connection.on('connected', ()=>{
    //   console.log("Mongoose connected to database")
    // })

    await mongoose.connection.on("disconnected", () => {
      console.log("Mongoose connected to database");
    });

    await mongoose.connection.on("error", (err) => {
      console.log(err.message);
    });

    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      process.exit(0);
    });
  }
}

const connectDB = new db();
export { connectDB as db };
