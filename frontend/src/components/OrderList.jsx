function formatCurrency(value) {
  return Number(value || 0).toLocaleString('pt-PT', {
    style: 'currency',
    currency: 'CVE'
  });
}

function formatDate(value) {
  if (!value) return '-';
  return new Date(value).toLocaleDateString('pt-PT');
}

function StatusBadge({ status }) {
  return <span className={`badge ${status}`}>{status}</span>;
}

function OrderList({ orders, onEdit, onDelete }) {
  if (orders.length === 0) {
    return (
      <section className="card empty-state">
        <h2>Nenhum pedido encontrado</h2>
        <p className="muted">Crie o primeiro pedido usando o formulário acima.</p>
      </section>
    );
  }

  return (
    <section className="card">
      <div className="section-header">
        <div>
          <h2>Lista de pedidos</h2>
          <p className="muted">Total de pedidos cadastrados: {orders.length}</p>
        </div>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Solicitante</th>
              <th>Fornecedor</th>
              <th>Data</th>
              <th>Status</th>
              <th>Itens</th>
              <th>Total</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{order.solicitante}</td>
                <td>{order.fornecedor}</td>
                <td>{formatDate(order.data_pedido)}</td>
                <td><StatusBadge status={order.status} /></td>
                <td>{order.total_itens}</td>
                <td>{formatCurrency(order.total)}</td>
                <td className="row-actions">
                  <button type="button" className="secondary" onClick={() => onEdit(order)}>
                    Editar
                  </button>
                  <button type="button" className="danger" onClick={() => onDelete(order)}>
                    Apagar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default OrderList;
