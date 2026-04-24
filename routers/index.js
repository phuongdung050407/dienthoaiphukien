var express = require('express');
var router = express.Router();
var DienThoai = require('../models/dienthoai');
var PhuKien = require('../models/phukien');
var HangDienThoai = require('../models/hangdienthoai');
var LoaiPhuKien = require('../models/loaiphukien');

router.get('/', async (req, res) => {
    try {
        var dt = await DienThoai.find().limit(8).exec();
        var pk = await PhuKien.find().limit(8).exec();
        res.render('index', {
            title: 'Trang chủ',
            dienthoai: dt,
            phukien: pk
        });
    } catch (err) {
        res.redirect('/error');
    }
});

router.get('/error', (req, res) => {
    res.render('error', { title: 'Lỗi' });
});

router.get('/success', (req, res) => {
    res.render('success', { title: 'Hoàn thành' });
});

router.get('/timkiem', async (req, res) => {
    try {
        const { tukhoa, gia, sort, page = 1 } = req.query;
        const limit = 12;
        const skip = (parseInt(page) - 1) * limit;

        if (!tukhoa) {
            return res.render('timkiem', {
                title: 'Tìm kiếm',
                result: [],
                count: 0,
                tukhoa: '',
                mucGia: '',
                sapXep: '',
                page: 1,
                totalPages: 1
            });
        }

        let query = {
            $or: [
                { tenDienThoai: { $regex: tukhoa, $options: 'i' } },
                { tenPhuKien: { $regex: tukhoa, $options: 'i' } },
                { moTa: { $regex: tukhoa, $options: 'i' } }
            ]
        };

        if (gia === 'duoi5') query.giaBan = { $lt: 5000000 };
        else if (gia === '5to10') query.giaBan = { $gte: 5000000, $lte: 10000000 };
        else if (gia === 'tren10') query.giaBan = { $gt: 10000000 };

        const [dt, pk] = await Promise.all([
            DienThoai.find(query).lean(),
            PhuKien.find(query).lean()
        ]);

        let combined = [
            ...dt.map(item => ({ ...item, id: item._id, ten: item.tenDienThoai, loai: 'dienthoai' })),
            ...pk.map(item => ({ ...item, id: item._id, ten: item.tenPhuKien, loai: 'phukien' }))
        ];

        if (sort === 'gia_tang') combined.sort((a, b) => a.giaBan - b.giaBan);
        else combined.sort((a, b) => b.giaBan - a.giaBan);

        const totalItems = combined.length;
        const resultPage = combined.slice(skip, skip + limit);
        const totalPages = Math.ceil(totalItems / limit) || 1;

        res.render('timkiem', {
            title: 'Kết quả tìm kiếm: ' + tukhoa,
            tukhoa: tukhoa,
            mucGia: gia || '',
            sapXep: sort || '',
            result: resultPage,
            count: totalItems,
            page: parseInt(page),
            totalPages: totalPages,
            limit: limit
        });
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
});

module.exports = router;