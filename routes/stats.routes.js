import {Router} from "express";

import {
    totalSold,
    bestSellingProduct,
    totalSoldCategory,
    totalSoldMonth
} from "../controllers/controll_stats.js";

const router = Router();

router.get('/total-sold', totalSold)
router.get('/best-selling-product', bestSellingProduct)
router.get('/total-sold-category', totalSoldCategory)
router.get('/total-sold-month', totalSoldMonth)

export default router;