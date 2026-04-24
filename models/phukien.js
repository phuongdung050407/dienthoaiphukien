var mongoose = require('mongoose');

const phuKienSchema = new mongoose.Schema({
    tenPhuKien: { type: String, required: true, unique: true },
    giaGoc: { type: Number },
    giaBan: { type: Number, required: true },
    hinhAnh: { type: String },
    soLuong: { type: Number, required: true },
    daBan: { type: Number, default: 0 },
    TrangThai: { type: mongoose.Schema.Types.ObjectId, ref: 'TrangThai' },
    LoaiPhuKien: { type: mongoose.Schema.Types.ObjectId, ref: 'LoaiPhuKien' },
    HangPhuKien: { type: mongoose.Schema.Types.ObjectId, ref: 'HangPhuKien' },
    moTa: { type: String }
});
var phuKienModel = mongoose.model('PhuKien', phuKienSchema);

module.exports = phuKienModel;