import {Router} from "express";

import {
    totalSold,
    bestSellingProduct
} from "../controllers/controll_stats.js";

const router = Router();

router.get('/total-sold', totalSold)
router.get('/best-selling-product', bestSellingProduct)

export default router;