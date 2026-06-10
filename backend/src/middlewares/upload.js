
//middleware para archivos fotos, donde se guardan
const multer = require('multer');
const path = require('path');
 
const storage = multer.diskStorage({ 
    destination: (req, file, cb) => {
        
        cb(null, path.join(__dirname, '../public/uploads'));//donde se guarda el archivo
    },
    filename: (req, file, cb) => {
        
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext);
    }
});
 
// solo se aceptan imagenes, sino da error
const fileFilter = (req, file, cb) => {
    const tiposPermitidos = /jpeg|jpg|png|webp/;
    const esValido = tiposPermitidos.test(path.extname(file.originalname).toLowerCase())
                  && tiposPermitidos.test(file.mimetype);
    if (esValido) {
        cb(null, true);
    } else {
        cb(new Error('Solo se permiten imágenes (jpg, jpeg, png, webp)'));
    }
};
 
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // max 5 mb, para ahorrar espacio, no se si esta de mas
});
 
module.exports = upload;
 