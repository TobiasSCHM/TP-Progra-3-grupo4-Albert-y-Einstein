const { Sale, Product } = require('../models/index');

// Para generar el PDF del ticket en el servidor: puppeteer controla un Chrome invisible,
// ejs renderiza la plantilla del ticket a HTML, path y fs ubican esa plantilla y el logo en el disco
const puppeteer = require('puppeteer');
const ejs = require('ejs');
const path = require('path');
const fs = require('fs');

const listar = async (req, res, next) => {
    try {
        const ventas = await Sale.findAll({
            include: [{
                model: Product,
                required: true,
                through: { attributes: ['cantidad'] } // trae también la cantidad guardada en la tabla intermedia
            }]
        });
        res.status(200).send(ventas);
    } catch (error) {
        res.status(500).send({ error: 'Error al listar ventas' });
    }
};

const alta = async (req, res, next) => {
    try {
        const { sale_customer_name, sale_total, productos } = req.body;
        const venta = await Sale.create({ sale_customer_name, sale_total });

        // Antes: addProducts(ids) en bloque, sin guardar cantidad.
        // Ahora: uno por uno, pasando la cantidad como dato de la tabla intermedia (through)
        for (const p of productos) {
            await venta.addProduct(p.id, { through: { cantidad: p.cantidad } });
        }

        res.status(201).send(venta);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Error al crear venta' });
    }
};

// Genera el PDF del ticket de una venta ya confirmada, corriendo en el servidor (reemplaza a html2pdf.js)
const generarTicketPDF = async (req, res, next) => {
    let browser;
    try {
        const { id } = req.params;

        const venta = await Sale.findByPk(id, {
            include: [{
                model: Product,
                through: { attributes: ['cantidad'] }
            }]
        });

        if (!venta) {
            return res.status(404).send({ error: 'Venta no encontrada' });
        }

        // Lee el logo del disco y lo pasa a base64, para no depender de que Puppeteer acceda a una URL
        const logoPath = path.join(__dirname, '../public/images/logo-soundstore.png');
        const logoBase64 = fs.readFileSync(logoPath).toString('base64');
        const logoDataUri = `data:image/png;base64,${logoBase64}`;

        const html = await ejs.renderFile(
            path.join(__dirname, '../views/ticketPDF.ejs'),
            { venta, logoDataUri }
        );

        browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });
        const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
        await browser.close();

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=ticket-venta-${id}.pdf`
        });
        res.send(pdfBuffer);

    } catch (error) {
        console.error(error);
        if (browser) await browser.close();
        res.status(500).send({ error: 'Error al generar el PDF del ticket' });
    }
};

module.exports = { listar, alta, generarTicketPDF };