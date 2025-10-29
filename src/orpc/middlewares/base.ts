import { os } from '@orpc/server'
import { z } from 'zod'

export const base = os.errors({
  // common errors
  RATE_LIMITED: {
    data: z.object({
      retryAfter: z.number().int().min(1).default(1),
    }),
  },
  UNAUTHORIZED: {
    message: 'User is not authenticated xd',
  },
  BAD_REQUEST: {
    message: 'Simulated ORPC error adding todo :)',
    status: 400,
  },
})
