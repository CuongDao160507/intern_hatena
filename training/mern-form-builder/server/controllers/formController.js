const Form = require('../models/Form');

// Logic tạo mới Form
exports.createForm = async (req, res) => {
    try {
        const { title, elements } = req.body;
        const newForm = new Form({ title, elements });
        const savedForm = await newForm.save();
        res.status(201).json(savedForm);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Logic lấy Form theo ID
exports.getFormById = async (req, res) => {
    try {
        const form = await Form.findById(req.params.id);
        if (!form) return res.status(404).json({ message: "Form not found" });
        res.status(200).json(form);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};