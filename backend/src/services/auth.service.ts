import jwt, { Secret } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { AuthPayload } from "../interfaces/authRequestAndPayload.js";
import { CONSTANTS } from "../constants.js";

const JWT_SECRET = process.env.JWT_SECRET as Secret;

class AuthService {
  generateToken(payload: AuthPayload): string {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: CONSTANTS.JWT_EXPIRES_IN,
    });
  }

  verifyToken(token: string): AuthPayload {
    const decoded = jwt.verify(token, JWT_SECRET as string) as AuthPayload;
    return decoded;
  }

  encryptPassword(password: string, saltRounds: number = 10): Promise<string> {
    return bcrypt.hash(password, saltRounds);
  }

  comparePassword(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainTextPassword, hashedPassword);
  }
}

export default new AuthService();
