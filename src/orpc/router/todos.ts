import { ORPCError } from '@orpc/client'
import { base } from '@/orpc/middlewares/base'
import { z } from 'zod'
import { TodoSchema, TodoListSchema } from '@/orpc/schema'
import { prisma } from '@/db'

export const listTodos = base
  .input(z.object({}))
  .output(TodoListSchema)
  .handler(async ({ errors }) => {
    try {
      const todos = await prisma.todo.findMany()
      return todos
    } catch (error) {
      throw errors.BAD_REQUEST()
    }
  })

export const getTodoById = base
  .input(z.object({ id: TodoSchema.shape.id }))
  .output(TodoSchema)
  .handler(async ({ input, errors }) => {
    try {
      const todo = await prisma.todo.findUnique({
        where: { id: input.id },
      })
      if (!todo) {
        throw errors.NOT_FOUND()
      }
      return todo
    } catch (error) {
      if (error instanceof ORPCError) {
        throw error
      }
      throw errors.BAD_REQUEST()
    }
  })

export const addTodo = base
  .input(z.object({ title: TodoSchema.shape.title }))
  .output(TodoSchema)
  .handler(async ({ input, errors, context }) => {
    try {
      if (!input.title || input.title.length < 3) {
        throw errors.BAD_REQUEST()
      }
      await new Promise((resolve) => setTimeout(resolve, 2000)) // Simular retardo de 2000ms
      const newTodo = await prisma.todo.create({
        data: {
          title: input.title,
        },
      })
      return newTodo
    } catch (error) {
      if (error instanceof ORPCError) {
        throw error
      }
      throw errors.BAD_REQUEST()
    }
  })
