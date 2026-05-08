import express from 'express';
import sqlite3 from 'sqlite3';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// SQLite Database Setup
const db = new sqlite3.Database(path.join(__dirname, 'database.sqlite'), (err) => {
    if (err) console.error('Error opening database', err);
    else {
        db.run(`CREATE TABLE IF NOT EXISTS promotion (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            image_url TEXT,
            description TEXT,
            active INTEGER DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
    }
});

// Multer Setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'uploads/'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// API Endpoints

// Public: Get latest promotion
app.get('/api/promotion/latest', (req, res) => {
    db.get("SELECT * FROM promotion ORDER BY id DESC LIMIT 1", (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(row || {});
    });
});

// Admin: Login
app.post('/api/admin/login', (req, res) => {
    const { password } = req.body;
    if (password === '1234') {
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false, message: 'Invalid password' });
    }
});

// Admin: Get all promotions
app.get('/api/admin/promotions', (req, res) => {
    db.all("SELECT * FROM promotion ORDER BY id DESC", (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Admin: Create promotion
app.post('/api/admin/promotions', upload.single('image'), (req, res) => {
    const { description, password } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

    if (password !== '1234') return res.status(401).json({ error: 'Unauthorized' });

    db.run("INSERT INTO promotion (image_url, description) VALUES (?, ?)", [imageUrl, description], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, id: this.lastID });
    });
});

// Admin: Update promotion
app.put('/api/admin/promotions/:id', upload.single('image'), (req, res) => {
    const { id } = req.params;
    const { description, password } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    if (password !== '1234') return res.status(401).json({ error: 'Unauthorized' });

    if (imageUrl) {
        // Delete old image if exists
        db.get("SELECT image_url FROM promotion WHERE id = ?", [id], (err, row) => {
            if (row && row.image_url) {
                const oldPath = path.join(__dirname, row.image_url);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
        });

        db.run("UPDATE promotion SET image_url = ?, description = ? WHERE id = ?", [imageUrl, description, id], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true });
        });
    } else {
        db.run("UPDATE promotion SET description = ? WHERE id = ?", [description, id], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true });
        });
    }
});

// Admin: Delete promotion
app.delete('/api/admin/promotions/:id', (req, res) => {
    const { id } = req.params;
    const { password } = req.body;

    if (password !== '1234') return res.status(401).json({ error: 'Unauthorized' });

    db.get("SELECT image_url FROM promotion WHERE id = ?", [id], (err, row) => {
        if (row && row.image_url) {
            const imagePath = path.join(__dirname, row.image_url);
            if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
        }
        db.run("DELETE FROM promotion WHERE id = ?", [id], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true });
        });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

