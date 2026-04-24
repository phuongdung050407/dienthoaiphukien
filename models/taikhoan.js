var mongoose = require('mongoose');

var taiKhoanSchema = new mongoose.Schema({
    tenTaiKhoan: { type: String, required: true },
    tenDangNhap: { type: String, unique: true, required: true },
    matKhau: { type: String, required: true },
    quyenHan: { type: Number, default: 2 },
    khoa: { type: Number, default: 1 }
});

var taiKhoanModel = mongoose.model('TaiKhoan', taiKhoanSchema);

module.exports = taiKhoanModel;