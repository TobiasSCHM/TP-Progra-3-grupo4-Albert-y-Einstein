
const responderErrores = (res, errores) => {
    return res.status(400).json({ errores });
};

//valida para el POST /api/product/alta
const validarAltaProducto = (req, res, next) => {
    const errores = [];
    const { product_name, product_price, product_description, product_category } = req.body;

    if (!product_name || product_name.trim() === '') {
        errores.push('El nombre del producto es obligatorio.');
    }

    if (product_price === undefined || product_price === '') {
        errores.push('El precio es obligatorio.');
    } else if (isNaN(product_price) || Number(product_price) <= 0) {
        errores.push('El precio debe ser un número mayor a 0.');
    }

    if (!product_description || product_description.trim() === '') {
        errores.push('La descripción es obligatoria.');
    }

    if (!product_category || product_category.trim() === '') {
        errores.push('La categoría es obligatoria.');
    }

    if (errores.length > 0) return responderErrores(res, errores);
    next();
};



//valida para el PUT /api/product/modificar/:id
const validarModificarProducto = (req, res, next) => {
    const errores = [];
    const { product_price, product_active } = req.body;

    if (product_price !== undefined && product_price !== '') {
        if (isNaN(product_price) || Number(product_price) <= 0) {
            errores.push('El precio debe ser un número mayor a 0.');
        }
    }

    if (product_active !== undefined) {
        const val = String(product_active).toLowerCase();
        if (val !== 'true' && val !== 'false' && product_active !== true && product_active !== false) {
            errores.push('El campo product_active debe ser true o false.');
        }
    }

    if (errores.length > 0) return responderErrores(res, errores);
    next();
};


//valida para el POST /api/sales/alta
const validarAltaVenta = (req, res, next) => {
    const errores = [];
    const { sale_customer_name, sale_total, productos } = req.body;

    if (!sale_customer_name || sale_customer_name.trim() === '') {
        errores.push('El nombre del cliente es obligatorio.');
    }

    if (sale_total === undefined || sale_total === '') {
        errores.push('El total de la venta es obligatorio.');
    } else if (isNaN(sale_total) || Number(sale_total) <= 0) {
        errores.push('El total debe ser un número mayor a 0.');
    }

    if (!productos || !Array.isArray(productos) || productos.length === 0) {
        errores.push('La venta debe tener al menos un producto.');
    }

    if (errores.length > 0) return responderErrores(res, errores);
    next();
};

//valida para el POST /api/users/alta
const validarAltaUsuario = (req, res, next) => {
    const errores = [];
    const { user_email, user_password } = req.body;

    if (!user_email || user_email.trim() === '') {
        errores.push('El email es obligatorio.');
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(user_email)) {
            errores.push('El email no tiene un formato válido.');
        }
    }

    if (!user_password || user_password.trim() === '') {
        errores.push('La contraseña es obligatoria.');
    } else if (user_password.length < 6) {
        errores.push('La contraseña debe tener al menos 6 caracteres.');
    }

    if (errores.length > 0) return responderErrores(res, errores);
    next();
};

//valida para el POST /api/users/login
const validarLogin = (req, res, next) => {
    const errores = [];
    const { user_email, user_password } = req.body;

    if (!user_email || user_email.trim() === '') {
        errores.push('El email es obligatorio.');
    }

    if (!user_password || user_password.trim() === '') {
        errores.push('La contraseña es obligatoria.');
    }

    if (errores.length > 0) return responderErrores(res, errores);
    next();
};

module.exports = {
    validarAltaProducto,
    validarModificarProducto,
    validarAltaVenta,
    validarAltaUsuario,
    validarLogin
};