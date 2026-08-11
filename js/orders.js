// orders.js - renders a simple orders list from /orders.json or localStorage

async function loadOrders() {
  try {
    const resp = await fetch('/orders.json', { cache: 'no-store' });
    if (!resp.ok) throw new Error('no-json');
    const orders = await resp.json();
    return orders;
  } catch (e) {
    // fallback to localStorage
    const raw = localStorage.getItem('demo_orders');
    return raw ? JSON.parse(raw) : [];
  }
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleString();
}

function renderOrders(orders) {
  const tbody = document.querySelector('#ordersTable tbody');
  const noOrders = document.getElementById('noOrders');
  tbody.innerHTML = '';
  if (!orders || orders.length === 0) {
    noOrders.style.display = 'block';
    return;
  }
  noOrders.style.display = 'none';

  orders.forEach(order => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${order.id}</td>
      <td>${formatDate(order.date)}</td>
      <td>${order.status}</td>
      <td>¥${order.total.toFixed(2)}</td>
      <td><button class="btn-small" data-id="${order.id}">查看详情</button></td>
    `;
    tbody.appendChild(tr);

    const itemsRow = document.createElement('tr');
    const itemsTd = document.createElement('td');
    itemsTd.colSpan = 5;
    itemsTd.style.padding = '0 12px 12px 12px';
    itemsTd.innerHTML = `<div id="items-${order.id}" class="order-items" style="display:none;"></div>`;
    itemsRow.appendChild(itemsTd);
    tbody.appendChild(itemsRow);
  });

  // attach handlers
  tbody.querySelectorAll('button[data-id]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      const el = document.getElementById(`items-${id}`);
      if (el.style.display === 'none') {
        const order = orders.find(o => String(o.id) === String(id));
        el.innerHTML = renderOrderItemsHtml(order.items);
        el.style.display = 'block';
        e.currentTarget.textContent = '隐藏详情';
      } else {
        el.style.display = 'none';
        e.currentTarget.textContent = '查看详情';
      }
    });
  });
}

function renderOrderItemsHtml(items) {
  if (!items || items.length === 0) return '<em>无商品</em>';
  let html = '<ul style="margin:0; padding-left:18px;">';
  items.forEach(it => {
    html += `<li>${it.title} × ${it.qty} — ¥${it.price.toFixed(2)}</li>`;
  });
  html += '</ul>';
  return html;
}

(async function(){
  const orders = await loadOrders();
  renderOrders(orders);
})();
