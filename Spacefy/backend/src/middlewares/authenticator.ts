import * as jwt from "jsonwebtoken";
import crypto from "crypto";

export class Authenticator {
  private static getSecretKey(): string {
    if (!process.env.JWT_KEY) {
      throw new Error("Chave JWT não definida no .env");
    }
    return process.env.JWT_KEY;
  }

  generateToken = (payload: AuthenticationData): string => {
    const secret = Authenticator.getSecretKey();
    console.log("Secret Key:", secret);
    return jwt.sign(payload, secret, {
      expiresIn: "59min",
    });
  };

  getTokenData = (token: string): AuthenticationData => {
    try {
      const decoded = jwt.verify(token, Authenticator.getSecretKey());
      return decoded as AuthenticationData;
    } catch (error: any) {
      if (error.message.includes("jwt expired")) {
        throw new Error("Token expired");
      }
      throw new Error(error.message);
    }
  };
}

export interface AuthenticationData {
  id: string;
  role: "locatario" | "usuario";
}
