# Portfolio 2.0

A modern, interactive, and responsive 3D portfolio website featuring interactive code snippets, rotating inspirational quotes, professional demos, and seamless contact form integration with email notifications.

**Live Demo**: http://localhost:8080

## Recent Changes (Jan 2026)

- Fixed layout issues in the hero and skills sections for improved readability.
- Redesigned the Technology Stack badges (compact icons + descriptions).
- Added a small TypeScript live demo in the hero section.
- Made project showcase cards square and adjustable (can be removed — see Troubleshooting).
- Multiple CSS and JS fixes to ensure responsive behavior and avoid text overlap.

**Troubleshooting / Quick Tips**

- If the site doesn't reflect recent edits, hard-refresh the browser or clear cache (Ctrl+Shift+R / Ctrl+Shift+Delete).
- Restart the server if static files were changed:

```powershell
cd "c:\Users\mwsha\OneDrive\Desktop\portfolio 2.0"
node server.js
```

If you still see stale content, open DevTools → Network → check `Disable cache` and reload the page.


## About Me

I'm **Donbill Mwshahary**, a passionate full-stack developer dedicated to creating beautiful, functional, and inspiring digital experiences. With a strong foundation in both frontend and backend technologies, I transform complex ideas into elegant, user-friendly solutions.

### My Mission

To build innovative web applications that not only solve problems but also inspire and delight users. I believe great code is poetry—it should be readable, maintainable, and purposeful.

### My Approach

- **Creative Problem-Solving**: I tackle challenges with creativity and technical excellence
- **User-Centric Design**: Every project puts the user experience first
- **Continuous Learning**: The tech world evolves fast, and so do I
- **Professional Quality**: Whether it's a portfolio or enterprise app, I deliver excellence

### Key Achievements

- 50+ projects completed
- 30+ satisfied clients
- 5+ years of development experience
- Expertise in full-stack web development
- Specialization in 3D interactive experiences and responsive design

## Features

- ✨ **Responsive Design**: Mobile-first approach with full responsiveness
- 🎯 **3D Effects**: Interactive 3D card animations on hover
- 📬 **Contact Form**: Server-side validation, rate limiting, and Formspree integration
- 🎓 **Skills Gallery**: Organized skill categories with filtering and live code examples
- 🎨 **Project Showcase**: Interactive project cards with 3D tilt effect
- 🌐 **Social Media Links**: Direct links to LinkedIn, GitHub, and Twitter/X profiles
- 🎭 **Skill Icons**: SVG icons for various technologies and tools
- 💭 **Rotating Quotes & Jokes**: Inspirational quotes and developer jokes that change every 6 hours
- 🚀 **Interactive Code Snippets**: Click "Curious?" to view and run professional code examples
- ♿ **Accessibility**: Keyboard navigation, ARIA labels, and semantic HTML
- 🔐 **Security**: Input sanitization, rate limiting, CORS protection
- 📊 **Analytics Ready**: Email notifications via Formspree and SMTP

## Project Structure

```
portfolio 2.0/
├── index.html          # Main HTML file
├── script.js           # Client-side JavaScript
├── style.css           # Styling
├── server.js           # Express backend
├── package.json        # Dependencies
├── .env.example        # Environment variables template
├── .gitignore          # Git ignore rules
├── messages.json       # Stored contact messages (local)
├── test_post.js        # Test script for contact form
└── assets/             # SVG images for skills
    ├── frontend-htmlcss.svg
    ├── frontend-js.svg
    ├── frontend-react.svg
    ├── frontend-responsive.svg
    ├── backend-node.svg
    ├── backend-python.svg
    ├── database.svg
    ├── api.svg
    ├── tools-git.svg
    ├── tools-agile.svg
    ├── tools-docker.svg
    └── tools-testing.svg
```

## Setup & Installation

### Prerequisites
- Node.js (v18 or higher)
- npm (comes with Node.js)

### Quick Start

1. **Clone or Download** this repository

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start the Server**:
   ```bash
   npm start
   # or
   node server.js
   ```

4. **Access the Site**:
   Open http://localhost:8080 in your browser

### Verify Installation
```bash
# Check server health
curl http://localhost:8080/api/health

# Should return: {"status":"ok"}
```

## Configuration

### Email Notifications (Optional)

To receive email notifications when someone submits the contact form:

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your SMTP credentials:
   ```
   PORT=8080
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password
   NOTIFY_TO=your_email@gmail.com
   SMTP_FROM=your_email@gmail.com
   ```

3. Restart the server — emails now work!

### Formspree Integration

Contact form submissions are automatically forwarded to:
- **Endpoint**: `https://formspree.io/f/xlgnnwgb`
- **Backup**: Messages saved locally in `messages.json`
- **Purpose**: Receive all contact requests in your inbox

### Customization

**Update Social Links** in `index.html`:
```html
<a href="https://www.linkedin.com/in/YOUR_PROFILE/" ...>LinkedIn</a>
<a href="https://github.com/YOUR_USERNAME" ...>GitHub</a>
<a href="https://x.com/YOUR_HANDLE" ...>Twitter</a>
```

**Current Social Links**:
- **LinkedIn**: https://www.linkedin.com/in/donbill-mwshahary-7731293a1/
- **GitHub**: https://github.com/Donbili69
- **Twitter/X**: https://x.com/Donbill_M

## Features Implemented

### Client-Side (HTML/CSS/JS)
- ✅ Smooth scrolling navigation with keyboard support
- ✅ Intersection observer animations on scroll
- ✅ 3D tilt effect on project cards (hover interactive)
- ✅ Skill filtering by category (Frontend, Backend, Tools)
- ✅ Keyboard navigation (arrow keys for section navigation)
- ✅ Dynamic cursor effect (custom cursor design)
- ✅ Scroll progress bar (visual scroll indicator)
- ✅ Mobile hamburger menu (responsive navigation)
- ✅ Rotating quotes/jokes (6-hour refresh cycle)
- ✅ Interactive code snippets with "Curious?" buttons
- ✅ Live demo output for each code example
- ✅ Copy-to-clipboard functionality
- ✅ Number counter animation on scroll
- ✅ Parallax floating objects effect

### Server-Side (Node.js/Express)
- ✅ Input validation & sanitization (prevent XSS)
- ✅ Rate limiting (5 requests/minute per IP)
- ✅ Contact form handling with error responses
- ✅ Message persistence to `messages.json`
- ✅ Optional email forwarding via SMTP
- ✅ Formspree integration for backup notifications
- ✅ CORS support for cross-origin requests
- ✅ Health check endpoint
- ✅ Static file serving
- ✅ Error logging and handling

## Testing

### Contact Form Testing

Test the contact form with the included test script:

```bash
node test_post.js
```

Or use PowerShell:
```powershell
$body = @{
    name = "Test User"
    email = "test@example.com"
    subject = "Test Subject"
    message = "This is a test message"
} | ConvertTo-Json

Invoke-RestMethod -Method Post -Uri http://localhost:8080/api/contact `
    -ContentType 'application/json' -Body $body
```

### Expected Response
```json
{
  "ok": true,
  "message": "Message received"
}
```

### Rate Limiting Test

Try sending more than 5 requests in 60 seconds:
```bash
for i in {1..10}; do node test_post.js; done
```

Response on 6th request:
```json
{
  "error": "Too many requests — please try again later."
}
```

### Verify Message Storage

Check messages stored locally:
```bash
cat messages.json
```

Or in PowerShell:
```powershell
Get-Content messages.json -Raw | ConvertFrom-Json
```

### Exploring Code Examples

1. Navigate to the **Skills** section
2. Click the **"Curious?"** button under any skill
3. View professional code examples with:
   - **Full source code** (left side)
   - **Live demo output** (top)
4. Click **"Run Code"** to re-render the demo
5. Click **"Copy Code"** to copy to clipboard

### Available Code Examples (12 Total)

| Skill | Example | Demo |
|-------|---------|------|
| **HTML & CSS** | Interactive Card | Hover animation |
| **JavaScript** | Counter Component | Working button |
| **React** | State Management | Component demo |
| **Responsive** | Mobile-First Grid | 3-column layout |
| **Node.js** | Express API | Endpoint docs |
| **Python** | Data Processing | Calculation results |
| **Database** | SQL Queries | Result table |
| **REST APIs** | Fetch & Error Handling | JSON response |
| **Git** | Branching Workflow | Status display |
| **Agile** | Sprint Management | Velocity chart |
| **Docker** | Container Setup | Container stats |
| **Testing** | Jest Unit Tests | Test results |

### Rotating Quotes

The portfolio features 12 rotating quotes and developer jokes that refresh every 6 hours. Examples:
- *"Innovation distinguishes between a leader and a follower."* — Steve Jobs
- *"Why do programmers prefer dark mode? Because light attracts bugs!"* — Dev Joke
- *"It works on my machine."* — Every Developer
- *"Talk is cheap. Show me the code."* — Linus Torvalds

## Security Notes

🔐 **Security Best Practices Implemented:**

- ✅ Input sanitization (remove HTML/script tags)
- ✅ Email validation (regex pattern matching)
- ✅ Rate limiting by IP address
- ✅ Length limits (name: 100 chars, subject: 200, message: 2000)
- ✅ CORS enabled with proper headers
- ✅ `.env` in `.gitignore` (secrets never committed)
- ✅ `messages.json` in `.gitignore` (PII protected)
- ✅ Error messages don't leak sensitive info
- ✅ HTTPS ready (configure in production)
- ✅ Helmet.js compatible setup

**Production Recommendations:**
- Use environment variables for all secrets
- Enable HTTPS/TLS
- Configure firewalls and DDoS protection
- Implement database instead of JSON file
- Use `express-rate-limit` with Redis
- Add reCAPTCHA for spam prevention
- Monitor and log all API activity

## Future Enhancements

### Planned Features
- [ ] Replace in-memory rate limiter with `express-rate-limit` + Redis
- [ ] Add reCAPTCHA v3 for spam prevention
- [ ] Create admin dashboard to view/manage messages
- [ ] Add image upload support for projects
- [ ] Implement automated email replies
- [ ] Add dark/light theme toggle
- [ ] Blog section with Markdown support
- [ ] Portfolio filtering/search functionality
- [ ] Analytics integration (Google Analytics)
- [ ] Newsletter subscription form
- [ ] Testimonials/reviews carousel
- [ ] Pricing section (if offering services)

### Technology Roadmap
- PostgreSQL database migration
- Redis for caching & rate limiting
- WebSocket for real-time notifications
- GraphQL API option
- Mobile app (React Native)
- PWA capabilities
- CI/CD pipeline (GitHub Actions)
- Docker containerization
- Kubernetes deployment

## License

MIT License — Copyright (c) 2026 Donbill Mwshahary

Feel free to use this portfolio as a template for your own!

## Connect With Me

- **LinkedIn**: [Donbill Mwshahary](https://www.linkedin.com/in/donbill-mwshahary-7731293a1/)
- **GitHub**: [@Donbili69](https://github.com/Donbili69)
- **Twitter/X**: [@Donbill_M](https://x.com/Donbill_M)

---

**Made with ❤️ and lots of ☕ by Donbill Mwshahary**
