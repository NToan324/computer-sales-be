import { Router } from 'express'
import brandRouter from '@/routers/brand.route'
import categoryRouter from '@/routers/category.route'
import productRouter from '@/routers/product.route'
import verifyJWT from '@/middleware/verifyJWT'
const router = Router()

router.use('/brand', brandRouter)
router.use('/category', categoryRouter)
router.use('/product', productRouter)
router.use(verifyJWT)

export default router
