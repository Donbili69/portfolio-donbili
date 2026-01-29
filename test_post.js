const http = require('http');

(async () => {
  try {
    const payload = JSON.stringify({
      name: 'Automated Test',
      email: 'auto.test@example.com',
      subject: 'End-to-end test',
      message: 'This is a test message from test_post.js'
    });

    const options = {
      hostname: 'localhost',
      port: 8080,
      path: '/api/contact',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log('Status:', res.statusCode);
        try { console.log('Response:', JSON.parse(data)); } catch (e) { console.log('Response (raw):', data); }
      });
    });

    req.on('error', (err) => console.error('Request error', err));
    req.write(payload);
    req.end();
  } catch (err) {
    console.error(err);
  }
})();
