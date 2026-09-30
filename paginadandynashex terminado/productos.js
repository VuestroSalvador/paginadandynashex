const formProducto = document.getElementById('form-producto');
const listaProductos = document.getElementById('lista-productos');

function mostrarProductos() {
  const productos = obtenerProductos();
  listaProductos.innerHTML = '';

  if (productos.length === 0) {
    listaProductos.innerHTML = '<li style="color: var(--text-muted);">No hay productos cargados.</li>';
    return;
  }

  productos.forEach((p, i) => {
    const li = document.createElement('li');
    li.style.cssText = 'display: flex; justify-content: space-between; align-items: center; gap: 1rem;';
    li.innerHTML = `
      <span><strong>${p.nombre}</strong> - $${Number(p.precio).toFixed(2)}</span>
      <button data-indice="${i}" style="background: #e63946; color: white; border: none; padding: 0.3rem 0.7rem; border-radius: 4px; cursor: pointer;">Eliminar</button>
    `;
    listaProductos.appendChild(li);
  });
}

formProducto.addEventListener('submit', (e) => {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value.trim();
  const precio = parseFloat(document.getElementById('precio').value);
  const productos = obtenerProductos();

  if (productos.some(p => p.nombre.toLowerCase() === nombre.toLowerCase())) {
    alert('Ya existe un producto con ese nombre.');
    return;
  }

  productos.push({ nombre, precio });
  guardarProductos(productos);
  formProducto.reset();
  mostrarProductos();
});

listaProductos.addEventListener('click', (e) => {
  const indice = e.target.dataset.indice;
  if (indice === undefined) return;

  const productos = obtenerProductos();
  if (confirm(`¿Eliminar "${productos[indice].nombre}"?`)) {
    productos.splice(indice, 1);
    guardarProductos(productos);
    mostrarProductos();
  }
});

mostrarProductos();