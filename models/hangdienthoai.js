var mongoose = require('mongoose');

var hangDienThoaiSchema = new mongoose.Schema({
    tenHangDienThoai: { type: String, required: true }
});

var hangDienThoaiModel = mongoose.model('HangDienThoai', hangDienThoaiSchema);

module.exports = hangDienThoaiModel;