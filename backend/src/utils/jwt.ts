import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import type { TokenPayload } from "../type/index";

export const signToken = (payload: TokenPayload) => {
  const options: SignOptions = {
    expiresIn: "7d",
  };

  return jwt.sign(payload, process.env.JWT_SECRET!, options);
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
};
