import { Router } from 'express'
import TagsController from '../controllers/tags-controller'

const tagsRouter = Router()
const tagsController = new TagsController()

tagsRouter.get('/', tagsController.index)

export default tagsRouter