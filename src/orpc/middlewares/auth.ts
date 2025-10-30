import { base } from './base'

export const requiredAuthMiddleware = base
  .$context<{ user?: { id: number; name: string; email: string } }>()
  .middleware(async ({ context, next, errors }) => {
    // Verificar si tengo usuario autenticado en el contexto
    console.log('Auth Middleware - Current context user:', context.user) // No toma usuario del contexto anterior, es unico por cada vez que se llama el middleware
    const session = await getSession()

    if (!session) {
      throw errors.UNAUTHORIZED()
    }

    return next({
      context: {
        // Pass additional context
        user: session,
      },
    })
  })

const notAuthenticated = false // Simulacion de usuario no autenticado

const getSession = async () => {
  if (notAuthenticated) return null
  return { id: 1, name: 'John', email: 'john@example.com' }
}

export const authed = base.use(requiredAuthMiddleware)
