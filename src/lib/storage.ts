import fs from 'fs';
import path from 'path';

export interface StorageResult {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

// Ensure upload directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 Megabytes maximum

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
  'application/pdf',
]);

export async function saveUploadedFile(
  file: File,
  subfolder: 'receipts' | 'avatars' | 'cards' | 'templates' | 'branding' = 'receipts'
): Promise<StorageResult> {
  // 1. File Size Verification (Max 5MB)
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error(`File exceeds maximum permitted size of 5MB.`);
  }

  // 2. MIME Type Whitelist
  if (!ALLOWED_MIME_TYPES.has(file.type.toLowerCase())) {
    throw new Error(`File type '${file.type}' is not permitted. Allowed: JPG, PNG, WEBP, SVG, PDF.`);
  }

  const targetDir = path.join(UPLOADS_DIR, subfolder);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // 3. Prevent Path Traversal in filenames
  const baseName = path.basename(file.name);
  const safeOriginalName = baseName.replace(/[^a-zA-Z0-9.-]/g, '_').substring(0, 100);
  const uniqueFilename = `${Date.now()}-${safeOriginalName}`;
  const filePath = path.join(targetDir, uniqueFilename);

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  await fs.promises.writeFile(filePath, buffer);

  const publicUrl = `/uploads/${subfolder}/${uniqueFilename}`;
  return {
    url: publicUrl,
    filename: uniqueFilename,
    size: buffer.length,
    mimeType: file.type,
  };
}

export async function saveBase64Image(base64Data: string, subfolder: 'cards' | 'avatars' = 'cards', filenamePrefix: string = 'badge'): Promise<string> {
  const targetDir = path.join(UPLOADS_DIR, subfolder);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // Remove data:image/...;base64, prefix
  const matches = base64Data.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error('Invalid base64 string');
  }

  const extension = matches[1].split('/')[1] || 'png';
  const dataBuffer = Buffer.from(matches[2], 'base64');
  const filename = `${filenamePrefix}-${Date.now()}.${extension}`;
  const filePath = path.join(targetDir, filename);

  await fs.promises.writeFile(filePath, dataBuffer);
  return `/uploads/${subfolder}/${filename}`;
}

export async function downloadAndSaveRemoteImage(
  url: string,
  subfolder: 'avatars' | 'cards' = 'avatars',
  filenamePrefix: string = 'avatar'
): Promise<string> {
  const targetDir = path.join(UPLOADS_DIR, subfolder);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // If it's already a local uploaded file, return as is
  if (url.startsWith('/uploads/')) {
    return url;
  }

  // If it's a data URL, use saveBase64Image
  if (url.startsWith('data:image/')) {
    return await saveBase64Image(url, subfolder, filenamePrefix);
  }

  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch image from URL: ${res.status} ${res.statusText}`);
  }

  const contentType = res.headers.get('content-type') || 'image/png';
  let ext = 'png';
  if (contentType.includes('jpeg') || contentType.includes('jpg')) ext = 'jpg';
  else if (contentType.includes('webp')) ext = 'webp';
  else if (contentType.includes('svg')) ext = 'svg';

  const buffer = Buffer.from(await res.arrayBuffer());
  const filename = `${filenamePrefix}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${ext}`;
  const filePath = path.join(targetDir, filename);

  await fs.promises.writeFile(filePath, buffer);
  return `/uploads/${subfolder}/${filename}`;
}

