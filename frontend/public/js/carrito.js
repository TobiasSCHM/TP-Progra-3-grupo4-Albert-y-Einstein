

function renderCarrito() {
    const carrito = getCarrito();
    const lista   = document.getElementById('carrito-lista');
    const vacio   = document.getElementById('carrito-vacio');
    const resumen = document.getElementById('carrito-resumen');

    if (carrito.length === 0) {
        lista.innerHTML = '';
        vacio.classList.remove('oculto');
        resumen.classList.add('oculto');
        return;
    }

    vacio.classList.add('oculto');
    resumen.classList.remove('oculto');

    lista.innerHTML = carrito.map(item => {
        const imagenSrc = item.imagen || '/images/sin-imagen.png';
        const subtotal  = item.precio * item.cantidad;

        return `
        <article class="carrito-item" data-id="${item.id}">
            <img
                src="${imagenSrc}"
                alt="${escaparHTML(item.nombre)}"
                class="carrito-item-img"
                onerror="this.src='/images/sin-imagen.png'"
            >
            <div class="carrito-item-info">
                <p class="carrito-item-nombre">${escaparHTML(item.nombre)}</p>
                <p class="carrito-item-categoria">${escaparHTML(item.categoria || '')}</p>
                <p class="carrito-item-precio-unit">${formatearPrecio(item.precio)} / unidad</p>
            </div>
            <div class="carrito-item-controles">
                <button class="btn-cantidad" onclick="cambiarCantidad(${item.id}, ${item.cantidad - 1})">−</button>
                <span class="cantidad-valor">${item.cantidad}</span>
                <button class="btn-cantidad" onclick="cambiarCantidad(${item.id}, ${item.cantidad + 1})">+</button>
            </div>
            <div class="carrito-item-subtotal">
                <span>${formatearPrecio(subtotal)}</span>
                <button class="btn-eliminar" onclick="quitarItem(${item.id})" title="Quitar">✕</button>
            </div>
        </article>`;
    }).join('');

    actualizarResumen();
}

function actualizarResumen() {
    const total = getTotalPrecio();
    document.getElementById('resumen-subtotal').textContent = formatearPrecio(total);
    document.getElementById('resumen-total').textContent    = formatearPrecio(total);
}


function cambiarCantidad(id, nuevaCantidad) {
    actualizarCantidad(id, nuevaCantidad); // main.js borra el item si queda en 0
    renderCarrito();
}

function quitarItem(id) {
    eliminarDelCarrito(id); // main.js
    renderCarrito();
}

async function confirmarCompra() {
    const carrito = getCarrito();
    const nombre  = getNombre();

    if (carrito.length === 0) return;

    const btn = document.getElementById('btn-confirmar');
    btn.disabled    = true;
    btn.textContent = 'Procesando...';

    // Construye el payload que espera saleController:
    // { sale_customer_name, sale_total, productos: [{ id, cantidad }] }
    const payload = {
        sale_customer_name: nombre,
        sale_total: getTotalPrecio(),
        productos: carrito.map(item => ({
            id:       item.id,
            cantidad: item.cantidad
        }))
    };

    try {
        const res = await fetch(`${API_BASE}/sales/alta`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify(payload)
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || `Error ${res.status}`);
        }

        const data = await res.json();

        // Guarda el id de la venta para mostrarla en el ticket
        localStorage.setItem('soundstore_ultima_venta', data.sale_id || '');
        // Guarda una copia del carrito para mostrar el detalle en el ticket
        localStorage.setItem('soundstore_ticket_items', JSON.stringify(carrito));
        localStorage.setItem('soundstore_ticket_total', getTotalPrecio());

        vaciarCarrito(); // main.js
        window.location.href = '/ticket.html';

    } catch (err) {
        console.error('Error al confirmar compra:', err);
        alert(`No se pudo procesar la compra: ${err.message}. Intentá de nuevo.`);
        btn.disabled    = false;
        btn.textContent = 'Confirmar compra';
    }
}



function escaparHTML(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}



document.addEventListener('DOMContentLoaded', async () => {
    requireNombre(); // main.js 
    await initLayout();

    // Muestra el nombre del cliente en el subtítulo
    const clienteEl = document.getElementById('carrito-cliente');
    if (clienteEl) clienteEl.textContent = `Hola, ${getNombre()}`;

    renderCarrito();
});