const  express = require('express');
const mysql = require('mysql');
const hbs =  require('hbs');
const bodyParser = require('body-parser');

const  app = express();
const port = 9900;

app.set('view engine', 'hbs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


var koneksi =  mysql.createConnection({
   host: 'localhost',
   user: 'rizal',
   password: '0000',
   database: 'absen_siswa'
});

koneksi.connect((err) => {
   if(err) throw err;
   console.log("Koneksi Database Berhasil disambung boss!!");
});
app.get('/', (req, res) => {
    koneksi.query('use absen_siswa', (err, hasil) => {
     if(err) throw err;
     res.render('home.hbs', {
         halaman: 'HOME',
         data: hasil
       });
    });
 });

 app.get('/home', (req, res) => {
    res.render( __dirname + '/views/home.hbs');
});


 //siswa
 app.get('/siswa', (req, res) => {
    koneksi.query('SELECT * FROM absen_siswa', (err, hasil) => {
     if(err) throw err;
     res.render('siswa.hbs', {
         halaman: 'HOME',
         data: hasil
       });
    });
 });
 
 app.post('/siswa', (req, res) => {
   var nisn = req.body.inputnisn;
   var nama = req.body.inputnamasiswa;
   var kelas = req.body.inputkelas;
   var tanggal = req.body.inputtanggal; 
   var keterangan = req.body.inputketerangan;  
   koneksi.query('INSERT INTO absen_siswa( nisn, nama_siswa, kelas, tanggal, keterangan) VALUES( ?, ?, ?, ?, ?)',
         [  nisn, nama, kelas, tanggal, keterangan ],
             (err, hasil) => {
                 if(err) throw err;
                 res.redirect('/siswa');
                 }
           )
 });
 
 app.get('/bersih/:namasiswa', (req,res) => {
     var nama = req.params.namasiswa;
     koneksi.query("DELETE FROM absen_siswa WHERE nama_siswa = ?",
     [nama], (err, hasil) => {
         if(err) throw err;
         res.redirect('/siswa');
       }
     )
 });

app.listen(port, () => {
    console.log(`App berjalan pada port ${port}`);
});