import { verify } from "jsonwebtoken";
import { ITokenPayload } from "../types";
import { NextFunction, Request, Response } from "express";

const SECRET_KEY = "SECRET_KEY_JWT";

export const auth = {
  verifyToken: (request: Request, response: Response, next: NextFunction) => {
    const token = request.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return response
        .status(401)
        .json({ error: "Acesso negado. Por favor, faca o login." });
    }

    try {
      const decoded = verify(token, SECRET_KEY) as ITokenPayload;

      // request.user = decoded;
      next();
    } catch (error) {
      response.status(401).json({ error: "Token inválido." });
    }
  },
};
