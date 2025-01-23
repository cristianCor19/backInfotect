import {Router} from "express";

import {
    totalSold,
    bestSellingProduct,
    totalSoldCategory
} from "../controllers/controll_stats.js";

const router = Router();

router.get('/total-sold', totalSold)
router.get('/best-selling-product', bestSellingProduct)
router.get('/total-sold-category', totalSoldCategory)

export default router;