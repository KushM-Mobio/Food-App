import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request } from "express";

import { AuthPayload, VendorToken } from "../dto";
import { APP_SECRET } from "../config";

export const generateSalt = async () => {
  return await bcrypt.genSalt();
};

export const generatePassword = async (password: string, salt: string) => {
  return await bcrypt.hash(password, salt);
};

export const validatePassword = async (
  enteredPassword: string,
  savedPassword: string,
  salt: string
) => {
  return (await generatePassword(enteredPassword, salt)) === savedPassword;
};

export const generateToken = (payload: VendorToken) => {
  return jwt.sign(payload, APP_SECRET, { expiresIn: "1d" });
};

export const validateSignature = (req: Request) => {
  try {
    const signature = req.get("Authorization");

    if (signature) {
      const payload = jwt.verify(
        signature.split(" ")[1],
        APP_SECRET
      ) as AuthPayload;

      req.user = payload;
      return true;
    }
    return false;
  } catch (error) {
    console.log("Error => ", error);
    return false;
  }
};
