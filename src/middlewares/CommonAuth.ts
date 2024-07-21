import { Request, Response, NextFunction } from "express";

import { AuthPayload } from "../dto";
import { GLOBAL_ERRORS, STATUS_CODE, validateSignature } from "../utility";

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export const Authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validate = validateSignature(req);
  if (validate) {
    next();
  } else {
    return res.status(STATUS_CODE.UNAUTHORIZED).json({
      message: GLOBAL_ERRORS.USER_UNAUTHORIZED,
    });
  }
};
