import expres from "express";
import bodyParser from "body-parser";
import mongoose, { ConnectOptions } from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const MONGO_URI = process.env.LOCAL_DB || "mongodb://localhost:27017/food-app";
const PORT = process.env.PORT || 8000;

// roters
import { AdminRoute, VendorRoute } from "./routes";

const app = expres();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/admin", AdminRoute);
app.use("/vendor", VendorRoute);

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions)
  .then(() => {
    console.log("Database Connected Successfully!!!");
  })
  .catch((err) => {
    console.log("Error => ", err);
  });

app.listen(PORT, () => console.log("Listening on port 8000"));
