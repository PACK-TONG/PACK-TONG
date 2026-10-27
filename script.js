const carrito = [];
const contadorAbajo = document.getElementById('bottomCartCount');
const totalAbajo = document.getElementById('bottomCartTotal');
const overlay = document.getElementById('cartOverlay');
const listaCarrito = document.getElementById('cartItems');
const totalCarrito = document.getElementById('cartTotal');
const mensaje = document.getElementById('message');
let ocultarMensaje;

function formatoPrecio(valor) {
  return '$' + valor.toLocaleString('es-CO');
}

function mostrarMensaje(texto) {
  mensaje.textContent = texto;
  mensaje.style.display = 'block';
  clearTimeout(ocultarMensaje);
  ocultarMensaje = setTimeout(() => mensaje.style.display = 'none', 2000);
}

function actualizarCarrito() {
  contadorAbajo.textContent = carrito.length;
  listaCarrito.innerHTML = '';
  if (carrito.length === 0) {
    listaCarrito.innerHTML = '<p class="empty">Todavía no has añadido productos.</p>';
  } else {
    carrito.forEach((producto, indice) => {
      const fila = document.createElement('div');
      fila.className = 'cart-row';
      const info = document.createElement('div');
      const nombre = document.createElement('strong');
      nombre.textContent = producto.nombre;
      const quitar = document.createElement('button');
      quitar.textContent = 'Quitar';
      quitar.addEventListener('click', () => {
        carrito.splice(indice, 1);
        actualizarCarrito();
      });
      info.append(nombre, quitar);
      const precio = document.createElement('span');
      precio.textContent = formatoPrecio(producto.precio);
      fila.append(info, precio);
      listaCarrito.appendChild(fila);
    });
  }
  const total = carrito.reduce((suma, producto) => suma + producto.precio, 0);
  totalCarrito.textContent = formatoPrecio(total);
  totalAbajo.textContent = formatoPrecio(total);
}

function abrirCarrito() {
  actualizarCarrito();
  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function cerrarCarrito() {
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

document.querySelectorAll('.add').forEach(boton => {
  boton.addEventListener('click', () => {
    carrito.push({ nombre: boton.dataset.name, precio: Number(boton.dataset.price) });
    actualizarCarrito();
    mostrarMensaje('Producto añadido al carrito.');
  });
});

document.getElementById('bottomCartButton').addEventListener('click', abrirCarrito);
document.getElementById('closeCart').addEventListener('click', cerrarCarrito);
overlay.addEventListener('click', evento => {
  if (evento.target === overlay) cerrarCarrito();
});
document.addEventListener('keydown', evento => {
  if (evento.key === 'Escape') cerrarCarrito();
});
document.getElementById('checkoutButton').addEventListener('click', () => {
  if (carrito.length === 0) {
    mostrarMensaje('Añade un producto antes de continuar.');
  } else {
    carrito.length = 0;
    actualizarCarrito();
    cerrarCarrito();
    mostrarMensaje('¡Gracias por tu compra!');
  }
});

actualizarCarrito();
