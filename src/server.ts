import 'express-async-errors'

import express, { NextFunction, Request, Response } from 'express'
import routes from './routes'

import { AppError } from './utils/errors/AppError'

const app = express()
app.use(express.json())

app.use(routes)

app.use(( error: Error, request: Request, response: Response, __next: NextFunction ) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: 'error',
      message: error.message
    })
  }

  console.error(error)

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error'
  })
})

const PORT = 3333
app.listen(PORT, () => console.log(`Sever is running on Port ${PORT}`))
