import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-center mb-8">
        TanStack Start, React Query, TansStack Form, oRPC, Prisma
      </h1>
    </div>
  )
}
