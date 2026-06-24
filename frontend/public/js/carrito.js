// Renderiza el contenido del carrito en el DOM
function renderCarrito() {
    const carrito = getCarrito();
    const lista   = document.getElementById('carrito-lista');
    const vacio   = document.getElementById('carrito-vacio');
    const resumen = document.getElementById('carrito-resumen');

    // Si el carrito está vacío, muestra el mensaje correspondiente y oculta el resumen
    if (carrito.length === 0) {
        lista.innerHTML = '';
        vacio.classList.remove('oculto');
        resumen.classList.add('oculto');
        return;
    }

    // Si hay productos en el carrito, oculta el mensaje de vacío y muestra el resumen
    vacio.classList.add('oculto');
    resumen.classList.remove('oculto');

    // Genera el HTML de cada item del carrito y lo inserta en la lista
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
        </article>`; // retorna el HTML de cada item del carrito
    }).join('');

    actualizarResumen();
}

// Actualiza el resumen del carrito mostrando el subtotal y total
function actualizarResumen() {
    const total = getTotalPrecio();
    document.getElementById('resumen-subtotal').textContent = formatearPrecio(total);
    document.getElementById('resumen-total').textContent    = formatearPrecio(total);
}

// Cambia la cantidad de un producto en el carrito y vuelve a renderizarlo
function cambiarCantidad(id, nuevaCantidad) {
    actualizarCantidad(id, nuevaCantidad); // main.js borra el item si queda en 0
    renderCarrito();
}

// Quita un producto del carrito y vuelve a renderizarlo
function quitarItem(id) {
    eliminarDelCarrito(id); // main.js
    renderCarrito();
}

// Abre el modal de confirmación mostrando el resumen de la compra
function abrirModalConfirmacion() {
    const carrito = getCarrito();
    if (carrito.length === 0) return;

    const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);

    document.getElementById('modal-cantidad-items').textContent = totalItems;
    document.getElementById('modal-total').textContent = formatearPrecio(getTotalPrecio());
    document.getElementById('modal-confirmar').classList.remove('oculto');
}

// Cierra el modal sin confirmar la compra
function cerrarModalConfirmacion() {
    document.getElementById('modal-confirmar').classList.add('oculto');
}

// Envía la compra al backend para crear una nueva venta y redirige al ticket
async function confirmarCompra() {
    const carrito = getCarrito();
    const nombre  = getNombre();

    // Si el carrito está vacío, no hace nada
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

    // Envía la solicitud al backend para crear la venta
    try {
        const res = await fetch(`${API_BASE}/sales/alta`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify(payload)
        });

        // Si la respuesta no es OK, intenta leer el mensaje de error y lanza una excepción
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || `Error ${res.status}`);
        }

        // Si la venta se creó correctamente, obtiene el id de la venta
        // y guarda los datos en localStorage para mostrar el ticket
        const data = await res.json();

        // Guarda el id de la venta para mostrarla en el ticket
        localStorage.setItem('soundstore_ultima_venta', data.sale_id || '');
        // Guarda una copia del carrito para mostrar el detalle en el ticket
        localStorage.setItem('soundstore_ticket_items', JSON.stringify(carrito));
        localStorage.setItem('soundstore_ticket_total', getTotalPrecio());

        // Vacía el carrito y redirige al ticket
        vaciarCarrito(); // main.js
        window.location.href = '/ticket.html';

        // Si todo salió bien, el usuario será redirigido al ticket y no verá este mensaje
    } catch (err) {
        console.error('Error al confirmar compra:', err);
        alert(`No se pudo procesar la compra: ${err.message}. Intentá de nuevo.`);
        btn.disabled    = false;
        btn.textContent = 'Confirmar compra';
    }
}


// Escapa caracteres especiales para evitar inyección de HTML al mostrar el nombre del producto
function escaparHTML(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

// Formatea un número como precio en pesos argentinos
document.addEventListener('DOMContentLoaded', async () => {
    requireNombre(); // main.js 
    await initLayout();

    // Muestra el nombre del cliente en el subtítulo
    const clienteEl = document.getElementById('carrito-cliente');
    if (clienteEl) clienteEl.textContent = `Hola, ${getNombre()}`;

    renderCarrito();

    // Conecta los botones del modal de confirmación
    document.getElementById('modal-cancelar').addEventListener('click', cerrarModalConfirmacion);
    document.getElementById('modal-aceptar').addEventListener('click', () => {
        cerrarModalConfirmacion();
        confirmarCompra();
    });
});