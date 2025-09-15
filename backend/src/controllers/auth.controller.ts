import { Request, Response, NextFunction } from "express";
import userService from "../services/user.service.js";
import authService from "../services/auth.service.js";
import { HTTP_RESPONSE_CODES } from "../enums/http-response-codes.js";
import { AuthRequest } from "../interfaces/authRequestAndPayload.js";
import { AuditAction, AuditResult, Status } from "@prisma/client";
import logService from "../services/log.service.js";
import { normalizeIp } from "../utils/ip.js";

class AuthController {
  async signup(req: Request, res: Response, next: NextFunction) {
    const { user_email, user_pwd } = req.body;
    const trimedUserEmail = user_email.trim();

    const existingUser = await userService.getUserByEmail(trimedUserEmail);

    if (existingUser) {
      return res.status(HTTP_RESPONSE_CODES.CONFLICT).json({ error: "Email already registered" });
    }

    const hashedPassword = await authService.encryptPassword(user_pwd);
    const user = await userService.createUser(trimedUserEmail, hashedPassword);

    res.status(HTTP_RESPONSE_CODES.CREATED).json({
      message: "User registered successfully",
      user,
    });
  }

  async login(req: Request, res: Response, next: NextFunction) {
    const { user_email, user_pwd } = req.body;
    const trimedUserEmail = user_email.trim();

    const logFailedLoginAndSendResponse = async (statusCode: HTTP_RESPONSE_CODES, error: string) => {
      await logService.createLog({
        action: AuditAction.LOGIN,
        result: AuditResult.FAILED,
        ip: normalizeIp(req.ip ?? ""),
      });
      res.status(statusCode).json({ error });
    };

    const user = await userService.getUserByEmail(trimedUserEmail);
    if (!user) {
      return await logFailedLoginAndSendResponse(HTTP_RESPONSE_CODES.UNAUTHORIZED, "Unauthorized: Invalid credentials");
    }

    const isMatch = await authService.comparePassword(user_pwd, user.passwordHash);
    if (!isMatch) {
      return await logFailedLoginAndSendResponse(HTTP_RESPONSE_CODES.UNAUTHORIZED, "Unauthorized: Invalid credentials");
    }

    if (user.status === Status.BLOCKED) {
      return await logFailedLoginAndSendResponse(HTTP_RESPONSE_CODES.FORBIDDEN, "Forbidden");
    }

    const userInfo = { id: user.id, email: user.email, role: user.role };
    const token = authService.generateToken({ user: userInfo });

    await logService.createLog({
      actorUserId: user.id,
      action: AuditAction.LOGIN,
      result: AuditResult.SUCCESS,
      ip: normalizeIp(req.ip ?? ""),
    });

    res
      .status(HTTP_RESPONSE_CODES.OK)
      .cookie("accessToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 1000 * 60 * 60 * 24,
      })
      .json({ message: "Login successful", user: userInfo });
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    res
      .status(HTTP_RESPONSE_CODES.OK)
      .clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      })
      .json({ message: "Logout successful" });
  }
}

export default new AuthController();
