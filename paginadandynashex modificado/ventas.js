const tablaVentasBody = document.getElementById('tabla-ventas-body');
const totalRecaudadoEl = document.getElementById('total-recaudado');
const totalPedidosEl = document.getElementById('total-pedidos');
const btnLimpiar = document.getElementById('btn-limpiar');
const btnDescargar = document.getElementById('btn-descargar');

// Renderizar las ventas desde el localStorage
function cargarVentas() {
  const ventas = JSON.parse(localStorage.getItem('ventasRestaurante')) || [];

  tablaVentasBody.innerHTML = '';
  let recaudadoTotal = 0;

  if (ventas.length === 0) {
    tablaVentasBody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-muted);">No hay ventas registradas aún.</td></tr>`;
  } else {
    // Mostrar las ventas más recientes primero
    ventas.reverse().forEach((venta) => {
      recaudadoTotal += venta.total;

      const detalleItems = venta.items
        .map(i => `${i.cantidad}x ${i.nombre}`)
        .join(', ');

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><small>${venta.fecha}</small></td>
        <td><strong>${venta.cliente}</strong></td>
        <td>${detalleItems}</td>
        <td><strong>$${venta.total.toFixed(2)}</strong></td>
      `;
      tablaVentasBody.appendChild(tr);
    });
  }

  totalRecaudadoEl.textContent = `$${recaudadoTotal.toFixed(2)}`;
  totalPedidosEl.textContent = ventas.length;
}

// Escuchar cambios en `localStorage` desde OTRA pestaña para actualizar en TIEMPO REAL
window.addEventListener('storage', (e) => {
  if (e.key === 'ventasRestaurante') {
    cargarVentas();
  }
});

// Limpiar todo el historial
btnLimpiar.addEventListener('click', () => {
  if (confirm('¿Estás seguro de borrar todos los registros de ventas?')) {
    localStorage.removeItem('ventasRestaurante');
    cargarVentas();
  }
});
// Descargar historial como CSV (se abre con Excel)
btnDescargar.addEventListener('click', () => {
  const ventas = JSON.parse(localStorage.getItem('ventasRestaurante')) || [];

  if (ventas.length === 0) {
    alert('No hay ventas para descargar.');
    return;
  }

  // Envuelve el texto entre comillas y escapa comillas internas
  const esc = (texto) => `"${String(texto).replace(/"/g, '""')}"`;

  const encabezado = ['Fecha', 'Cliente / Mesa', 'Detalle', 'Total'].join(';');

  const filas = ventas.map((venta) => {
    const detalle = venta.items.map(i => `${i.cantidad}x ${i.nombre}`).join(', ');
    // Coma decimal para que Excel en español lo lea como número
    const total = venta.total.toFixed(2).replace('.', ',');
    return [esc(venta.fecha), esc(venta.cliente), esc(detalle), total].join(';');
  });

  // \uFEFF (BOM) hace que Excel muestre bien los acentos y la ñ
  const csv = '\uFEFF' + [encabezado, ...filas].join('\r\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `historial_ventas_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();

  URL.revokeObjectURL(url);
});
// Cargar ventas al iniciar la página
cargarVentas();