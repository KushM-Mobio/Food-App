import { Request, Response, NextFunction } from "express";
import { CreateVendorInput } from "../dto";
import { Vendor } from "../models";
import {
  ADMIN_MESSAGES,
  GLOBAL_ERRORS,
  STATUS_CODE,
  generatePassword,
  generateSalt,
} from "../utility";

export const FindVendor = async (id: string | undefined, email?: string) => {
  try {
    if (email) {
      return await Vendor.findOne({
        email: { $regex: new RegExp(`^${email}$`, "i") },
      });
    } else {
      return await Vendor.findById({ _id: id });
    }
  } catch (error) {
    console.log("Error => ", error);
    return null;
  }
};

export const CreateVendor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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

    const isVendorExist = await FindVendor("", email);

    if (isVendorExist) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json({ message: ADMIN_MESSAGES.VENDOR_EXIST });
    }

    const salt = await generateSalt();
    const hashedPassword = await generatePassword(password, salt);

    const createVendor = await Vendor.create({
      name,
      email: email.toLowerCase(),
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

    return res.status(STATUS_CODE.CREATED).json({
      message: ADMIN_MESSAGES.CREATE_VENDOR,
      createVendor,
    });
  } catch (error) {
    console.log("Error => ", error);
    return res.status(STATUS_CODE.SERVER_ERROR).json({
      message: GLOBAL_ERRORS.SERVER_ERROR,
    });
  }
};

export const GetVendors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const allVendors = await Vendor.find();

    if (!allVendors) {
      return res
        .status(STATUS_CODE.BAD_REQUEST)
        .json({ message: ADMIN_MESSAGES.VENDOR_NOT_FOUND });
    }

    return res.json({ message: ADMIN_MESSAGES.GET_ALL_VENDORS, allVendors });
  } catch (error) {
    console.log("Error => ", error);
    return res.status(STATUS_CODE.SERVER_ERROR).json({
      message: GLOBAL_ERRORS.SERVER_ERROR,
    });
  }
};

export const GetVendor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const vendorId = req.params.id;
    const specificVendor = await FindVendor(vendorId);
    if (!specificVendor) {
      return res.status(STATUS_CODE.NOT_FOUND).json({
        message: ADMIN_MESSAGES.VENDOR_NOT_FOUND,
      });
    }

    return res.json({ message: ADMIN_MESSAGES.GET_VENDOR, specificVendor });
  } catch (error) {
    console.log("Error => ", error);
    return res.status(STATUS_CODE.SERVER_ERROR).json({
      message: GLOBAL_ERRORS.SERVER_ERROR,
    });
  }
};
