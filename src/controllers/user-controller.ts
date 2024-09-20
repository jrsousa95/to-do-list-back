import { PrismaClient } from "@prisma/client";
import { compare, hash } from "bcrypt";
import { Request, Response } from "express";
import Joi from "joi";
import { sign } from "jsonwebtoken";

const prisma = new PrismaClient();

const SECRET_KEY = "SECRET_KEY_JWT";

const registerSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export default {
  register: async (request: Request, response: Response) => {
    const { error } = registerSchema.validate(request.body);

    if (error) {
      return response.status(400).json({ error: error.details[0].message });
    }

    const { name, email, password } = request.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return response.status(400).json({ error: "Usuário já existe." });
    }

    const hashedPassword = await hash(password, 8);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return response
      .status(201)
      .json({ message: "Usuário criado com sucesso." });
  },

  login: async (request: Request, response: Response) => {
    const { error } = loginSchema.validate(request.body);

    if (error) {
      return response.status(400).json({ error: error.details[0].message });
    }

    const { email, password } = request.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return response.status(400).json({ error: "Usuário não encontrado." });
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      return response.status(400).json({ error: "Senha inválida." });
    }

    const token = sign(
      { id: user.id, name: user.name, email: user.email },
      SECRET_KEY,
      {
        expiresIn: "24h",
      }
    );

    const userView = {
      id: user.id,
      name: user.name,
      email: user.email,
      token,
    };

    return response
      .status(200)
      .json({ message: "Login realizado.", user: userView });
  },
};
