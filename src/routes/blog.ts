import { Router } from 'express'
import { BlogController } from '../controllers/blog'
import { BlogValidator } from '../validators/blog'
import multer from '../middleware/multer'
import { Middleware } from '../middleware/auth'

const router = Router({ mergeParams: true })
const controller = new BlogController()
const validator = new BlogValidator()
const middleware = new Middleware()

const upload = multer(['image/png', 'image/jpeg'], 10).single('images')

router.route('/all').get(controller.getAll)
router
    .route('/create')
    .post(middleware.auth(['admin']), upload, validator.create, controller.create)
router.route('/filter/:id').get(controller.getAll)
router
    .route('/:id')
    .get(controller.get)
    .patch(middleware.auth(['admin']), upload, validator.update, controller.update)
    .delete(middleware.auth(['admin']), controller.delete)

export default router
