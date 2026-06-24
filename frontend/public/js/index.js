// Si alguien dejó productos en el carrito de una sesión anterior sin
// finalizar la compra, los descartamos al volver a la pantalla de bienvenida.
vaciarCarrito();

const formulario = document.getElementById("form-bienvenida");

// Si el usuario ya ingresó su nombre en una sesión anterior, lo redirigimos a productos.html
formulario.addEventListener("submit", (event) => {

    event.preventDefault();

    const nombre = document
        .getElementById("nombre")
        .value
        .trim();

    if (!nombre) {
        alert("Debe ingresar un nombre.");
        return;
    }

    // Guardamos el nombre del cliente en localStorage para usarlo en la pantalla de productos
    localStorage.setItem("clienteNombre", nombre);

    window.location.href = "./productos.html";
});