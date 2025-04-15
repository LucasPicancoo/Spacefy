import * as jwt from "jsonwebtoken";

export class Authenticator {
    
    generateToken = (payload: AuthenticationData): string => {
        return jwt.sign(payload, process.env.SECRET_KEY as string, {
            expiresIn: "59min",
        });
    };

    getTokenData = (token: string): AuthenticationData => {
    try {
        let decoded = jwt.verify(token, process.env.SECRET_KEY as string);
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
}