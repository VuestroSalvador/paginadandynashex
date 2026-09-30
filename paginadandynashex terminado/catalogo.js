const CLAVE_PRODUCTOS = 'productosRestaurante';

const PRODUCTOS_INICIALES = [
  { nombre: 'Hamburguesa Clásica', precio: 8.50 },
  { nombre: 'Pizza Margherita', precio: 12.00 },
  { nombre: 'Papas Fritas', precio: 4.00 },
  { nombre: 'Refresco 500ml', precio: 2.50 },
  { nombre: 'Cerveza Artesanal', precio: 4.50 },
  { nombre: 'Postre Helado', precio: 3.50 }
];

function obtenerProductos() {
  const guardados = JSON.parse(localStorage.getItem(CLAVE_PRODUCTOS));
  if (guardados) return guardados;
  // Primera vez: se cargan los 6 productos que ya tenías
  localStorage.setItem(CLAVE_PRODUCTOS, JSON.stringify(PRODUCTOS_INICIALES));
  return PRODUCTOS_INICIALES;
}

function guardarProductos(lista) {
  localStorage.setItem(CLAVE_PRODUCTOS, JSON.stringify(lista));
}

// Llena el <select> de "Nuevo Pedido" (solo hace algo si existe)
function cargarSelectProductos() {
  const select = document.getElementById('producto');
  if (!select) return;

  obtenerProductos().forEach((p) => {
    const opt = document.createElement('option');
    opt.value = p.nombre;
    opt.dataset.precio = p.precio;
    opt.textContent = `${p.nombre} - $${Number(p.precio).toFixed(2)}`;
    select.appendChild(opt);
  });
}

cargarSelectProductos();