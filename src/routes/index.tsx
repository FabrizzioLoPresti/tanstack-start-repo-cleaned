import { createFileRoute } from '@tanstack/react-router'

// Import librerias de React Query (para consultar datos y mutaciones) y cliente de ORPC
import { useQuery, useMutation } from '@tanstack/react-query'
import { orpc } from '@/orpc/client'

// Importar el hook useAppForm de TanStack Form
import { useAppForm } from '@/hooks/demo.form'
import { TodoSchema } from '@/orpc/schema'
import { z } from 'zod'

export const Route = createFileRoute('/')({ component: App })

const schema = TodoSchema.pick({ title: true })

function App() {
  // ! Get List of Todos from the oRPC endpoint using React Query
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

  // ! Get Todo by ID from the oRPC endpoint using React Query
  // Consulta inicial de un todo por ID usando React Query al iniciar el componente
  // Se pueden pasar parametros de la pagina por ejemplo para obtener diferentes todos
  const {
    data: todoByIdInit,
    isLoading: isLoadingTodoByIdInit,
    isError: isErrorTodoByIdInit,
    error: errorTodoByIdInit,
  } = useQuery({
    queryKey: ['todo', { id: 2 }],
    queryFn: () => orpc.getTodoById.call({ id: 2 }),
    staleTime: 1000 * 60 * 5, // 5 minutes of stale time (cache time)
  })

  // ! Get Todo by ID from mutation
  // Mutacion para obtener un todo por ID al ejecutar una accion (click de boton por ejemplo)
  // Se pueden pasar parametros dinamicos
  const {
    mutate: getTodoById,
    data: todoById,
    isPending: isPendingTodoById,
    isError: isErrorTodoById,
    error: errorTodoById,
  } = useMutation({
    mutationFn: (input: { id: number }) => orpc.getTodoById.call(input),
    onSuccess: (data) => {
      console.log('Todo fetched by ID:', data)
    },
  })

  // ! Add new Todo from TanStack Form using oRPC mutation
  const {
    mutate: addTodo,
    data: newTodo,
    isPending: isPendingAddTodo,
    isError: isErrorAddTodo,
    error: errorAddTodo,
  } = useMutation({
    // mutationFn: (input: { title: string }) => orpc.addTodo.call(input),
    mutationFn: (newTodo: z.infer<typeof schema>) => orpc.addTodo.call(newTodo),
    onSuccess: (data) => {
      console.log('New Todo added:', data)
      // Refetch the todos list after adding a new todo
      refetch()
      form.reset()
    },
    onError: (error: Error) => {
      alert(`Error adding todo: ${error.message}`)
    },
  })

  // ! Initialize TanStack Form
  const form = useAppForm({
    defaultValues: {
      title: '',
    },
    validators: {
      onBlur: schema,
    },
    onSubmit: ({ value }) => {
      console.log(value)
      // Show success message
      addTodo({ title: value.title })
    },
  })

  return (
    <div>
      <h1 className="text-4xl font-bold text-center mb-8">
        TanStack Start, React Query, TansStack Form, oRPC, Prisma
      </h1>
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4">Todo List</h2>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => refetch()}
        >
          Refetch Todos
        </button>
        {isLoadingTodos && <p>Loading todos...</p>}
        {isErrorTodos && (
          <p className="text-red-500">
            Error loading todos: {todosError.message}
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
      <div className="max-w-md mx-auto mb-8">
        <h2 className="text-2xl font-bold mb-4">
          Initial Get Todo by ID (Query)
        </h2>
        {isLoadingTodoByIdInit && <p>Loading todo by ID...</p>}
        {isErrorTodoByIdInit && (
          <p className="text-red-500">
            Error loading todo: {errorTodoByIdInit.message}
          </p>
        )}
        {todoByIdInit && (
          <div className="p-4 border rounded">
            <h3 className="font-bold">Todo Details:</h3>
            <p>ID: {todoByIdInit.id}</p>
            <p>Title: {todoByIdInit.title}</p>
            <p>
              Created At: {new Date(todoByIdInit.createdAt).toLocaleString()}
            </p>
          </div>
        )}
      </div>
      <div className="max-w-md mx-auto mt-8">
        <h2 className="text-2xl font-bold mb-4">Get Todo by ID (Mutation)</h2>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => getTodoById({ id: 1 })}
          disabled={isPendingTodoById}
        >
          {isPendingTodoById ? 'Fetching...' : 'Fetch Todo with ID 1'}
        </button>
        {isErrorTodoById && (
          <p className="text-red-500">
            Error fetching todo: {errorTodoById.message}
          </p>
        )}
        {todoById && (
          <div className="mt-4 p-4 border rounded">
            <h3 className="font-bold">Todo Details:</h3>
            <p>ID: {todoById.id}</p>
            <p>Title: {todoById.title}</p>
            <p>Created At: {new Date(todoById.createdAt).toLocaleString()}</p>
          </div>
        )}
      </div>

      <div className="max-w-md mx-auto mt-8">
        <h2 className="text-2xl font-bold mb-4">TanStack Form Demo</h2>
        {isPendingAddTodo && <p>Adding todo...</p>}
        {isErrorAddTodo && (
          <p className="text-red-500">
            Error adding todo: {errorAddTodo.message}
          </p>
        )}
        {newTodo && (
          <div className="mt-4 p-4 border rounded">
            <h3 className="font-bold">New Todo Added:</h3>
            <p>ID: {newTodo.id}</p>
            <p>Title: {newTodo.title}</p>
            <p>Created At: {new Date(newTodo.createdAt).toLocaleString()}</p>
          </div>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-6"
        >
          <form.AppField name="title">
            {(field) => <field.TextField label="Title" />}
          </form.AppField>

          <div className="flex justify-end">
            <form.AppForm>
              <form.SubscribeButton label="Submit" />
            </form.AppForm>
          </div>
        </form>
      </div>
    </div>
  )
}
