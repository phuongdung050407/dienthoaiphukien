var express = require('express');
var app = express();
var mongoose = require('mongoose');
var session = require('express-session');
var path = require('path');

var indexRouter = require('./routers/index');
var authRouter = require('./routers/auth');
var sanphamRouter = require('./routers/sanpham');
var taikhoanRouter = require('./routers/taikhoan');
var danhmucRouter = require('./routers/danhmuc');

var uri = 'mongodb://phuongdung_db_user:admin123@ac-fgxzizu-shard-00-01.8vcklhc.mongodb.net:27017/dienthoaiphukien?ssl=true&authSource=admin';
mongoose.connect(uri)
    .then(() => console.log('Đã kết nối thành công tới MongoDB.'))
    .catch(err => console.log(err));

app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', express.static(path.join(__dirname, 'public')));

app.use(session({
    name: '',
    secret: 'MAPD_Tech_Space_Secret_Key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000
    }
}));

app.use((req, res, next) => {
    res.locals.session = req.session;

    var err = req.session.error;
    var msg = req.session.success;

    delete req.session.error;
    delete req.session.success;

    res.locals.message = '';
    if (err) res.locals.message = '<span class="text-danger">' + err + '</span>';
    if (msg) res.locals.message = '<span class="text-success">' + msg + '</span>';

    next();
});

app.use('/', indexRouter);
app.use('/', authRouter);
app.use('/sanpham', sanphamRouter);
app.use('/taikhoan', taikhoanRouter);
app.use('/danhmuc', danhmucRouter);

app.listen(3000, () => {
    console.log('Server is running at https://dienthoaiphukien.onrender.com');
});