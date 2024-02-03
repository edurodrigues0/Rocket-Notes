import { Router } from 'express'
import usersRouter from './users.routes'
import notesRouter from './notes.routes '

const routes = Router()

routes.use('/users', usersRouter)
routes.use('/notes', notesRouter)

export default routes