const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');

router.get('/list', invoiceController.list);
router.get('/:id', invoiceController.get);

module.exports = router;