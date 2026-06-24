//depende de main.js para funciones de carrito, formateo de precio y nombre de usuario

// Estado global de la página de productos, para manejar la paginación y la categoría activa
const estado = {
    categoriaActiva: 'Guitarras',
    paginaActual: 1,
    totalPaginas: 1,
    limite: 6,
    todosLosProductos: [],
    cargando: false
};

// Carga todos los productos desde el backend y los almacena en estado.todosLosProductos
async function fetchTodosLosProductos() {
    mostrarEstado('Cargando productos...', false);

    // Fetch a todos los productos desde el backend, sin paginación
    try {
        const res = await fetch(`${API_BASE}/product/listarPaginado?pagina=1&limite=9999`);
        if (!res.ok) throw new Error('Error al obtener productos');

        const data = await res.json();
        estado.todosLosProductos = data.productos || [];
        ocultarEstado();
    } catch (err) {
        console.error(err);
        mostrarEstado('No se pudieron cargar los productos. Intentá de nuevo más tarde.', true);
    }
}

//filters

function getProductosDeCategoriaActiva() {
    return estado.todosLosProductos.filter(
        p => p.product_category === estado.categoriaActiva
    );
}

function calcularPaginas() {
    const productosFiltrados = getProductosDeCategoriaActiva();
    estado.totalPaginas = Math.max(1, Math.ceil(productosFiltrados.length / estado.limite));

    if (estado.paginaActual > estado.totalPaginas) {
        estado.paginaActual = 1;
    }

    return productosFiltrados;
}

function getProductosDePaginaActual() {
    const todos = calcularPaginas();
    const inicio = (estado.paginaActual - 1) * estado.limite;
    return todos.slice(inicio, inicio + estado.limite);
}


// Renderiza los productos de la página actual y configura los botones de agregar al carrito
function renderProductos() {
    const grilla = document.getElementById('grilla-productos');
    const productos = getProductosDePaginaActual();

    if (productos.length === 0) {
        grilla.innerHTML = `<p class="sin-resultados">No hay productos disponibles en esta categoría.</p>`;
        renderPaginacion();
        return;
    }

    grilla.innerHTML = productos.map(p => crearCardHTML(p)).join('');

    grilla.querySelectorAll('.producto-card').forEach((card, i) => {
        card.style.animationDelay = `${i * 60}ms`;
    });

    grilla.querySelectorAll('.btn-agregar').forEach(btn => {
        btn.addEventListener('click', () => {
            const producto = {
                id:        parseInt(btn.dataset.id),
                nombre:    btn.dataset.nombre,
                precio:    parseFloat(btn.dataset.precio),
                imagen:    btn.dataset.imagen,
                categoria: btn.dataset.categoria
            };
            agregarAlCarrito(producto);
            mostrarFeedbackBoton(btn);
        });
    });

    renderPaginacion();
}

// Crea el HTML de una tarjeta de producto, incluyendo la imagen, nombre, descripción, precio y botón de agregar al carrito
function crearCardHTML(p) {
    const imagenSrc = p.product_image
    ? `${BACKEND_URL}${p.product_image}`
    : '/public/images/sin-imagen.png';

    return `
        <article class="producto-card">
            <img
                src="${imagenSrc}"
                alt="${escapar(p.product_name)}"
                class="producto-card-img"
                onerror="this.src='/public/images/sin-imagen.png'"
            >
            <div class="producto-card-body">
                <span class="producto-categoria">${escapar(p.product_category)}</span>
                <h3 class="producto-nombre">${escapar(p.product_name)}</h3>
                <p class="producto-descripcion">${escapar(p.product_description || '')}</p>
                <div class="producto-footer">
                    <span class="producto-precio">${formatearPrecio(p.product_price)}</span>
                    <button
                        class="btn-agregar btn-primary"
                        data-id="${p.product_id}"
                        data-nombre="${escapar(p.product_name)}"
                        data-precio="${p.product_price}"
                        data-imagen="${p.product_image ? BACKEND_URL + p.product_image : ''}"
                        data-categoria="${escapar(p.product_category)}"
                    >
                        + Agregar
                    </button>
                </div>
            </div>
        </article>`;
}

// Renderiza los botones de paginación según la cantidad de páginas y la página actual
function renderPaginacion() {
    const contenedor = document.getElementById('paginacion');

    if (estado.totalPaginas <= 1) {
        contenedor.innerHTML = '';
        return;
    }

    let html = '';

    html += `<button class="pag-btn" ${estado.paginaActual === 1 ? 'disabled' : ''}
        data-pagina="${estado.paginaActual - 1}">← Anterior</button>`;

    for (let i = 1; i <= estado.totalPaginas; i++) {
        html += `<button class="pag-btn ${i === estado.paginaActual ? 'activo' : ''}"
            data-pagina="${i}">${i}</button>`;
    }

    html += `<button class="pag-btn" ${estado.paginaActual === estado.totalPaginas ? 'disabled' : ''}
        data-pagina="${estado.paginaActual + 1}">Siguiente →</button>`;

    contenedor.innerHTML = html;

    contenedor.querySelectorAll('.pag-btn:not([disabled])').forEach(btn => {
        btn.addEventListener('click', () => {
            estado.paginaActual = parseInt(btn.dataset.pagina);
            renderProductos();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}

//tabs de categorias
function initTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('activo'));
            btn.classList.add('activo');
            estado.categoriaActiva = btn.dataset.categoria;
            estado.paginaActual = 1;
            renderProductos();
        });
    });
}

//helpers
function mostrarEstado(mensaje, esError) {
    const el = document.getElementById('productos-estado');
    el.textContent = mensaje;
    el.className = `productos-estado ${esError ? 'error' : 'info'}`;
    el.classList.remove('oculto');
}

function ocultarEstado() {
    document.getElementById('productos-estado').classList.add('oculto');
}

function mostrarFeedbackBoton(btn) {
    const textoOriginal = btn.textContent;
    btn.textContent = 'Agregado';
    btn.disabled = true;
    btn.classList.add('agregado');
    setTimeout(() => {
        btn.textContent = textoOriginal;
        btn.disabled = false;
        btn.classList.remove('agregado');
    }, 900);
}

// Escapa caracteres especiales para evitar inyección de HTML al mostrar el nombre del producto
function escapar(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

document.addEventListener('DOMContentLoaded', async () => {
    requireNombre();
    await initLayout();
    await fetchTodosLosProductos();
    initTabs();
    renderProductos();
});