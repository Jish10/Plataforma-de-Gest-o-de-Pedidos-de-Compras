import { Router } from 'express';
import { listProducts, listSuppliers, listUsers } from '../controllers/lookup.controller.js';

const router = Router();

router.get('/users', listUsers);
router.get('/suppliers', listSuppliers);
router.get('/products', listProducts);

export default router;
