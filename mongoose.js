import mongoose from "mongoose";
import "dotenv/config";

const DB_KEY = process.env.DB_KEY;

mongoose
  .connect(DB_KEY)
  .then(() => {
    console.log("Connected to database");
  })
  .catch((e) => {
    console.error("Database connection error", e);
    process.exit(1);
  });
