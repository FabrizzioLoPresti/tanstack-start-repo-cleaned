import { z } from 'zod'

export const TodoSchema = z.object({
  id: z.number().int().min(1),
  name: z.string(),
})

// Agrego esquema para lista de todos y que pueda ser referenciado en la documentacion de /api (api.$.ts)
export const TodoListSchema = z.array(TodoSchema)
