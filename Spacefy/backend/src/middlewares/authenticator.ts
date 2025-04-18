import * as jwt from "jsonwebtoken";
import crypto from "crypto";

export class Authenticator {
  private static SECRET_KEY: string = Authenticator.generateRandomKey();

  private static generateRandomKey(): string {
    return crypto.randomBytes(32).toString("hex"); // 256 bits
  }

  generateToken = (payload: AuthenticationData): string => {
    return jwt.sign(payload, Authenticator.SECRET_KEY, {
      expiresIn: "59min",
    });
  };

  getTokenData = (token: string): AuthenticationData => {
    try {
      const decoded = jwt.verify(token, Authenticator.SECRET_KEY);
      return decoded as AuthenticationData;
    } catch (error: any) {
      if (error.message.includes("jwt expired")) {
        throw new Error("Token expired");
      }
      throw new Error(error.message);
    }
  };

  static getSecretKey(): string {
    return this.SECRET_KEY;
  }
}

export interface AuthenticationData {
  id: string;
}
