import { errors } from "./../../node_modules/@sideway/address/lib/index.d";
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import Joi from "joi";

const prisma = new PrismaClient();

const tackParams = Joi.object({
  id: Joi.number().required(),
});

const taskSchema = Joi.object({
  title: Joi.string().required(),
});

const taskUpdateSchema = Joi.object({
  title: Joi.string().required(),
  completed: Joi.boolean().required(),
});

export const taskController = {
  createTask: async (request: Request, response: Response) => {
    const { error } = taskSchema.validate(request.body);

    if (error) {
      return response.status(400).json({ error: error.details[0].message });
    }

    const { title } = request.body;

    // const userId = request.user?.id;
    const userId = 1;

    if (!userId) {
      return response.status(400).json({ error: "Usuário não encontrado." });
    }

    const task = await prisma.task.create({
      data: {
        title,
        fk_user_id: userId,
      },
    });

    response.status(201).json({
      message: "Tarefa criada com sucesso!",
    });
  },

  getTasks: async (request: Request, response: Response) => {
    // const userId = request.user?.id;
    const userId = 1;

    const tasks = await prisma.task.findMany({
      where: {
        fk_user_id: userId,
      },
    });

    const taskView = tasks.map((task) => {
      return {
        id: task.id,
        title: task.title,
        completed: task.completed,
      };
    });

    response.status(200).json(taskView);
  },

  updateTask: async (request: Request, response: Response) => {
    const { error: errorParams } = tackParams.validate(request.params);

    if (errorParams) {
      return response
        .status(400)
        .json({ error: errorParams.details[0].message });
    }

    const { error } = taskUpdateSchema.validate(request.body);

    if (error) {
      return response.status(400).json({ error: error.details[0].message });
    }

    const { title, completed } = request.body;

    const { id } = request.params;

    const taskExist = await prisma.task.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!taskExist) {
      return response.status(400).json({ error: "Tarefa não encontrada." });
    }

    const task = await prisma.task.update({
      where: {
        id: Number(id),
      },
      data: {
        title,
        completed,
      },
    });

    response.status(200).json({
      message: "Tarefa atualizada com sucesso!",
    });
  },

  deleteTask: async (request: Request, response: Response) => {
    const { error } = tackParams.validate(request.params);

    if (error) {
      return response.status(400).json({ error: error.details[0].message });
    }

    const { id } = request.params;

    const taskExist = await prisma.task.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!taskExist) {
      return response.status(400).json({ error: "Tarefa não encontrada." });
    }

    await prisma.task.delete({
      where: {
        id: Number(id),
      },
    });

    response.status(200).json({
      message: "Tarefa excluída com sucesso!",
    });
  },
};
