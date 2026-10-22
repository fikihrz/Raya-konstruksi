/**
 * Utility to process, validate, resize, and compress images on the client side.
 * Converts images into optimized JPEG data URLs (base64) so they can be saved
 * directly into MongoDB Atlas without relying on server disk storage.
 */

export interface ImageProcessingOptions {
  maxSizeMB?: number; // Maximum input file size (default: 10MB)
  maxWidth?: number;  // Max width to resize to (default: 1600px for HD clarity)
  maxHeight?: number; // Max height to resize to (default: 1200px)
  quality?: number;   // Compression quality 0.1 - 1.0 (default: 0.82)
  minAspectRatio?: number; // Optional aspect ratio constraints (e.g. 0.5 for portrait max)
  maxAspectRatio?: number; // (e.g. 2.5 for landscape max)
}

export interface ImageProcessResult {
  success: boolean;
  dataUrl?: string;
  error?: string;
  width?: number;
  height?: number;
  originalSizeKB?: number;
  compressedSizeKB?: number;
  aspectRatio?: string;
}

export const processImageFile = async (
  file: File,
  options: ImageProcessingOptions = {}
): Promise<ImageProcessResult> => {
  const {
    maxSizeMB = 10,
    maxWidth = 1600,
    maxHeight = 1200,
    quality = 0.82,
    minAspectRatio,
    maxAspectRatio
  } = options;

  // 1. Validasi Tipe File (Format)
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
  if (!validTypes.includes(file.type)) {
    return {
      success: false,
      error: `Format file "${file.name}" tidak didukung. Harap upload gambar berformat JPG, PNG, WEBP, atau GIF.`
    };
  }

  // 2. Validasi Ukuran File Asli
  const originalSizeMB = file.size / (1024 * 1024);
  const originalSizeKB = Math.round(file.size / 1024);
  if (originalSizeMB > maxSizeMB) {
    return {
      success: false,
      error: `Ukuran gambar terlalu besar (${originalSizeMB.toFixed(1)} MB). Batas maksimum file yang diizinkan adalah ${maxSizeMB} MB.`
    };
  }

  // 3. Baca dan Decode Gambar
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onerror = () => {
      resolve({
        success: false,
        error: 'Gagal membaca file gambar dari perangkat Anda. Silakan coba lagi.'
      });
    };

    reader.onload = (e) => {
      const img = new Image();

      img.onerror = () => {
        resolve({
          success: false,
          error: 'File gambar rusak atau tidak dapat didekode oleh browser.'
        });
      };

      img.onload = () => {
        const { width, height } = img;
        const ratio = width / height;

        // 4. Validasi Rasio Dimensi Gambar (jika ditentukan)
        if (minAspectRatio && ratio < minAspectRatio) {
          resolve({
            success: false,
            error: `Rasio gambar terlalu tegak/ramping (${width}x${height}). Silakan gunakan foto dengan orientasi landscape atau persegi standar.`
          });
          return;
        }

        if (maxAspectRatio && ratio > maxAspectRatio) {
          resolve({
            success: false,
            error: `Rasio gambar terlalu panjang/panoramik (${width}x${height}). Silakan gunakan gambar proporsional (rekomendasi 4:3 atau 16:9).`
          });
          return;
        }

        // 5. Hitung Ukuran Resize Proporsional
        let targetWidth = width;
        let targetHeight = height;

        if (targetWidth > maxWidth || targetHeight > maxHeight) {
          if (targetWidth / maxWidth > targetHeight / maxHeight) {
            targetHeight = Math.round((targetHeight * maxWidth) / targetWidth);
            targetWidth = maxWidth;
          } else {
            targetWidth = Math.round((targetWidth * maxHeight) / targetHeight);
            targetHeight = maxHeight;
          }
        }

        // 6. Gambar ke Canvas untuk Kompresi dan Optimasi Adaptif (Target < 75KB)
        try {
          const canvas = document.createElement('canvas');
          let curWidth = targetWidth;
          let curHeight = targetHeight;

          canvas.width = curWidth;
          canvas.height = curHeight;
          let ctx = canvas.getContext('2d');

          if (!ctx) {
            resolve({
              success: false,
              error: 'Browser tidak mendukung pemrosesan grafis (Canvas Context).'
            });
            return;
          }

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, curWidth, curHeight);

          // Iterative adaptive compression agar payload selalu muat di Vercel Serverless
          let q = quality;
          let dataUrl = canvas.toDataURL('image/jpeg', q);

          // Max 75,000 characters (~55KB binary) untuk menjamin lolos 100KB limit
          while (dataUrl.length > 75000 && q > 0.4) {
            q -= 0.1;
            dataUrl = canvas.toDataURL('image/jpeg', q);
          }

          // Jika masih > 75,000 chars, turunkan resolusi canvas
          while (dataUrl.length > 75000 && curWidth > 500) {
            curWidth = Math.round(curWidth * 0.8);
            curHeight = Math.round(curHeight * 0.8);
            canvas.width = curWidth;
            canvas.height = curHeight;
            ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.imageSmoothingEnabled = true;
              ctx.imageSmoothingQuality = 'high';
              ctx.drawImage(img, 0, 0, curWidth, curHeight);
              dataUrl = canvas.toDataURL('image/jpeg', 0.65);
            }
          }

          const compressedSizeKB = Math.round((dataUrl.length * 3) / 4 / 1024);

          resolve({
            success: true,
            dataUrl,
            width: curWidth,
            height: curHeight,
            originalSizeKB,
            compressedSizeKB,
            aspectRatio: `${curWidth}:${curHeight}`
          });
        } catch (err: any) {
          resolve({
            success: false,
            error: `Gagal memproses kompresi gambar: ${err?.message || 'Error Canvas'}`
          });
        }
      };

      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
};
