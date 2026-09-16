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

export async function saveUploadedFile(file: File, subfolder: 'receipts' | 'avatars' | 'cards' | 'templates' | 'branding' = 'receipts'): Promise<StorageResult> {
  const targetDir = path.join(UPLOADS_DIR, subfolder);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const timestamp = Date.now();
  const safeOriginalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const uniqueFilename = `${timestamp}-${safeOriginalName}`;
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
