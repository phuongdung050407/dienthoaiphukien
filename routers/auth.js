var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var TaiKhoan = require('../models/taikhoan');

router.get('/dangnhap', (req, res) => {
    res.render('dangnhap', { title: 'Đăng nhập hệ thống' });
});

router.post('/dangnhap', async (req, res) => {
    if (req.session.maTaiKhoan) {
        req.session.error = 'Người dùng đã đăng nhập rồi.';
        res.redirect('/error');
    } else {
        var taikhoan = await TaiKhoan.findOne({ tenDangNhap: req.body.tenDangNhap }).exec();
        if (taikhoan) {
            if (bcrypt.compareSync(req.body.matKhau, taikhoan.matKhau)) {
                if (taikhoan.khoa == 0) {
                    req.session.error = 'Người dùng đã bị khóa tài khoản.';
                    res.redirect('/error');
                } else {
                    req.session.maTaiKhoan = taikhoan.maTaiKhoan;
                    req.session.tenTaiKhoan = taikhoan.tenTaiKhoan;
                    req.session.quyenHan = taikhoan.quyenHan;
                    res.redirect('/');
                }
            } else {
                req.session.error = 'Mật khẩu không đúng.';
                res.redirect('/error');
            }
        } else {
            req.session.error = 'Tên đăng nhập không tồn tại.';
            res.redirect('/error');
        }
    }
});

router.get('/dangxuat', (req, res) => {
    delete req.session.maTaiKhoan;
    delete req.session.tenTaiKhoan;
    delete req.session.quyenHan;
    res.redirect('/');

    //if (req.session.maTaiKhoan) {

    //   res.redirect('/');
    //} else {
    //  req.session.error = 'Người dùng chưa đăng nhập.';
    //res.redirect('/error');
    //}
});

module.exports = router;