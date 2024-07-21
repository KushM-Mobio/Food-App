import { Request, Response, NextFunction } from "express";

import {
  ADMIN_MESSAGES,
  GLOBAL_ERRORS,
  STATUS_CODE,
  VENDOR_MESSAGES,
  generateToken,
  validatePassword,
} from "../utility";
import { EditVendorInput, LogInVendor } from "../dto";
import { FindVendor } from "./AdminController";

export const loggedInVendor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = <LogInVendor>req.body;

    const isVendorExist = await FindVendor("", email);

    if (isVendorExist) {
      const {
        salt,
        password: savedPassword,
        _id,
        name,
        email,
        foodType,
      } = isVendorExist;
      const isPasswordMatch = await validatePassword(
        password,
        savedPassword,
        salt
      );
      if (!isPasswordMatch) {
        return res.status(STATUS_CODE.UNAUTHORIZED).json({
          message: VENDOR_MESSAGES.CREDENTIAL_INVALID,
        });
      }

      const token = generateToken({
        _id,
        name,
        email,
        foodType,
      });
      return res.json({
        message: VENDOR_MESSAGES.VENDOR_LOGIN,
        token,
      });
    }

    return res
      .status(STATUS_CODE.NOT_FOUND)
      .json({ message: ADMIN_MESSAGES.VENDOR_NOT_FOUND });
  } catch (error) {
    console.log("Error => ", error);
    return res.status(STATUS_CODE.SERVER_ERROR).json({
      message: GLOBAL_ERRORS.SERVER_ERROR,
    });
  }
};

export const getVendorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    if (user) {
      const userDetails = await FindVendor(user._id);

      return res.json({
        message: VENDOR_MESSAGES.VENDOR_FOUND,
        data: userDetails,
      });
    }

    return res.status(STATUS_CODE.NOT_FOUND).json({
      message: VENDOR_MESSAGES.VENDOR_NOT_FOUND,
    });
  } catch (error) {
    console.log("Error => ", error);
    return res.status(STATUS_CODE.SERVER_ERROR).json({
      message: GLOBAL_ERRORS.SERVER_ERROR,
    });
  }
};

export const updateVendorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, address, pincode, phone, foodType } = <EditVendorInput>(
      req.body
    );

    const user = req.user;

    if (user) {
      const existingVendor = await FindVendor(user._id);
      if (existingVendor) {
        name && (existingVendor.name = name);
        address && (existingVendor.address = address);
        pincode && (existingVendor.pincode = pincode);
        phone && (existingVendor.phone = phone);
        foodType && (existingVendor.foodType = foodType);

        const updatedVendor = await existingVendor.save();

        return res.json({
          message: VENDOR_MESSAGES.VENDOR_UPDATED,
          data: updatedVendor,
        });
      }
    }

    return res.status(STATUS_CODE.NOT_FOUND).json({
      message: VENDOR_MESSAGES.VENDOR_NOT_FOUND,
    });
  } catch (error) {
    console.log("Error => ", error);
    return res.status(STATUS_CODE.SERVER_ERROR).json({
      message: GLOBAL_ERRORS.SERVER_ERROR,
    });
  }
};

export const updateVendorService = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    if (user) {
      const existingVendor = await FindVendor(user._id);

      if (existingVendor) {
        existingVendor.serviceAvailable = !existingVendor.serviceAvailable;
        const updatedVendor = await existingVendor.save();

        return res.json({
          message: VENDOR_MESSAGES.SERVICE_UPDATED,
          data: updatedVendor,
        });
      }
    }

    return res.status(STATUS_CODE.NOT_FOUND).json({
      message: VENDOR_MESSAGES.VENDOR_NOT_FOUND,
    });
  } catch (error) {
    console.log("Error => ", error);
    return res.status(STATUS_CODE.SERVER_ERROR).json({
      message: GLOBAL_ERRORS.SERVER_ERROR,
    });
  }
};
