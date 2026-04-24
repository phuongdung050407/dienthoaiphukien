var mongoose = require('mongoose');

var trangThaiSchema = new mongoose.Schema({
    tenTrangThai: { type: String, unique: true, required: true }
});

var trangThaiModel = mongoose.model('TrangThai', trangThaiSchema);

module.exports = trangThaiModel;