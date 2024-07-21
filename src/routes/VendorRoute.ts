import express, { Request, Response, NextFunction } from "express";

import {
  getVendorProfile,
  loggedInVendor,
  updateVendorProfile,
  updateVendorService,
} from "../controllers";
import { Authenticate } from "../middlewares";

const router = express.Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  return res.json({
    message: "Hello from Vendor!",
  });
});

router.post("/login", loggedInVendor);

router.use(Authenticate);
router.get("/profile", getVendorProfile);
router.patch("/updateProfile", updateVendorProfile);
router.patch("/updateService", updateVendorService);

export { router as VendorRoute };
