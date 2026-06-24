// Lee los datos de la última compra desde localStorage y los muestra en el ticket
function renderTicket() {
    const items = JSON.parse(localStorage.getItem('soundstore_ticket_items')) || [];
    const total = localStorage.getItem('soundstore_ticket_total') || 0;
    const ventaId = localStorage.getItem('soundstore_ultima_venta') || '—';
    const nombre = localStorage.getItem('clienteNombre') || 'Cliente';

    // Si no hay items guardados, significa que no hubo una compra reciente, volvemos a productos
    if (items.length === 0) {
        window.location.href = '/productos.html';
        return;
    }

    // Completa los datos generales del ticket (cliente, fecha, número de venta y total)
    document.getElementById('ticket-cliente').textContent = nombre;
    document.getElementById('ticket-fecha').textContent = formatearFecha(new Date());
    document.getElementById('ticket-id').textContent = ventaId;
    document.getElementById('ticket-total-monto').textContent = formatearPrecio(total);

    // Renderiza cada producto comprado con su cantidad y subtotal
    const contenedor = document.getElementById('ticket-items');
    contenedor.innerHTML = items.map(item => {
        const subtotal = item.precio * item.cantidad;
        return `
        <div class="ticket-item">
            <span class="ticket-item-nombre">${item.cantidad}x ${escaparHTML(item.nombre)}</span>
            <span class="ticket-item-precio">${formatearPrecio(subtotal)}</span>
        </div>`;
    }).join('');
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

// Limpia los datos de la compra finalizada y vuelve a la pantalla de bienvenida,
// simulando el reinicio del autoservicio para el próximo cliente
function finalizarYReiniciar() {
    localStorage.removeItem('soundstore_ticket_items');
    localStorage.removeItem('soundstore_ticket_total');
    localStorage.removeItem('soundstore_ultima_venta');
    localStorage.removeItem('clienteNombre');
    window.location.href = '/index.html';
}

// Al cargar la página, carga el header/footer, muestra el ticket y conecta el botón de finalizar
document.addEventListener('DOMContentLoaded', async () => {
    await initLayout();
    renderTicket();

    document.getElementById('btn-volver').addEventListener('click', finalizarYReiniciar);
});