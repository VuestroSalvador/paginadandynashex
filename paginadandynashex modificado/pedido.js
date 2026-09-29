let ordenActual = [];

const formItem = document.getElementById('item-form');
const selectProducto = document.getElementById('producto');
const inputCantidad = document.getElementById('cantidad');
const inputCliente = document.getElementById('cliente');
const listaPedido = document.getElementById('lista-pedido');
const totalPedidoElement = document.getElementById('total-pedido');
const btnCompletar = document.getElementById('btn-completar');

// Añadir un item a la orden actual
formItem.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const option = selectProducto.options[selectProducto.selectedIndex];
  const nombre = option.value;
  const precio = parseFloat(option.getAttribute('data-precio'));
  const cantidad = parseInt(inputCantidad.value);

  const subtotal = precio * cantidad;

  ordenActual.push({
    nombre,
    precio,
    cantidad,
    subtotal
  });

  actualizarVistaOrden();
  formItem.reset();
});

// Actualizar la lista en pantalla
function actualizarVistaOrden() {
  listaPedido.innerHTML = '';
  let total = 0;

  ordenActual.forEach((item, index) => {
    total += item.subtotal;
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${item.cantidad}x ${item.nombre}</span>
      <span>$${item.subtotal.toFixed(2)}</span>
    `;
    listaPedido.appendChild(li);
  });

  totalPedidoElement.textContent = `$${total.toFixed(2)}`;
}

// Finalizar la orden y guardarla en localStorage
btnCompletar.addEventListener('click', () => {
  if (ordenActual.length === 0) {
    alert('Por favor agrega al menos un producto a la orden.');
    return;
  }

  const cliente = inputCliente.value.trim() || 'Cliente General';
  
  const nuevaVenta = {
    id: Date.now(),
    fecha: new Date().toLocaleString(),
    cliente: cliente,
    items: ordenActual,
    total: ordenActual.reduce((acc, item) => acc + item.subtotal, 0)
  };

  // Obtener ventas guardadas anteriormente
  const ventasGuardadas = JSON.parse(localStorage.getItem('ventasRestaurante')) || [];
  ventasGuardadas.push(nuevaVenta);

  // Guardar de nuevo en localStorage
  localStorage.setItem('ventasRestaurante', JSON.stringify(ventasGuardadas));

  alert('¡Pedido registrado e ingresado a las ventas!');

  // Limpiar pedido actual
  ordenActual = [];
  inputCliente.value = '';
  actualizarVistaOrden();
});