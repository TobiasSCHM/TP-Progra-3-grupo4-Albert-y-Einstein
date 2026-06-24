// Se importa en: productos.html, carrito.html, ticket.html

const KEY_CARRITO = 'soundstore_carrito';
const KEY_NOMBRE  = 'clienteNombre';
const KEY_TEMA    = 'soundstore_tema';

//guardado de nombre

function requireNombre() {
    const nombre = localStorage.getItem(KEY_NOMBRE);
    if (!nombre || !nombre.trim()) {
        window.location.href = '/index.html';
    }
    return nombre;
}

function getNombre() {
    return localStorage.getItem(KEY_NOMBRE) || '';
}

//estructura del carrito: {id, nombre, precio, cantidad}

function getCarrito() {
    try {
        return JSON.parse(localStorage.getItem(KEY_CARRITO)) || [];
    } catch {
        return [];
    }
}
// Guarda el carrito en localStorage
function guardarCarrito(carrito) {
    localStorage.setItem(KEY_CARRITO, JSON.stringify(carrito));
}

function agregarAlCarrito(producto) {
    const carrito = getCarrito();
    const existente = carrito.find(item => item.id === producto.id);
    if (existente) {
        existente.cantidad += 1;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }
    guardarCarrito(carrito);
    actualizarContadorCarrito();
}

function eliminarDelCarrito(id) {
    // Filtra el carrito para eliminar el producto con el id dado y guarda el carrito actualizado
    guardarCarrito(getCarrito().filter(item => item.id !== id));
    actualizarContadorCarrito();
}

function actualizarCantidad(id, nuevaCantidad) {
    const cantidad = parseInt(nuevaCantidad);
    if (isNaN(cantidad) || cantidad <= 0) {
        eliminarDelCarrito(id);
        return;
    }
    const carrito = getCarrito();
    const item = carrito.find(item => item.id === id);
    if (item) {
        item.cantidad = cantidad;
        guardarCarrito(carrito);
    }
    actualizarContadorCarrito();
}

function getTotalItems() {
    return getCarrito().reduce((total, item) => total + item.cantidad, 0);
}

function getTotalPrecio() {
    return getCarrito().reduce((total, item) => total + item.precio * item.cantidad, 0);
}

function vaciarCarrito() {
    localStorage.removeItem(KEY_CARRITO);
    actualizarContadorCarrito();
}

function actualizarContadorCarrito() {
    const badge = document.getElementById('carrito-badge');
    if (!badge) return;
    const total = getTotalItems();
    badge.textContent = total;
    badge.style.display = total > 0 ? 'inline-block' : 'none';
}

//temas claro oscuro

function aplicarTema(tema) {
    document.documentElement.setAttribute('data-tema', tema);
    localStorage.setItem(KEY_TEMA, tema);
    const btn = document.getElementById('btn-tema');
    if (btn) btn.textContent = tema === 'oscuro' ? ' Claro' : ' Oscuro';
}

// Cambia entre tema claro y oscuro, guardando la preferencia en localStorage
function toggleTema() {
    const actual = localStorage.getItem(KEY_TEMA) || 'claro';
    aplicarTema(actual === 'claro' ? 'oscuro' : 'claro');
}

function initTema() {
    aplicarTema(localStorage.getItem(KEY_TEMA) || 'claro');
}

//partials

async function cargarPartial(selectorContenedor, rutaHTML) {
    const contenedor = document.querySelector(selectorContenedor);
    if (!contenedor) return;
    try {
        const res = await fetch(rutaHTML);
        if (!res.ok) throw new Error('No se pudo cargar el partial');
        contenedor.innerHTML = await res.text();

        const btnAdmin = contenedor.querySelector('#btn-admin-link');
        if (btnAdmin) btnAdmin.href = `${BACKEND_URL}/admin/login`;
    } catch (err) {
        console.error(`Error cargando partial (${rutaHTML}):`, err);
    }
}

async function initLayout() {
    await cargarPartial('#header-container', '/partials/header.html');
    await cargarPartial('#footer-container', '/partials/footer.html');
    actualizarContadorCarrito();
    const btnTema = document.getElementById('btn-tema');
    if (btnTema) btnTema.addEventListener('click', toggleTema);
}

//formateo de precio y fecha

function formatearPrecio(precio) {
    return `$${Number(precio).toLocaleString('es-AR')}`;
}

function formatearFecha(fecha) {
    return new Date(fecha).toLocaleDateString('es-AR', {
        day: '2-digit', month: '2-digit', year: 'numeric'
    });
}

//init

document.addEventListener('DOMContentLoaded', () => {
    initTema();
});