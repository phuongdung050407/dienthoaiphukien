var express = require('express');
var router = express.Router();
var DienThoai = require('../models/dienthoai');
var PhuKien = require('../models/phukien');

router.get('/:type', async (req, res) => {
    var type = req.params.type;
    let data = [];
    let title = (type === 'dienthoai') ? 'Tất cả Điện thoại' : 'Tất cả Phụ kiện';

    try {
        if (type === 'dienthoai') {
            data = await DienThoai.find().populate('HangDienThoai').exec();
        } else {
            data = await PhuKien.find().populate('LoaiPhuKien').exec();
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
            data = await DienThoai.find({ maHangDienThoai: id }).populate('HangDienThoai').lean();
            if (data.length > 0) pageTitle = data[0].maHangDienThoai.tenHangDienThoai;
        } else {
            data = await PhuKien.find({ maLoaiPhuKien: id }).populate('LoaiPhuKien').lean();
            if (data.length > 0) pageTitle = data[0].maLoaiPhuKien.tenLoaiPhuKien;
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