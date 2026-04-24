var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var TaiKhoan = require('../models/taikhoan');

router.get('/dangnhap', (req, res) => {
    res.render('dangnhap', { title: 'Đăng nhập hệ thống' });
});

router.post('/dangnhap', async (req, res) => {
    if (req.session.maTaiKhoan) return res.redirect('/');
    var tenDangNhap = req.body.tenDangNhap;
    var matKhau = req.body.matKhau;
    var taikhoan = await TaiKhoan.findOne({ tenDangNhap: tenDangNhap });

    if (taikhoan) {
        var match = bcrypt.compareSync(matKhau, taikhoan.matKhau);
        if (match) {
            if (taikhoan.khoa == 0) {
                req.session.error = 'Tài khoản của bạn đã bị khóa!';
                res.redirect('/dangnhap');
            }

            req.session.maTaiKhoan = taikhoan.maTaiKhoan;
            req.session.tenTaiKhoan = taikhoan.tenTaiKhoan;
            req.session.quyenHan = taikhoan.quyenHan;

            req.session.success = 'Chào mừng ' + taikhoan.tenTaiKhoan + ' quay trở lại!';
            res.redirect('/');
        } else {
            req.session.error = 'Mật khẩu không chính xác!';
            res.redirect('/dangnhap');
        }
    } else {
        req.session.error = 'Tên đăng nhập không tồn tại!';
        res.redirect('/dangnhap');
    }
});

router.get('/dangxuat', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

module.exports = router;