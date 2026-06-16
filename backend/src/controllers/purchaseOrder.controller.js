import * as PurchaseOrderModel from '../models/purchaseOrder.model.js';
import { createHttpError } from '../utils/httpError.js';

export async function listPurchaseOrders(req, res, next) {
  try {
    const orders = await PurchaseOrderModel.findAll();
    res.json({ dados: orders });
  } catch (error) {
    next(error);
  }
}

export async function getPurchaseOrderById(req, res, next) {
  try {
    const order = await PurchaseOrderModel.findById(req.params.id);

    if (!order) {
      throw createHttpError(404, 'Pedido de compra não encontrado.');
    }

    res.json({ dados: order });
  } catch (error) {
    next(error);
  }
}

export async function createPurchaseOrder(req, res, next) {
  try {
    const order = await PurchaseOrderModel.create(req.body);
    res.status(201).json({
      mensagem: 'Pedido de compra criado com sucesso.',
      dados: order
    });
  } catch (error) {
    next(error);
  }
}

export async function updatePurchaseOrder(req, res, next) {
  try {
    const order = await PurchaseOrderModel.update(req.params.id, req.body);

    if (!order) {
      throw createHttpError(404, 'Pedido de compra não encontrado.');
    }

    res.json({
      mensagem: 'Pedido de compra atualizado com sucesso.',
      dados: order
    });
  } catch (error) {
    next(error);
  }
}

export async function deletePurchaseOrder(req, res, next) {
  try {
    const deleted = await PurchaseOrderModel.remove(req.params.id);

    if (!deleted) {
      throw createHttpError(404, 'Pedido de compra não encontrado.');
    }

    res.json({ mensagem: 'Pedido de compra apagado com sucesso.' });
  } catch (error) {
    next(error);
  }
}
