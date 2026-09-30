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
// Descargar historial como Excel (.xlsx)
btnDescargar.addEventListener('click', () => {
  const ventas = JSON.parse(localStorage.getItem('ventasRestaurante')) || [];

  if (ventas.length === 0) {
    alert('No hay ventas para descargar.');
    return;
  }

  const filas = [
    ['Fecha', 'Hora', 'Cliente / Mesa', 'Cantidad', 'Producto', 'Precio unitario', 'Subtotal', 'Total del pedido']
  ];

  ventas.forEach((venta, idx) => {
    // "29/9/2026, 17:05:12" -> fecha y hora separadas
    const [fecha, hora] = String(venta.fecha).split(',').map(s => s.trim());

    venta.items.forEach((item, n) => {
      const esUltimo = n === venta.items.length - 1;
      filas.push([
        fecha,
        hora || '',
        venta.cliente,
        item.cantidad,
        item.nombre,
        item.precio,
        item.cantidad * item.precio,
        esUltimo ? venta.total : ''   // el total solo en la última fila del pedido
      ]);
    });

    // Fila en blanco para separar pedidos
    if (idx < ventas.length - 1) filas.push([]);
  });

  const ws = XLSX.utils.aoa_to_sheet(filas);

  // Ancho de columnas
  ws['!cols'] = [
    { wch: 12 }, { wch: 10 }, { wch: 22 }, { wch: 10 },
    { wch: 28 }, { wch: 16 }, { wch: 12 }, { wch: 16 }
  ];

  // Formato de moneda en Precio unitario, Subtotal y Total
  for (let r = 1; r < filas.length; r++) {
    [5, 6, 7].forEach((c) => {
      const celda = ws[XLSX.utils.encode_cell({ r, c })];
      if (celda && typeof celda.v === 'number') celda.z = '"$"#,##0.00';
    });
  }

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Ventas');
  XLSX.writeFile(wb, `historial_ventas_${new Date().toISOString().slice(0, 10)}.xlsx`);
});
// Cargar ventas al iniciar la página
cargarVentas();