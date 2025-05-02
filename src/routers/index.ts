import { Router } from 'express'
import authRouter from '@/routers/auth.route'
import brandRouter from '@/routers/brand.route'
import categoryRouter from '@/routers/category.route'
import productRouter from '@/routers/product.route'
// import productVariantRouter from '@/routers/productVariant.route'
import verifyJWT from '@/middleware/verifyJWT'
const router = Router()
router.use('/auth', authRouter)
router.use('/brand', brandRouter)
router.use('/category', categoryRouter)
router.use('/product', productRouter)
// router.use('/product/variant', productVariantRouter)
router.use(verifyJWT)

export default router
