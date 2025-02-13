import jwt from "jsonwebtoken";


export interface JwtPayload {
  id: string;
  role: string;
}

export const getUserFromToken = (token: string): JwtPayload | null => {
  try {
    if (!token) return null;
    return jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
  } catch (error) {
    throw new Error("Invalid or expired token.");
  }
};
