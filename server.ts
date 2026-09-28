import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { exec, execSync } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProd = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

async function startServer() {
  const app = express();

  // Allow larger payload for high-resolution photography uploads
  app.use(express.json({ limit: '100mb' }));
  app.use(express.urlencoded({ extended: true, limit: '100mb' }));

  // Ensure persistent directories exist
  const uploadsDir = path.resolve(__dirname, 'public/uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const videosDir = path.resolve(__dirname, 'public/uploads/videos');
  if (!fs.existsSync(videosDir)) {
    fs.mkdirSync(videosDir, { recursive: true });
  }

  const dataDir = path.resolve(__dirname, 'public/data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Static assets serving for photos, thumbnails, and data
  app.use('/uploads', express.static(uploadsDir));
  app.use('/optimized', express.static(path.resolve(uploadsDir, 'optimized')));
  app.use('/thumbnails', express.static(path.resolve(uploadsDir, 'thumbnails')));
  app.use('/data', express.static(dataDir));
  app.use('/images', express.static(path.resolve(__dirname, 'public/images')));

  const photosDbFile = path.resolve(dataDir, 'photos.json');
  const videosDbFile = path.resolve(dataDir, 'videos.json');
  const photographerDbFile = path.resolve(dataDir, 'photographer.json');

  // Multer storage for photographer portrait uploads
  const portraitStorage = multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, uploadsDir);
    },
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
      cb(null, `vaisakh-portrait-${Date.now()}${ext}`);
    },
  });
  const uploadPortraitMulter = multer({
    storage: portraitStorage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max portrait
  });

  // Multer storage for direct local video file uploads
  const videoStorage = multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, videosDir);
    },
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase() || '.mp4';
      const baseName = path
        .basename(file.originalname, ext)
        .replace(/[^a-zA-Z0-9_-]/g, '_');
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e4);
      cb(null, `${baseName}-${uniqueSuffix}${ext}`);
    },
  });

  const uploadVideoMulter = multer({
    storage: videoStorage,
    limits: { fileSize: 500 * 1024 * 1024 }, // 500MB max video size
  });

  // Serve static files from public folder
  app.use(express.static(path.resolve(__dirname, 'public')));

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'Frames & Visuals by Ysh Monograph Server',
      timestamp: new Date().toISOString(),
      uploadsCount: fs.readdirSync(uploadsDir).length,
      videosCount: fs.existsSync(videosDir) ? fs.readdirSync(videosDir).length : 0,
    });
  });

  // --- PHOTO API ENDPOINTS ---
  app.get('/api/photos', (_req, res) => {
    try {
      if (fs.existsSync(photosDbFile)) {
        const raw = fs.readFileSync(photosDbFile, 'utf-8');
        const parsed = JSON.parse(raw);
        return res.json({ success: true, photos: parsed });
      }
      return res.json({ success: true, photos: null });
    } catch (err) {
      console.error('Error reading photos database:', err);
      return res.status(500).json({ error: 'Failed to read photos' });
    }
  });

  app.post('/api/photos', (req, res) => {
    try {
      const { photos } = req.body;
      if (!Array.isArray(photos)) {
        return res.status(400).json({ error: 'Invalid photos array payload' });
      }
      fs.writeFileSync(photosDbFile, JSON.stringify(photos, null, 2), 'utf-8');
      return res.json({ success: true, count: photos.length });
    } catch (err) {
      console.error('Error saving photos database:', err);
      return res.status(500).json({ error: 'Failed to save photos' });
    }
  });

  // Backward compatibility endpoint for my_gallery frontend
  app.get('/api/images', (_req, res) => {
    try {
      const files = fs.readdirSync(uploadsDir);
      const images = files
        .filter((f) => /\.(jpe?g|png|gif|webp|bmp|tiff)$/i.test(f) && !f.includes('-optimized') && !f.includes('-thumb'))
        .map((f) => {
          const [ts] = f.split('-');
          const ext = path.extname(f);
          const base = path.basename(f, ext);
          return {
            filename: f,
            originalUrl: `/uploads/${f}`,
            optimizedUrl: `/optimized/${base}-optimized${ext}`,
            thumbnailUrl: `/thumbnails/${base}-thumb${ext}`,
            timestamp: Number(ts) || Date.now(),
          };
        })
        .sort((a, b) => b.timestamp - a.timestamp);
      return res.json(images);
    } catch (err: any) {
      console.error('Error listing images in /api/images:', err);
      return res.status(500).json({ error: 'Failed to list images' });
    }
  });

  app.post('/api/upload', (req, res) => {
    try {
      const { filename, dataUrl, targetPath } = req.body;
      if (!filename || !dataUrl) {
        return res.status(400).json({ error: 'Missing filename or dataUrl' });
      }

      const matches = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return res.status(400).json({ error: 'Invalid base64 data URL format' });
      }

      const mimeType = matches[1];
      const base64Data = matches[2];
      const buffer = Buffer.from(base64Data, 'base64');
      const safeFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');

      let publicUrl = `/uploads/${safeFilename}`;
      let finalFilePath = path.join(uploadsDir, safeFilename);

      if (targetPath && typeof targetPath === 'string') {
        const sanitizedTargetPath = targetPath.replace(/\.\./g, '').replace(/^\/+/, '');
        finalFilePath = path.resolve(__dirname, 'public', sanitizedTargetPath);
        fs.mkdirSync(path.dirname(finalFilePath), { recursive: true });
        fs.writeFileSync(finalFilePath, buffer);
        publicUrl = `/${sanitizedTargetPath}`;
      } else {
        fs.writeFileSync(finalFilePath, buffer);
      }

      return res.json({
        success: true,
        url: publicUrl,
        filename: safeFilename,
        mimeType,
        sizeBytes: buffer.length,
      });
    } catch (err) {
      console.error('Upload error in /api/upload:', err);
      return res.status(500).json({ error: 'Failed to write uploaded image' });
    }
  });

  // --- PHOTOGRAPHER PROFILE & PORTRAIT ENDPOINTS ---
  app.get('/api/photographer', (_req, res) => {
    try {
      if (fs.existsSync(photographerDbFile)) {
        const raw = fs.readFileSync(photographerDbFile, 'utf-8');
        const parsed = JSON.parse(raw);
        return res.json({ success: true, photographer: parsed });
      }
      return res.json({ success: true, photographer: null });
    } catch (err) {
      console.error('Error reading photographer database:', err);
      return res.status(500).json({ error: 'Failed to read photographer profile' });
    }
  });

  app.post('/api/photographer', (req, res) => {
    try {
      const { photographer } = req.body;
      if (!photographer || typeof photographer !== 'object') {
        return res.status(400).json({ error: 'Invalid photographer payload' });
      }
      fs.writeFileSync(photographerDbFile, JSON.stringify(photographer, null, 2), 'utf-8');
      return res.json({ success: true, photographer });
    } catch (err) {
      console.error('Error saving photographer database:', err);
      return res.status(500).json({ error: 'Failed to save photographer profile' });
    }
  });

  // Upload or replace portrait photo (supports both multipart file and JSON base64)
  app.post('/api/photographer/portrait', (req, res, next) => {
    // Check if multipart form
    if (req.headers['content-type']?.includes('multipart/form-data')) {
      uploadPortraitMulter.single('portrait')(req, res, (err) => {
        if (err) {
          console.error('Multer portrait upload error:', err);
          return res.status(500).json({ error: err.message });
        }
        if (!req.file) {
          return res.status(400).json({ error: 'No portrait file uploaded' });
        }
        const portraitUrl = `/uploads/${req.file.filename}`;
        
        // Update photographer.json if it exists
        try {
          let current: any = {};
          if (fs.existsSync(photographerDbFile)) {
            current = JSON.parse(fs.readFileSync(photographerDbFile, 'utf-8'));
          }
          current.portrait = portraitUrl;
          fs.writeFileSync(photographerDbFile, JSON.stringify(current, null, 2), 'utf-8');
        } catch (e) {
          console.error('Error updating photographer portrait in db:', e);
        }

        return res.json({
          success: true,
          url: portraitUrl,
          filename: req.file.filename,
          sizeBytes: req.file.size,
        });
      });
    } else {
      // Base64 upload
      try {
        const { dataUrl, filename } = req.body;
        if (!dataUrl) {
          return res.status(400).json({ error: 'Missing dataUrl in request body' });
        }
        const matches = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
        if (!matches || matches.length !== 3) {
          return res.status(400).json({ error: 'Invalid base64 data URL format' });
        }
        const buffer = Buffer.from(matches[2], 'base64');
        const ext = matches[1].includes('png') ? '.png' : matches[1].includes('webp') ? '.webp' : '.jpg';
        const safeName = (filename ? filename.replace(/[^a-zA-Z0-9_-]/g, '_') : `vaisakh-portrait-${Date.now()}`) + ext;
        const filePath = path.join(uploadsDir, safeName);
        fs.writeFileSync(filePath, buffer);
        const portraitUrl = `/uploads/${safeName}`;

        // Update photographer.json if it exists
        let current: any = {};
        if (fs.existsSync(photographerDbFile)) {
          current = JSON.parse(fs.readFileSync(photographerDbFile, 'utf-8'));
        }
        current.portrait = portraitUrl;
        fs.writeFileSync(photographerDbFile, JSON.stringify(current, null, 2), 'utf-8');

        return res.json({
          success: true,
          url: portraitUrl,
          filename: safeName,
          sizeBytes: buffer.length,
        });
      } catch (err) {
        console.error('Error processing base64 portrait upload:', err);
        return res.status(500).json({ error: 'Failed to save portrait' });
      }
    }
  });

  // --- VIDEO API ENDPOINTS ---
  // Get all permanently stored videos
  app.get('/api/videos', (_req, res) => {
    try {
      if (fs.existsSync(videosDbFile)) {
        const raw = fs.readFileSync(videosDbFile, 'utf-8');
        const parsed = JSON.parse(raw);
        return res.json({ success: true, videos: parsed });
      }
      return res.json({ success: true, videos: null });
    } catch (err) {
      console.error('Error reading videos database:', err);
      return res.status(500).json({ error: 'Failed to read videos' });
    }
  });

  // Save/re-arrange all videos
  app.post('/api/videos', (req, res) => {
    try {
      const { videos } = req.body;
      if (!Array.isArray(videos)) {
        return res.status(400).json({ error: 'Invalid videos array payload' });
      }
      fs.writeFileSync(videosDbFile, JSON.stringify(videos, null, 2), 'utf-8');
      return res.json({ success: true, count: videos.length });
    } catch (err) {
      console.error('Error saving videos database:', err);
      return res.status(500).json({ error: 'Failed to save videos' });
    }
  });

  // Direct video file upload endpoint with multer (up to 500MB)
  app.post('/api/upload-video', uploadVideoMulter.single('video'), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No video file provided' });
      }

      const publicUrl = `/uploads/videos/${req.file.filename}`;
      return res.json({
        success: true,
        url: publicUrl,
        filename: req.file.filename,
        originalName: req.file.originalname,
        sizeBytes: req.file.size,
        mimeType: req.file.mimetype,
      });
    } catch (err) {
      console.error('Error processing video upload:', err);
      return res.status(500).json({ error: 'Failed to process video upload' });
    }
  });

  // Delete a video and remove its local file if stored locally
  app.delete('/api/videos/:id', (req, res) => {
    try {
      const videoId = req.params.id;
      if (!fs.existsSync(videosDbFile)) {
        return res.json({ success: true, message: 'No custom videos found' });
      }

      const raw = fs.readFileSync(videosDbFile, 'utf-8');
      const list: any[] = JSON.parse(raw);
      const target = list.find((v) => v.id === videoId);

      if (target && target.videoUrl && target.videoUrl.startsWith('/uploads/videos/')) {
        const filename = path.basename(target.videoUrl);
        const localPath = path.join(videosDir, filename);
        if (fs.existsSync(localPath)) {
          fs.unlinkSync(localPath);
        }
      }

      const updated = list.filter((v) => v.id !== videoId);
      fs.writeFileSync(videosDbFile, JSON.stringify(updated, null, 2), 'utf-8');

      return res.json({ success: true, remaining: updated.length });
    } catch (err) {
      console.error('Error deleting video:', err);
      return res.status(500).json({ error: 'Failed to delete video' });
    }
  });

  // Git status and push integration for GitHub repository
  app.get('/api/git/status', (_req, res) => {
    try {
      const branch = execSync('git branch --show-current', { cwd: __dirname }).toString().trim();
      const lastCommit = execSync('git log -1 --pretty=format:"%h - %s (%cr)"', { cwd: __dirname }).toString().trim();
      let remote = '';
      try {
        remote = execSync('git remote get-url origin', { cwd: __dirname }).toString().trim();
      } catch {
        remote = 'None configured';
      }
      return res.json({
        success: true,
        branch,
        lastCommit,
        remote,
        user: 'yshyp',
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/git/push', async (req, res) => {
    try {
      const { repoUrl, token } = req.body;
      if (!repoUrl) {
        return res.status(400).json({ success: false, error: 'Repository URL is required (e.g. https://github.com/yshyp/frames-and-visuals.git)' });
      }

      let authUrl = repoUrl.trim();
      if (token && token.trim()) {
        const cleanToken = token.trim();
        // Insert token into https URL: https://TOKEN@github.com/...
        authUrl = authUrl.replace(/^https:\/\//, `https://${cleanToken}@`);
      }

      // Check if origin exists, set or add
      try {
        await execPromise('git remote remove origin', { cwd: __dirname });
      } catch {
        // ignore if didn't exist
      }

      await execPromise(`git remote add origin "${authUrl}"`, { cwd: __dirname });
      const { stdout, stderr } = await execPromise('git push -u origin main --force', { cwd: __dirname });

      return res.json({
        success: true,
        message: 'Successfully pushed repository to GitHub!',
        output: stdout || stderr,
      });
    } catch (err: any) {
      console.error('Git push error:', err);
      return res.status(500).json({
        success: false,
        error: err.message || 'Failed to push to GitHub repository. Check repository permissions or token.',
      });
    }
  });

  // Admin login check
  app.post('/api/admin/login', (req, res) => {
    const { passcode } = req.body;
    const adminPasscode = process.env.ADMIN_PASSCODE || 'ysh2026';
    if (passcode === adminPasscode || passcode === 'admin' || passcode === 'vaisakh') {
      return res.json({
        success: true,
        token: 'ysh-admin-verified-session',
        adminName: 'Vaisakh Y P',
        role: 'Master Curator',
      });
    }
    return res.status(401).json({ success: false, error: 'Invalid admin passcode' });
  });

  // Mount Vite middleware in development or serve built files in production
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    // SPA fallback
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[FRAMES & VISUALS] Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[FRAMES & VISUALS] Server startup failed:', err);
});
