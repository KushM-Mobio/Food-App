import dotenv from "dotenv";

dotenv.config();
export const MONGO_URI =
  process.env.LOCAL_DB || "mongodb://localhost:27017/food-app";
export const PORT = process.env.PORT || 8000;
export const APP_SECRET = process.env.APP_SECRET || "kush-secret";
