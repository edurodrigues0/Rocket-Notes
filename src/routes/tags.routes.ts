import { Router } from 'express'
import TagsController from '../controllers/tags-controller'
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated'

const tagsRouter = Router()
const tagsController = new TagsController()

tagsRouter.get('/', ensureAuthenticated, tagsController.index)

export default tagsRouter