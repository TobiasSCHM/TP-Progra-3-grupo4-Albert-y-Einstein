// Si alguien dejó productos en el carrito de una sesión anterior sin
// finalizar la compra, los descartamos al volver a la pantalla de bienvenida.
vaciarCarrito();

const formulario = document.getElementById("form-bienvenida");

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

    localStorage.setItem("clienteNombre", nombre);

    window.location.href = "./productos.html";
});