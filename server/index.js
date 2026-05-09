import express from 'express';
import { createClient } from '@supabase/supabase-js';
import multer from 'multer';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Supabase Setup
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env file');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Multer Setup (Memory Storage for Supabase Upload)
const upload = multer({ storage: multer.memoryStorage() });

// API Endpoints

// Public: Get latest promotion
app.get('/api/promotion/latest', async (req, res) => {
    const { data, error } = await supabase
        .from('promotion')
        .select('*')
        .order('id', { ascending: false })
        .limit(1)
        .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows found"
        return res.status(500).json({ error: error.message });
    }
    res.json(data || {});
});

// Helper: Verify Admin Role
async function verifyAdmin(accessToken) {
    if (!accessToken) return false;
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (error || !user) return false;

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    return profile?.role === 'admin';
}

// Admin: Login (No longer needed with Supabase Auth, but keeping for compatibility if needed)
app.post('/api/admin/login', (req, res) => {
    res.status(410).json({ error: 'Please use Supabase Auth to login' });
});

// Admin: Get all promotions
app.get('/api/admin/promotions', async (req, res) => {
    // We can still allow fetching, or add verification here
    const { data, error } = await supabase
        .from('promotion')
        .select('*')
        .order('id', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// Admin: Create promotion
app.post('/api/admin/promotions', upload.single('image'), async (req, res) => {
    const { description, end_at, access_token } = req.body;
    
    if (!(await verifyAdmin(access_token))) {
        return res.status(403).json({ error: 'Unauthorized: Admin access required' });
    }

    let imageUrl = '';
    if (req.file) {
        // ... (existing upload logic remains the same)
        const fileName = `${Date.now()}-${req.file.originalname}`;
        const { data: storageData, error: storageError } = await supabase.storage
            .from('promotions')
            .upload(fileName, req.file.buffer, {
                contentType: req.file.mimetype,
                upsert: false
            });

        if (storageError) return res.status(500).json({ error: storageError.message });

        const { data: { publicUrl } } = supabase.storage
            .from('promotions')
            .getPublicUrl(fileName);
        
        imageUrl = publicUrl;
    }

    const { data, error } = await supabase
        .from('promotion')
        .insert([{ image_url: imageUrl, description, end_at: end_at || null }])
        .select();

    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true, id: data[0].id });
});

// Admin: Update promotion
app.put('/api/admin/promotions/:id', upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const { description, end_at, access_token } = req.body;

    if (!(await verifyAdmin(access_token))) {
        return res.status(403).json({ error: 'Unauthorized: Admin access required' });
    }

    const updateData = { description, end_at: end_at || null };
    // ... rest of existing update logic
    if (req.file) {
        const fileName = `${Date.now()}-${req.file.originalname}`;
        const { data: storageData, error: storageError } = await supabase.storage
            .from('promotions')
            .upload(fileName, req.file.buffer, {
                contentType: req.file.mimetype,
                upsert: false
            });

        if (storageError) return res.status(500).json({ error: storageError.message });

        const { data: { publicUrl } } = supabase.storage
            .from('promotions')
            .getPublicUrl(fileName);
        
        updateData.image_url = publicUrl;

        const { data: oldRow } = await supabase
            .from('promotion')
            .select('image_url')
            .eq('id', id)
            .single();

        if (oldRow && oldRow.image_url) {
            const oldFileName = oldRow.image_url.split('/').pop();
            await supabase.storage.from('promotions').remove([oldFileName]);
        }
    }

    const { error } = await supabase
        .from('promotion')
        .update(updateData)
        .eq('id', id);

    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
});

// Admin: Delete promotion
app.delete('/api/admin/promotions/:id', async (req, res) => {
    const { id } = req.params;
    const { access_token } = req.body;

    if (!(await verifyAdmin(access_token))) {
        return res.status(403).json({ error: 'Unauthorized: Admin access required' });
    }

    // Get image URL to delete from storage
    const { data: row } = await supabase
        .from('promotion')
        .select('image_url')
        .eq('id', id)
        .single();

    if (row && row.image_url) {
        const fileName = row.image_url.split('/').pop();
        await supabase.storage.from('promotions').remove([fileName]);
    }

    const { error } = await supabase
        .from('promotion')
        .delete()
        .eq('id', id);

    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
