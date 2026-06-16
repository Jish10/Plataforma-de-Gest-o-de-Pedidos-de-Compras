import { useEffect, useMemo, useState } from 'react';

const emptyItem = {
  product_id: '',
  quantidade: 1,
  preco_unitario: ''
};

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

function formatDateForInput(value) {
  if (!value) return getToday();
  return new Date(value).toISOString().slice(0, 10);
}

function OrderForm({ users, suppliers, products, editingOrder, onSave, onCancel }) {
  const [form, setForm] = useState({
    user_id: '',
    supplier_id: '',
    data_pedido: getToday(),
    status: 'pendente',
    observacoes: '',
    itens: [emptyItem]
  });

  useEffect(() => {
    if (editingOrder) {
      setForm({
        user_id: editingOrder.user_id,
        supplier_id: editingOrder.supplier_id,
        data_pedido: formatDateForInput(editingOrder.data_pedido),
        status: editingOrder.status,
        observacoes: editingOrder.observacoes || '',
        itens: editingOrder.itens?.length
          ? editingOrder.itens.map((item) => ({
              product_id: item.product_id,
              quantidade: item.quantidade,
              preco_unitario: item.preco_unitario
            }))
          : [{ ...emptyItem }]
      });
    } else {
      resetForm();
    }
  }, [editingOrder]);

  const produtosFiltrados = useMemo(() => {
    if (!form.supplier_id) return products;
    return products.filter((product) => Number(product.supplier_id) === Number(form.supplier_id));
  }, [form.supplier_id, products]);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function updateItem(index, field, value) {
    setForm((current) => {
      const itens = current.itens.map((item, itemIndex) => {
        if (itemIndex !== index) return item;
        return { ...item, [field]: value };
      });

      return { ...current, itens };
    });
  }

  function addItem() {
    setForm((current) => ({
      ...current,
      itens: [...current.itens, { ...emptyItem }]
    }));
  }

  function removeItem(index) {
    setForm((current) => {
      const itens = current.itens.filter((_, itemIndex) => itemIndex !== index);
      return { ...current, itens: itens.length ? itens : [{ ...emptyItem }] };
    });
  }

  function resetForm() {
    setForm({
      user_id: '',
      supplier_id: '',
      data_pedido: getToday(),
      status: 'pendente',
      observacoes: '',
      itens: [{ ...emptyItem }]
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    const payload = {
      ...form,
      user_id: Number(form.user_id),
      supplier_id: Number(form.supplier_id),
      itens: form.itens.map((item) => ({
        product_id: Number(item.product_id),
        quantidade: Number(item.quantidade),
        preco_unitario: item.preco_unitario === '' ? undefined : Number(item.preco_unitario)
      }))
    };

    onSave(payload);

    if (!editingOrder) {
      resetForm();
    }
  }

  function handleCancel() {
    resetForm();
    onCancel();
  }

  return (
    <section className="card">
      <div className="section-header">
        <div>
          <h2>{editingOrder ? `Editar pedido #${editingOrder.id}` : 'Novo pedido de compra'}</h2>
          <p className="muted">Preencha os dados do pedido. O preço pode ficar vazio para usar o preço cadastrado no produto.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="form-grid order-form">
        <label>
          Solicitante
          <select value={form.user_id} onChange={(event) => updateField('user_id', event.target.value)} required>
            <option value="">Selecione...</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.nome} — {user.departamento}
              </option>
            ))}
          </select>
        </label>

        <label>
          Fornecedor
          <select value={form.supplier_id} onChange={(event) => updateField('supplier_id', event.target.value)} required>
            <option value="">Selecione...</option>
            {suppliers.map((supplier) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.nome}
              </option>
            ))}
          </select>
        </label>

        <label>
          Data do pedido
          <input
            type="date"
            value={form.data_pedido}
            onChange={(event) => updateField('data_pedido', event.target.value)}
            required
          />
        </label>

        <label>
          Status
          <select value={form.status} onChange={(event) => updateField('status', event.target.value)}>
            <option value="pendente">Pendente</option>
            <option value="aprovado">Aprovado</option>
            <option value="rejeitado">Rejeitado</option>
            <option value="recebido">Recebido</option>
          </select>
        </label>

        <label className="full-width">
          Observações
          <textarea
            value={form.observacoes}
            onChange={(event) => updateField('observacoes', event.target.value)}
            placeholder="Ex.: pedido urgente para laboratório"
          />
        </label>

        <div className="full-width items-box">
          <div className="items-title">
            <h3>Itens do pedido</h3>
            <button type="button" className="secondary" onClick={addItem}>
              + Adicionar item
            </button>
          </div>

          {form.itens.map((item, index) => (
            <div className="item-row" key={`${index}-${item.product_id}`}>
              <label>
                Produto
                <select
                  value={item.product_id}
                  onChange={(event) => updateItem(index, 'product_id', event.target.value)}
                  required
                >
                  <option value="">Selecione...</option>
                  {produtosFiltrados.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.nome} — {Number(product.preco_unitario).toLocaleString('pt-PT')} CVE
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Quantidade
                <input
                  type="number"
                  min="1"
                  value={item.quantidade}
                  onChange={(event) => updateItem(index, 'quantidade', event.target.value)}
                  required
                />
              </label>

              <label>
                Preço unitário
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={item.preco_unitario}
                  onChange={(event) => updateItem(index, 'preco_unitario', event.target.value)}
                  placeholder="Automático"
                />
              </label>

              <button type="button" className="danger" onClick={() => removeItem(index)}>
                Remover
              </button>
            </div>
          ))}
        </div>

        <div className="actions full-width">
          {editingOrder && (
            <button type="button" className="secondary" onClick={handleCancel}>
              Cancelar edição
            </button>
          )}
          <button type="submit">
            {editingOrder ? 'Guardar alterações' : 'Criar pedido'}
          </button>
        </div>
      </form>
    </section>
  );
}

export default OrderForm;
