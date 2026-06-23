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