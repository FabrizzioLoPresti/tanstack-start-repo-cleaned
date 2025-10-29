import { ORPCError } from '@orpc/client'
import { base } from '@/orpc/middlewares/base'
import { z } from 'zod'
import { TodoSchema, TodoListSchema } from '@/orpc/schema'
import { prisma } from '@/db'

const todos = [
  { id: 1, name: 'Get groceries' },
  { id: 2, name: 'Buy a new phone' },
  { id: 3, name: 'Finish the project' },
]

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
  .input(z.object({ id: z.number().int().min(1) }))
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
  .input(z.object({ name: z.string() }))
  .handler(({ input }) => {
    const newTodo = { id: todos.length + 1, name: input.name }
    todos.push(newTodo)
    return newTodo
  })
