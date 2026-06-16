import * as LookupModel from '../models/lookup.model.js';

export async function listUsers(req, res, next) {
  try {
    const users = await LookupModel.findUsers();
    res.json({ dados: users });
  } catch (error) {
    next(error);
  }
}

export async function listSuppliers(req, res, next) {
  try {
    const suppliers = await LookupModel.findSuppliers();
    res.json({ dados: suppliers });
  } catch (error) {
    next(error);
  }
}

export async function listProducts(req, res, next) {
  try {
    const products = await LookupModel.findProducts();
    res.json({ dados: products });
  } catch (error) {
    next(error);
  }
}
