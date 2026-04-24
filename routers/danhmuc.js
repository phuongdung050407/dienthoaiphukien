var express = require('express');
var router = express.Router();
var DienThoai = require('../models/dienthoai');
var HangDienThoai = require('../models/hangdienthoai');
var PhuKien = require('../models/phukien');
var LoaiPhuKien = require('../models/loaiphukien');

router.get('/:type', async (req, res) => {
    var type = req.params.type;
    let title = (type === 'dienthoai') ? 'Tất cả Điện thoại' : 'Tất cả Phụ kiện';

    try {
        if (type === 'dienthoai') {
            var data = await DienThoai.find().populate('HangDienThoai').exec();
        } else {
            var data = await PhuKien.find().populate('LoaiPhuKien').exec();
        }

        res.render('danhmuc', {
            title: title,
            loai: type,
            danhSach: data
        });
    } catch (err) {
        res.redirect('/error');
    }
});
router.get('/:type/:id', async (req, res) => {
    var type = req.params.type;
    var id = req.params.id;
    let data = [];
    let pageTitle = "Danh mục sản phẩm";

    try {
        if (type === 'dienthoai') {
            var data = await DienThoai.find({ maHangDienThoai: id }).populate('HangDienThoai').lean();
            if (data.length > 0) pageTitle = data[0].HangDienThoai.tenHangDienThoai;
        } else {
            var data = await PhuKien.find({ maLoaiPhuKien: id }).populate('LoaiPhuKien').lean();
            if (data.length > 0) pageTitle = data[0].LoaiPhuKien.tenLoaiPhuKien;
        }

        res.render('danhmuc', {
            title: pageTitle,
            loai: type,
            danhSach: data
        });
    } catch (err) {
        console.error(err);
        res.redirect('/error');
    }
});
module.exports = router;