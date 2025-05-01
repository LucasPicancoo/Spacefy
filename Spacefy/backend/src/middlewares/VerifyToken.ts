import jwt from 'jsonwebtoken';

export const verifyToken = (token: string): { id: string, name: string } => {
  if (!token) {
    throw new Error("Authorization token is required.");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY as string) as { id: string, name: string };
    return { id: decoded.id, name: decoded.name };
  } catch (error) {
    throw new Error("Invalid or expired token.");
  }
};