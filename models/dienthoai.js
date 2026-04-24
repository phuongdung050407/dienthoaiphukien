var mongoose = require('mongoose');

const dienThoaiSchema = new mongoose.Schema({
    tenDienThoai: { type: String, required: true },
    maHangDienThoai: { type: mongoose.Schema.Types.ObjectId, ref: 'HangDienThoai' },
    giaGoc: { type: Number },
    giaBan: { type: Number, required: true },
    boNho: { type: String, required: true },
    dungLuongPin: { type: String, required: true },
    moTa: { type: String, required: true },
    hinhAnh: { type: String },
    soLuong: { type: Number, required: true },
    daBan: { type: Number, default: 0 },
    maTrangThai: { type: mongoose.Schema.Types.ObjectId, ref: 'TrangThai' }
});

var dienThoaiModel = mongoose.model('DienThoai', dienThoaiSchema);

module.exports = dienThoaiModel;