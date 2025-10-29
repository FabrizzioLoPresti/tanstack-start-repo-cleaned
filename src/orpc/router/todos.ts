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
      throw errors.UNAUTHORIZED()
    }
  })

export const addTodo = base
  .input(z.object({ name: z.string() }))
  .handler(({ input }) => {
    const newTodo = { id: todos.length + 1, name: input.name }
    todos.push(newTodo)
    return newTodo
  })
