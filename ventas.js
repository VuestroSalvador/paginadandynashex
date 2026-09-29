const tablaVentasBody = document.getElementById('tabla-ventas-body');
const totalRecaudadoEl = document.getElementById('total-recaudado');
const totalPedidosEl = document.getElementById('total-pedidos');
const btnLimpiar = document.getElementById('btn-limpiar');

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

// Cargar ventas al iniciar la página
cargarVentas();