import { Response, NextFunction } from "express";
import authService from "../services/auth.service.js";
import { AuthRequest } from "../interfaces/authRequestAndPayload.js";
import { HTTP_RESPONSE_CODES } from "../enums/http-response-codes.js";

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies?.accessToken;

  const sendUnauthorized = (error = "Invalid or expired token") =>
    res.status(HTTP_RESPONSE_CODES.UNAUTHORIZED).json({ error });

  if (!token) {
    return sendUnauthorized("No token provided");
  }

  try {
    const payload = authService.verifyToken(token);

    if (!payload || !payload.user) {
      return sendUnauthorized();
    }

    req.user = payload.user;

    return next();
  } catch (err) {
    return sendUnauthorized();
  }
};
