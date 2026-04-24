var mongoose = require('mongoose');

var loaiPhuKienSchema = new mongoose.Schema({
    tenLoaiPhuKien: { type: String, unique: true, required: true }
});

var loaiPhuKienModel = mongoose.model('LoaiPhuKien', loaiPhuKienSchema);

module.exports = loaiPhuKienModel;