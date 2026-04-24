var mongoose = require('mongoose');

var hangPhuKienSchema = new mongoose.Schema({
    tenHangPhuKien: { type: String, required: true }
});

var hangPhuKienModel = mongoose.model('HangPhuKien', hangPhuKienSchema);

module.exports = hangPhuKienModel;