import { useEffect, useState } from 'react';
import Loading from '../components/Loading.jsx';
import Message from '../components/Message.jsx';
import OrderForm from '../components/OrderForm.jsx';
import OrderList from '../components/OrderList.jsx';
import {
  createPurchaseOrder,
  deletePurchaseOrder,
  getProducts,
  getPurchaseOrder,
  getPurchaseOrders,
  getSuppliers,
  getUsers,
  updatePurchaseOrder
} from '../services/api.js';

function PurchaseOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [editingOrder, setEditingOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  async function loadInitialData(clearMessage = true) {
    setLoading(true);

    if (clearMessage) {
      setMessage(null);
    }

    try {
      const [ordersResponse, usersResponse, suppliersResponse, productsResponse] = await Promise.all([
        getPurchaseOrders(),
        getUsers(),
        getSuppliers(),
        getProducts()
      ]);

      setOrders(ordersResponse.dados);
      setUsers(usersResponse.dados);
      setSuppliers(suppliersResponse.dados);
      setProducts(productsResponse.dados);
    } catch (error) {
      setMessage({ tipo: 'erro', texto: error.message });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadInitialData();
  }, []);

  async function handleSave(orderData) {
    setMessage(null);

    try {
      if (editingOrder) {
        await updatePurchaseOrder(editingOrder.id, orderData);
        setMessage({ tipo: 'sucesso', texto: 'Pedido atualizado com sucesso.' });
      } else {
        await createPurchaseOrder(orderData);
        setMessage({ tipo: 'sucesso', texto: 'Pedido criado com sucesso.' });
      }

      setEditingOrder(null);
      await loadInitialData(false);
    } catch (error) {
      setMessage({ tipo: 'erro', texto: error.message });
    }
  }

  async function handleEdit(order) {
    setMessage(null);

    try {
      const response = await getPurchaseOrder(order.id);
      setEditingOrder(response.dados);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      setMessage({ tipo: 'erro', texto: error.message });
    }
  }

  async function handleDelete(order) {
    const confirmed = window.confirm(`Deseja apagar o pedido #${order.id}?`);

    if (!confirmed) return;

    try {
      await deletePurchaseOrder(order.id);
      setMessage({ tipo: 'sucesso', texto: 'Pedido apagado com sucesso.' });
      await loadInitialData(false);
    } catch (error) {
      setMessage({ tipo: 'erro', texto: error.message });
    }
  }

  return (
    <main className="container">
      <section className="page-title">
        <div>
          <p className="eyebrow">Painel principal</p>
          <h1>Pedidos de Compras</h1>
          <p className="muted">Crie, liste, edite e apague pedidos de compra de forma simples.</p>
        </div>
      </section>

      <Message message={message} />

      <OrderForm
        users={users}
        suppliers={suppliers}
        products={products}
        editingOrder={editingOrder}
        onSave={handleSave}
        onCancel={() => setEditingOrder(null)}
      />

      {loading ? (
        <Loading />
      ) : (
        <OrderList
          orders={orders}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </main>
  );
}

export default PurchaseOrdersPage;
