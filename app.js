const express = require('express');
const mysql = require('mysql2');
const AWS = require('aws-sdk');
const cors = require('cors');

const app = express();
const port = 3000;

// Konfigurasi CORS agar frontend bisa akses backend
app.use(cors({
  origin: 'http://127.0.0.1:5500' // Ganti dengan IP atau domain frontend kamu
}));

// Konfigurasi AWS S3
const s3 = new AWS.S3({
  region: '', // ganti dengan region bucket kamu
  accessKeyId: '',  // ganti dengan access key kamu
  secretAccessKey: ''   // ganti dengan secret key kamu
});

const bucketName = '';

// Konfigurasi koneksi database MySQL RDS
const db = mysql.createConnection({
  host: '',       // ganti dengan endpoint RDS kamu
  user: '',        // ganti dengan username DB
  password: '',    // ganti dengan password DB
  database: ''   // ganti dengan nama database
});

db.connect(err => {
  if (err) {
    console.error('Gagal koneksi ke database HAHAHA gblk:', err);
  } else {
    console.log('Terhubung ke database MySQL RDS');
  }
});

// Endpoint API untuk mengambil data sepatu
app.get('/api/sepatu', (req, res) => {
    const query = 'SELECT id, city, harga, size, gambar_key FROM sepatu_ilyas';
  
    db.query(query, (err, results) => {
      if (err) {
        console.error('Query error:', err); // Log error lebih detail
        return res.status(500).json({ error: 'Gagal mengambil data sepatu', details: err });
      }
  
      // Buat array sepatu dengan URL gambar dari S3
      const sepatu = results.map(item => {
        const gambarUrl = s3.getSignedUrl('getObject', {
          Bucket: bucketName,
          Key: item.gambar_key,
          Expires: 60 * 60 // URL berlaku 1 jam
        });
  
        return {
          id: item.id,
          city: item.city,
          harga: item.harga,
          size: item.size,
          gambar: gambarUrl
        };
      });
  
      res.json(sepatu);
    });
  });
  
app.listen(port, () => {
    console.log(`Backend berjalan di http://localhost:${port}`);
  });  