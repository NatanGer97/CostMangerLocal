const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
    {
        name: String,
        date_created: {type: String, default: new Date().toLocaleDateString()},
    });

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;