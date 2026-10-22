const https = require('https');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'admin', 'public', 'Profil.png');
const fileBuffer = fs.readFileSync(filePath);

const boundary = '----WebKitFormBoundary' + Math.random().toString(16).slice(2);
const header = Buffer.from(
  `--${boundary}\r\nContent-Disposition: form-data; name="image"; filename="Profil.png"\r\nContent-Type: image/png\r\n\r\n`
);
const footer = Buffer.from(`\r\n--${boundary}--\r\n`);
const payload = Buffer.concat([header, fileBuffer, footer]);

const req = https.request('https://backend-three-beta-90.vercel.app/api/upload', {
  method: 'POST',
  headers: {
    'Content-Type': `multipart/form-data; boundary=${boundary}`,
    'Content-Length': payload.length
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status code:', res.statusCode);
    console.log('Response body:', data);
  });
});

req.on('error', (err) => console.error('Upload request error:', err));
req.write(payload);
req.end();
