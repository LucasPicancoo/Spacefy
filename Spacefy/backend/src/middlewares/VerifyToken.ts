import jwt from 'jsonwebtoken';

export const verifyToken = (token: string): string => {
  if (!token) {
    throw new Error("Authorization token is required.");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY as string) as { id: string };
    return decoded.id;
  } catch (error) {
    throw new Error("Invalid or expired token.");
  }
};