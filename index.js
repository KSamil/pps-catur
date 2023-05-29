const express = require('express');
const bodyParser = require('body-parser');
const koneksi = require('./config/database');
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const app = express();
const PORT = process.env.PORT || 3000;
const oneDay = 1000 * 60 * 60 * 24;
const myusername = 'Username'
const mypassword = 'Password'

var session;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//serving public file
app.use(express.static(__dirname));

app.get('/',(req,res) => {
    session=req.session;
    if(session.userid){
        res.redirect('/profile');
    }else
    res.sendFile('views/index.html',{root:__dirname})
});
app.post('/user',(req,res) => {
    if(req.body.username == myusername && req.body.password == mypassword){
        session=req.session;
        session.userid=req.body.username;
        console.log(req.session)
        res.redirect('/profile');
    }
    else{
        res.send('Invalid username or password');
    }
})
app.get('/profile', (req, res) => {
    if(session.userid){
        res.sendFile('/Users/muham/pps-catur/tombol.html');
    }else
    res.sendFile('views/index.html',{root:__dirname})
})
app.get('/logout',(req,res) => {
    req.session.destroy();
    res.redirect('/');
});
app.get('/data', (req, res) => {
    // buat query sql
    if(session.userid){
        const querySql = 'SELECT * FROM profile';
    console.log('Ini GET' );

    // jalankan query
    koneksi.query(querySql, (err, rows, field) => {
        // error handling
        if (err) {
            return res.status(500).json({ message: 'Ada kesalahan', error: err });
        }

        // jika request berhasil
        res.status(200).json({ success: true, data: rows });
    });
    }else
    res.sendFile('views/index.html',{root:__dirname})
    
});
app.get('/profile/:UserID', (req, res) => {
    // buat query sql
    const querySql = `SELECT * FROM profile WHERE UserID = ${req.params.UserID}`;
    console.log(`Request UserID = ${req.params.UserID}`) 
   

    // jalankan query
    koneksi.query(querySql, (err, rows, field) => {
        // error handling
        if (err) {
            return res.status(500).json({ message: 'Ada kesalahan', error: err });
        }

        // jika request berhasil
        res.status(200).json({ success: true, data: rows });
    });
});

app.listen(PORT, () => console.log(`Server running at port: ${PORT}`));