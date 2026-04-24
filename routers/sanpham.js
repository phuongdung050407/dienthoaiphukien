var express = require('express');
var router = express.Router();
var DienThoai = require('../models/dienthoai');
var PhuKien = require('../models/phukien');

router.get('/', async (req, res) => {
    try {
        const type = req.params.type;
        const limit = 10;
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * limit;

        let data = [];
        let totalRows = 0;

        if (type === 'dienthoai') {
            totalRows = await DienThoai.countDocuments();
            data = await DienThoai.find()
                .populate('maHangDienThoai')
                .populate('maTrangThai')
                .sort({ _id: -1 })
                .skip(skip)
                .limit(limit);
        } else {
            totalRows = await PhuKien.countDocuments();
            data = await PhuKien.find()
                .populate('LoaiPhuKien')
                .populate('TrangThai')
                .sort({ _id: -1 })
                .skip(skip)
                .limit(limit);
        }

        res.render('sanpham', {
            title: type === 'dienthoai' ? 'Quản lý Điện thoại' : 'Quản lý Phụ kiện',
            type: type,
            result: data,
            page: page,
            totalPages: Math.ceil(totalRows / limit) || 1
        });
    } catch (err) {
        res.redirect('/');
    }
});

router.post('/them/:type', async (req, res) => {
    var type = req.params.type;
    if (!req.session.quyenHan || req.session.quyenHan == 3) return res.redirect('/dangnhap');

    try {
        if (type == 'dienthoai') {
            await DienThoai.create({
                tenDienThoai: req.body.tenDienThoai,
                giaBan: req.body.giaBan,
                giaGoc: req.body.giaGoc,
                moTa: req.body.moTa,
                maHangDienThoai: req.body.maHangDienThoai,
                maTrangThai: req.body.maTrangThai,
                daBan: 0,
                hinhAnh: req.body.hinhAnh
            });
        } else {
            await PhuKien.create({
                tenPhuKien: req.body.tenPhuKien,
                giaBan: req.body.giaBan,
                giaGoc: req.body.giaGoc,
                moTa: req.body.moTa,
                LoaiPhuKien: req.body.LoaiPhuKien,
                TrangThai: req.body.TrangThai,
                daBan: 0
            });
        }
        req.session.success = 'Thêm sản phẩm thành công!';
        res.redirect('/success');
    } catch (err) {
        req.session.error = 'Lỗi khi thêm sản phẩm!';
        res.redirect('/error');
    }
});

router.get('/sua/:type/:id', async (req, res) => {
    var { id, type } = req.params;
    var sp = (type == 'dienthoai') ? await DienThoai.findById(id) : await PhuKien.findById(id);

    res.render('sanpham_sua', {
        title: 'Chỉnh sửa sản phẩm',
        sanpham: sp,
        type: type
    });
});

router.get('/xoa/:type/:id', async (req, res) => {
    try {
        var { id, type } = req.params;
        if (type == 'dienthoai') await DienThoai.findByIdAndDelete(id);
        else await PhuKien.findByIdAndDelete(id);

        req.session.success = 'Đã xóa sản phẩm thành công!';
        res.redirect(req.get('Referrer') || '/sanpham/ql/' + type);
    } catch (err) {
        res.redirect('/error');
    }
});

router.get('/sanpham_chitiet/:id/:type', async (req, res) => {
    var { id, type } = req.params;
    var sp = (type == 'dienthoai')
        ? await DienThoai.findById(id).populate('maHangDienThoai')
        : await PhuKien.findById(id).populate('LoaiPhuKien');

    res.render('sanpham_chitiet', {
        title: 'Chi tiết sản phẩm',
        loai: type,
        sanpham: sp
    });
});

module.exports = router;