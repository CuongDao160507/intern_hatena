const express = require('express');
const router = express.Router();
const formController = require('../controllers/formController');

// Định nghĩa các đường dẫn
router.post('/', formController.createForm); // POST /api/forms
router.get('/:id', formController.getFormById); // GET /api/forms/:id

module.exports = router;