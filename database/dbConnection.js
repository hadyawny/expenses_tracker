import mongoose from "mongoose";
export const dbConnection = () => {
  mongoose.connect(process.env.DB_ONLINE)
    .then(() => {
      console.log("Mongodb is connected");
    })
    .catch((err) => {
      console.log("database error", err);
    });
};


