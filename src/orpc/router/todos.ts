import { base } from '@/orpc/middlewares/base'
import { z } from 'zod'
import { TodoSchema, TodoListSchema } from '@/orpc/schema'

const todos = [
  { id: 1, name: 'Get groceries' },
  { id: 2, name: 'Buy a new phone' },
  { id: 3, name: 'Finish the project' },
]

export const listTodos = base
  .input(z.object({}))
  .output(TodoListSchema)
  .handler(async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return todos
  })

export const addTodo = base
  .input(z.object({ name: z.string() }))
  .handler(({ input }) => {
    const newTodo = { id: todos.length + 1, name: input.name }
    todos.push(newTodo)
    return newTodo
  })
