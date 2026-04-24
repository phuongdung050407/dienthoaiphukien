var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var TaiKhoan = require('../models/taikhoan');

const isAdmin = (req, res, next) => {
    if (req.session.quyenHan == 1) {
        next();
    } else {
        req.session.error = 'Bạn không có quyền truy cập khu vực này!';
        res.redirect('/');
    }
};

router.use(isAdmin);

router.get('/', async (req, res) => {
    try {
        var tk = await TaiKhoan.find().sort({ quyenHan: 1 }).lean();
        res.render('taikhoan', {
            title: 'Quản lý tài khoản',
            taikhoan: tk
        });
    } catch (err) {
        res.redirect('/error');
    }
});

router.get('/them', (req, res) => {
    res.render('taikhoan_them', { title: 'Thêm tài khoản mới' });
});

router.post('/them', async (req, res) => {
    try {
        var salt = bcrypt.genSaltSync(10);
        var data = {
            tenTaiKhoan: req.body.tenTaiKhoan,
            tenDangNhap: req.body.tenDangNhap,
            matKhau: bcrypt.hashSync(req.body.matKhau, salt),
            quyenHan: req.body.quyenHan,
            khoa: req.body.khoa || 1
        };
        await TaiKhoan.create(data);
        req.session.success = 'Đã tạo tài khoản thành công!';
        res.redirect('/taikhoan');
    } catch (err) {
        req.session.error = 'Lỗi: Tên đăng nhập đã tồn tại!';
        res.redirect('/taikhoan/them');
    }
});

router.get('/sua/:id', async (req, res) => {
    try {
        var id = req.params.id;
        var tk = await TaiKhoan.findById(id).lean();
        res.render('taikhoan_sua', {
            title: 'Chỉnh sửa tài khoản',
            taikhoan: tk
        });
    } catch (err) {
        res.redirect('/taikhoan');
    }
});

router.post('/sua/:id', async (req, res) => {
    try {
        var id = req.params.id;
        var data = {
            tenTaiKhoan: req.body.tenTaiKhoan,
            tenDangNhap: req.body.tenDangNhap,
            quyenHan: req.body.quyenHan,
            khoa: req.body.khoa
        };

        if (req.body.matKhau && req.body.matKhau.trim() !== "") {
            var salt = bcrypt.genSaltSync(10);
            data.matKhau = bcrypt.hashSync(req.body.matKhau, salt);
        }

        await TaiKhoan.findByIdAndUpdate(id, data);
        req.session.success = 'Cập nhật tài khoản thành công!';
        res.redirect('/taikhoan');
    } catch (err) {
        req.session.error = 'Lỗi khi cập nhật dữ liệu!';
        res.redirect('/taikhoan');
    }
});

router.get('/xoa/:id', async (req, res) => {
    try {
        var id = req.params.id;

        if (id == req.session.maTaiKhoan) {
            req.session.error = 'Bạn không thể tự xóa tài khoản của chính mình!';
            return res.redirect('/taikhoan');
        }

        await TaiKhoan.findByIdAndDelete(id);
        req.session.success = 'Đã xóa tài khoản!';
        res.redirect('/taikhoan');
    } catch (err) {
        res.redirect('/taikhoan');
    }
});

module.exports = router;