import * as jwt from "jsonwebtoken";

export class Authenticator {
  generateToken = (payload: AuthenticationData): string => {
    return jwt.sign(payload, process.env.JWT_KEY as string, {
      expiresIn: "59min",
    });
  };

  getTokenData = (token: string): AuthenticationData => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_KEY as string);
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
  name: string;
  surname: string;
  email: string;
  telephone: string;
  role: string;
}