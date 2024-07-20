import mongoose, { Document, Schema } from "mongoose";

interface VendorDoc extends Document {
  name: string;
  ownerName: string;
  foodType: [string];
  pincode: number;
  address: string;
  phone: string;
  email: string;
  password: string;
  salt: string;
  serviceAvailable: boolean;
  rating: number;
  covorImage: string;
  //   food: any;
}

const VendorSchema = new Schema(
  {
    name: { type: String, required: true },
    ownerName: { type: String, required: true },
    foodType: { type: [String] },
    pincode: { type: Number, required: true },
    address: { type: String },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    serviceAvailable: { type: Boolean },
    rating: { type: Boolean },
    covorImage: { type: [String] },
    //   food: [
    //     {
    //       type: mongoose.Schema.Types.ObjectId,
    //       ref: "Food",
    //     },
    //   ],
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.salt;
        delete ret.__v;
      },
    },
    timestamps: true,
  }
);

const Vendor = mongoose.model<VendorDoc>("Vendor", VendorSchema);

export { Vendor };
