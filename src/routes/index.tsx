import { createFileRoute } from '@tanstack/react-router'

// Import librerias de React Query (para consultar datos y mutaciones) y cliente de ORPC
import { useQuery, useMutation } from '@tanstack/react-query'
import { orpc } from '@/orpc/client'

export const Route = createFileRoute('/')({ component: App })

function App() {
  const {
    data: todos,
    refetch,
    isLoading: isLoadingTodos,
    isError: isErrorTodos,
    error: todosError,
  } = useQuery({
    queryKey: ['todos'],
    queryFn: () => orpc.listTodos.call({}),
    staleTime: 1000 * 60 * 5, // 5 minutes of stale time (cache time)
  })
  return (
    <div>
      <h1 className="text-4xl font-bold text-center mb-8">
        TanStack Start, React Query, TansStack Form, oRPC, Prisma
      </h1>
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4">Todo List</h2>
        {isLoadingTodos && <p>Loading todos...</p>}
        {isErrorTodos && (
          <p className="text-red-500">
            Error loading todos: {String(todosError)}
          </p>
        )}
        {todos && (
          <ul className="mb-4">
            {todos.map((todo) => (
              <li key={todo.id} className="border-b py-2">
                {todo.title}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
