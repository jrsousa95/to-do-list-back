/// <reference path="../@types/global.d.ts" />
import { verify } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

export interface ITokenPayload {
  id: number;
  name: string;
  email: string;
  iat: number;
  exp: number;
}
const SECRET_KEY = "SECRET_KEY_JWT";

export const auth = {
  verifyToken: (request: Request, response: Response, next: NextFunction) => {
    const token = request.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return response.status(500).json({ error: "Token inválido" });
    }

    try {
      const decoded = verify(token, SECRET_KEY) as ITokenPayload;

      request.user = decoded;

      next();
    } catch (error) {
      response.status(500).json({ error: "Token inválido" });
    }
  },
};
