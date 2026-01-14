const mongoose = require('mongoose');

const FormSchema = new mongoose.Schema({
    title: { type: String, default: "Untitled Form" },
    elements: { type: Array, default: [] },
}, { timestamps: true });

module.exports = mongoose.model('Form', FormSchema); 