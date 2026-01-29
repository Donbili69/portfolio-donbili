const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
// load environment variables if `dotenv` is available (optional)
try {
    require('dotenv').config();
} catch (e) {
    console.warn('dotenv not installed — continuing without .env');
}

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Simple health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Contact endpoint
app.post('/api/contact', async (req, res) => {
    try {
        const ip = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'] || 'unknown';

        // Basic rate limiting (in-memory)
        // Allow RATE_LIMIT_MAX requests per RATE_LIMIT_WINDOW per IP
        const now = Date.now();
        const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
        const RATE_LIMIT_MAX = 5;
        if (!global._rateLimitMap) global._rateLimitMap = new Map();
        const rl = global._rateLimitMap;
        let rlEntry = rl.get(ip) || { count: 0, start: now };
        if (now - rlEntry.start > RATE_LIMIT_WINDOW) {
            rlEntry.count = 1;
            rlEntry.start = now;
        } else {
            rlEntry.count += 1;
        }
        rl.set(ip, rlEntry);
        if (rlEntry.count > RATE_LIMIT_MAX) {
            return res.status(429).json({ error: 'Too many requests — please try again later.' });
        }

        const { name, email, subject, message } = req.body || {};

        // Basic validation + sanitization
        const sanitize = (s) => (typeof s === 'string' ? s.trim().replace(/[<>]/g, '') : '');
        const safeName = sanitize(name);
        const safeEmail = sanitize(email);
        const safeSubject = sanitize(subject);
        const safeMessage = sanitize(message);

        const errors = [];
        if (!safeName) errors.push('Name is required');
        if (!safeEmail) errors.push('Email is required');
        // simple email regex
        const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (safeEmail && !emailRe.test(safeEmail)) errors.push('Email is invalid');
        if (!safeSubject) errors.push('Subject is required');
        if (!safeMessage) errors.push('Message is required');
        if (safeName && safeName.length > 100) errors.push('Name is too long');
        if (safeSubject && safeSubject.length > 200) errors.push('Subject is too long');
        if (safeMessage && safeMessage.length > 2000) errors.push('Message is too long');

        if (errors.length) {
            return res.status(400).json({ error: 'Validation failed', details: errors });
        }

        // Persist to messages.json (append)
        const messagesPath = path.join(__dirname, 'messages.json');
        const entry = {
            id: Date.now(),
            name: safeName,
            email: safeEmail,
            subject: safeSubject,
            message: safeMessage,
            receivedAt: new Date().toISOString(),
            ip
        };

        let arr = [];
        if (fs.existsSync(messagesPath)) {
            try { arr = JSON.parse(fs.readFileSync(messagesPath, 'utf8')); } catch (e) { arr = []; }
        }
        arr.push(entry);
        fs.writeFileSync(messagesPath, JSON.stringify(arr, null, 2));

        // If SMTP is configured, send an email notification
        if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.NOTIFY_TO) {
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
                secure: process.env.SMTP_SECURE === 'true',
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS
                }
            });

            const mailOptions = {
                from: process.env.SMTP_FROM || process.env.SMTP_USER,
                to: process.env.NOTIFY_TO,
                subject: `New contact: ${subject}`,
                text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`
            };

            await transporter.sendMail(mailOptions);
        }

        // Forward to Formspree (so you receive messages there)
        try {
            const formspreeUrl = process.env.FORMSPREE_URL || 'https://formspree.io/f/xlgnnwgb';
            // Use global fetch (Node 18+). Do not fail the request if Formspree forwarding fails.
            const fsResp = await fetch(formspreeUrl, {
                method: 'POST',
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: safeName, email: safeEmail, subject: safeSubject, message: safeMessage })
            });
            if (!fsResp.ok) {
                const text = await fsResp.text().catch(() => 'no body');
                console.warn('Formspree forward failed', fsResp.status, text);
            }
        } catch (e) {
            console.warn('Formspree forward error', e && e.message ? e.message : e);
        }

        return res.json({ ok: true, message: 'Message received' });
    } catch (err) {
        console.error('Contact error', err);
        return res.status(500).json({ error: 'Server error' });
    }
});

app.use(express.static(path.join(__dirname)));

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});