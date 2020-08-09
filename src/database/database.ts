import * as Mongoose from "mongoose";
require("dotenv");
let database: Mongoose.Connection;
const uri =
  "mongodb+srv://gshilo:awdx159jilm@employees.o57i3.mongodb.net/Japanika_Employees?retryWrites=true&w=majority";

export const connect = () => {
  // add your own uri below
  if (database) {
    return;
  }
  Mongoose.connect(uri, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
  database = Mongoose.connection;
  database.once("open", async () => {
    console.log("Connected to database".toUpperCase());
  });
  database.on("error", () => {
    console.log("Error connecting to database".toUpperCase());
  });
};
export const disconnect = () => {
  if (!database) {
    return;
  }
  Mongoose.disconnect();
};
