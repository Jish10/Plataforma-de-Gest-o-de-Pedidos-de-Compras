const STATUS_PERMITIDOS = ['pendente', 'aprovado', 'rejeitado', 'recebido'];

function isPositiveInteger(value) {
  return Number.isInteger(Number(value)) && Number(value) > 0;
}

function isPositiveNumber(value) {
  return !Number.isNaN(Number(value)) && Number(value) > 0;
}

function isValidDate(value) {
  if (!value) return false;
  const date = new Date(value);
  return !Number.isNaN(date.getTime());
}

export function validateLogin(req, res, next) {
  const erros = [];
  const { email, senha } = req.body;

  if (!email) erros.push('O campo email é obrigatório.');
  if (!senha) erros.push('O campo senha é obrigatório.');

  if (erros.length > 0) {
    return res.status(400).json({ mensagem: 'Dados inválidos.', erros });
  }

  next();
}

export function validatePurchaseOrder(req, res, next) {
  const erros = [];
  const { user_id, supplier_id, data_pedido, status = 'pendente', itens } = req.body;

  if (!isPositiveInteger(user_id)) {
    erros.push('O campo user_id é obrigatório e deve ser um número inteiro maior que zero.');
  }

  if (!isPositiveInteger(supplier_id)) {
    erros.push('O campo supplier_id é obrigatório e deve ser um número inteiro maior que zero.');
  }

  if (data_pedido && !isValidDate(data_pedido)) {
    erros.push('O campo data_pedido deve conter uma data válida.');
  }

  if (!STATUS_PERMITIDOS.includes(status)) {
    erros.push(`O campo status deve ser um dos seguintes valores: ${STATUS_PERMITIDOS.join(', ')}.`);
  }

  if (!Array.isArray(itens) || itens.length === 0) {
    erros.push('O pedido deve ter pelo menos um item.');
  } else {
    const produtosRepetidos = new Set();
    const produtosVistos = new Set();

    itens.forEach((item, index) => {
      const posicao = index + 1;

      if (!isPositiveInteger(item.product_id)) {
        erros.push(`O item ${posicao} deve ter product_id válido.`);
      } else {
        const productId = Number(item.product_id);

        if (produtosVistos.has(productId)) {
          produtosRepetidos.add(productId);
        }

        produtosVistos.add(productId);
      }

      if (!isPositiveInteger(item.quantidade)) {
        erros.push(`O item ${posicao} deve ter quantidade maior que zero.`);
      }

      if (item.preco_unitario !== undefined && item.preco_unitario !== '' && !isPositiveNumber(item.preco_unitario)) {
        erros.push(`O item ${posicao} deve ter preco_unitario maior que zero.`);
      }
    });

    if (produtosRepetidos.size > 0) {
      erros.push('O mesmo produto não deve aparecer mais de uma vez no mesmo pedido.');
    }
  }

  // Regra de negócio simples: um pedido futuro ainda não pode estar como recebido.
  if (data_pedido && status === 'recebido') {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const dataPedido = new Date(data_pedido);
    dataPedido.setHours(0, 0, 0, 0);

    if (dataPedido > hoje) {
      erros.push('Um pedido com data futura não pode estar com status recebido.');
    }
  }

  if (erros.length > 0) {
    return res.status(400).json({ mensagem: 'Dados inválidos.', erros });
  }

  next();
}
