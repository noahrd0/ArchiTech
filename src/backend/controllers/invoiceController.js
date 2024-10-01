const Invoice = require('../models/invoiceModel');
const User = require('../models/userModel');
const path = require('path');
const fs = require("fs");
const PDFDocument = require("pdfkit");


function generateHeader(doc, logoPath) {
  doc
    .rect(50, 45, 50, 50)
    .fill('#333333');
  doc
    .image(logoPath, 50, 45, { width: 50 })
    .fillColor("#444444")
    .fontSize(20)
    .text("Architech", 110, 57)
    .fontSize(10)
    .text("Architech.", 200, 50, { align: "right" })
    .text("123 Rue de l\'Exemple", 200, 65, { align: "right" })
    .text("75000 Paris, France", 200, 80, { align: "right" })
    .moveDown();
}

function generateCustomerInformation(doc, invoice, user) {
  doc
    .fillColor("#444444")
    .fontSize(20)
    .text("Facture", 50, 160);

  generateHr(doc, 185);

  const customerInformationTop = 200;

  doc
    .fontSize(10)
    .text("Facture ID:", 50, customerInformationTop)
    .font("Helvetica-Bold")
    .text(invoice.id, 150, customerInformationTop)
    .font("Helvetica")
    .text("Date de facturation:", 50, customerInformationTop + 15)
    .text(formatDate(invoice.date), 150, customerInformationTop + 15)
    .text("Total:", 50, customerInformationTop + 30)
    .text("20€", 150, customerInformationTop + 30)

    .font("Helvetica-Bold")
    .text(user.email, 300, customerInformationTop)
    .font("Helvetica")
    .text("20Go", 300, customerInformationTop + 15)
    .moveDown();

  generateHr(doc, 252);
}

function generateInvoiceTable(doc) {
  const invoiceTableTop = 330;

  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    invoiceTableTop,
    "Stockage",
    "Description",
    "Prix unitaire",
    "Quantite",
    "Total"
  );
  generateHr(doc, invoiceTableTop + 20);
  doc.font("Helvetica");

  const position = invoiceTableTop + 30;
  generateTableRow(
    doc,
    position,
    "20Go",
    "Stockage supplémentaire",
    "20€",
    "1",
    "20€"
  );

  generateHr(doc, position + 20);

  const subtotalPosition = invoiceTableTop + 60;
  generateTableRow(
    doc,
    subtotalPosition,
    "",
    "",
    "Total",
    "",
    "20€"
  );
  doc.font("Helvetica");
}

function generateTableRow(
  doc,
  y,
  item,
  description,
  unitCost,
  quantity,
  lineTotal
) {
  doc
    .fontSize(10)
    .text(item, 50, y)
    .text(description, 150, y)
    .text(unitCost, 280, y, { width: 90, align: "right" })
    .text(quantity, 370, y, { width: 90, align: "right" })
    .text(lineTotal, 0, y, { align: "right" });
}

function generateHr(doc, y) {
  doc
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(50, y)
    .lineTo(550, y)
    .stroke();
}

function formatDate(date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return year + "/" + month + "/" + day;
}

exports.get = async (req, res) => {
    try {
        const invoice_id = req.params.id;
        const invoice = await Invoice.findByPk(invoice_id);
        if (!invoice) {
            return res.status(404).json({ message: 'Facture non trouvée' });
        }
        const user = await User.findByPk(invoice.user_id);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        const logoPath = path.join(__dirname, '../../frontend/src/img/logo.png');
        let doc = new PDFDocument({ size: "A4", margin: 50 });

        generateHeader(doc, logoPath);
        generateCustomerInformation(doc, invoice, user);
        generateInvoiceTable(doc);
      
        res.setHeader('Content-disposition', 'attachment; filename=facture.pdf');
        res.setHeader('Content-type', 'application/pdf');
        
        doc.pipe(res);
        doc.end();
    } catch (err) {
        res.status(400).json(err);
    }
};

exports.list = async (req, res) => {
    try {
        user_id = req.user.id;
        const invoices = await Invoice.findAll({ where: { user_id } });
        res.status(200).json(invoices);
    } catch (err) {
        res.status(400).json(err);
    }
};


