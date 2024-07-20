import { Request, Response, NextFunction } from "express";
import { CreateVendorInput } from "../dto";
import { Vendor } from "../models";
import { generatePassword, generateSalt } from "../utility";

export const CreateVendor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    name,
    email,
    password,
    address,
    pincode,
    phone,
    foodType,
    ownerName,
  } = <CreateVendorInput>req.body;

  const isVendorExist = await Vendor.findOne({ email });

  if (isVendorExist) {
    return res
      .status(400)
      .json({ message: "Vendor already exist with this email" });
  }

  const salt = await generateSalt();
  const hashedPassword = await generatePassword(password, salt);

  const createVendor = await Vendor.create({
    name,
    email,
    password: hashedPassword,
    address,
    pincode,
    phone,
    foodType,
    ownerName,
    serviceAvailable: false,
    salt,
    rating: 0,
    covorImage: [],
  });

  return res.json(createVendor);
};

export const GetVendors = (req: Request, res: Response, next: NextFunction) => {
  return res.json({
    message: "Get all Hello from Vendor!",
  });
};

export const GetVendor = (req: Request, res: Response, next: NextFunction) => {
  const vendorId = req.params.id;
  return res.json({
    vendorId,
    message: "Get Hello from Vendor!",
  });
};
