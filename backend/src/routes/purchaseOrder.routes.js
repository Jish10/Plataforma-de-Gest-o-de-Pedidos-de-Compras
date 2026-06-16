import { Router } from 'express';
import {
  createPurchaseOrder,
  deletePurchaseOrder,
  getPurchaseOrderById,
  listPurchaseOrders,
  updatePurchaseOrder
} from '../controllers/purchaseOrder.controller.js';
import { validatePurchaseOrder } from '../middleware/validation.middleware.js';

const router = Router();

router.get('/', listPurchaseOrders);
router.get('/:id', getPurchaseOrderById);
router.post('/', validatePurchaseOrder, createPurchaseOrder);
router.put('/:id', validatePurchaseOrder, updatePurchaseOrder);
router.delete('/:id', deletePurchaseOrder);

export default router;
