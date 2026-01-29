// ===== Mobile Menu Toggle =====
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
}

// ===== Smooth Scrolling =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ===== Navbar Background on Scroll =====
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(15, 15, 35, 0.98)';
        navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = 'rgba(15, 15, 35, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// ===== Intersection Observer for Animations =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            
            // Animate skill bars
            if (entry.target.classList.contains('skill-progress')) {
                const width = entry.target.style.width;
                entry.target.style.animation = `fillProgress 1.5s ease-out forwards`;
            }
        }
    });
}, observerOptions);

// Observe all elements with animation classes
document.querySelectorAll('.project-card, .skill-category-card, .stat-item, .contact-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ===== Contact Form Submission (real backend) =====
const contactForm = document.querySelector('#contact-form');
const modal = document.getElementById('modal');
const modalClose = document.getElementById('modal-close');
const modalTitle = document.getElementById('modal-title');
const modalMessage = document.getElementById('modal-message');

function showModal(title, message) {
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modal.style.display = 'flex';
}

function closeModal() {
    if (!modal) return;
    modal.style.display = 'none';
}

if (modalClose) modalClose.addEventListener('click', closeModal);
if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
}

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const payload = {
        name: formData.get('name')?.trim(),
        email: formData.get('email')?.trim(),
        subject: formData.get('subject')?.trim(),
        message: formData.get('message')?.trim()
    };

    if (!payload.name || !payload.email || !payload.subject || !payload.message) {
        showModal('Validation Error', 'Please fill in all fields before sending.');
        return;
    }

    const submitBtn = contactForm.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    try {
        const resp = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        let result = {};
        try { result = await resp.json(); } catch (e) { result = {}; }
        if (resp.ok) {
            showModal('Message Sent', 'Thank you — your message has been received. I will reply shortly.');
            contactForm.reset();
        } else {
            showModal('Error', result.error || 'Failed to send message. Please try again later.');
        }
    } catch (err) {
        console.error('Submit error', err);
        showModal('Network Error', 'Unable to send message. Check your connection or try again later.');
    } finally {
            if (submitBtn) {
                submitBtn.textContent = originalText || 'Send Message';
                submitBtn.disabled = false;
            }
        }
    });
} else {
    console.warn('Contact form not found on page.');
}

// ===== CTA Button Scroll to Contact =====
const ctaBtn = document.querySelector('.cta-button');
if (ctaBtn) {
    ctaBtn.addEventListener('click', () => {
        const contactSection = document.querySelector('#contact');
        if (contactSection) contactSection.scrollIntoView({ behavior: 'smooth' });
    });
}

// ===== 3D Tilt Effect on Project Cards =====
const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.querySelector('.card-inner').style.transform = `
            perspective(1000px) 
            rotateX(${rotateX}deg) 
            rotateY(${rotateY}deg)
        `;
    });
    
    card.addEventListener('mouseleave', () => {
        card.querySelector('.card-inner').style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
});

// ===== Parallax Effect =====
window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    
    // Move floating balls with parallax
    const balls = document.querySelectorAll('.float-ball');
    balls.forEach((ball, index) => {
        ball.style.transform = `translateY(${scrollPosition * (0.5 + index * 0.1)}px)`;
    });
});

// Combined scroll safety for progress bar calculation
window.addEventListener('scroll', () => {
    const progressBar = document.querySelector('div[style*="position: fixed"][style*="height: 3px"]');
    if (!progressBar) return;
    const scrollTop = window.scrollY;
    const docHeight = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.width = Math.min(100, Math.max(0, scrollPercent)) + '%';
});

// ===== Number Counter Animation =====
const statsItems = document.querySelectorAll('.stat-item');
let hasAnimated = false;

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
            hasAnimated = true;
            animateCounters();
        }
    });
}, { threshold: 0.5 });

function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent);
        let count = 0;
        const increment = target / 50;
        
        const updateCount = () => {
            count += increment;
            if (count < target) {
                counter.textContent = Math.floor(count) + '+';
                setTimeout(updateCount, 30);
            } else {
                counter.textContent = target + '+';
            }
        };
        
        updateCount();
    });
}

// Observe stats section
const statsSection = document.querySelector('.stats');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// ===== Portfolio Showcase Interaction =====
const showcaseItems = document.querySelectorAll('.showcase-item');

showcaseItems.forEach((item, index) => {
    item.addEventListener('mouseenter', () => {
        const image = item.querySelector('.showcase-image');
        image.style.transform = 'scale(1.05)';
    });

    item.addEventListener('mouseleave', () => {
        const image = item.querySelector('.showcase-image');
        image.style.transform = 'scale(1)';
    });
});

// ===== Skills Filter Functionality =====
const filterBtns = document.querySelectorAll('.filter-btn');
const skillCards = document.querySelectorAll('.skill-category-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');
        
        const filterValue = btn.getAttribute('data-filter');
        
        // Filter skill cards
        skillCards.forEach(card => {
            if (filterValue === 'all') {
                card.style.display = 'block';
                card.style.animation = 'slideInUp 0.6s ease';
            } else {
                if (card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                    card.style.animation = 'slideInUp 0.6s ease';
                } else {
                    card.style.display = 'none';
                }
            }
        });
    });
});

// ===== Tech Stack Badge Hover =====
const techBadges = document.querySelectorAll('.tech-badge');

techBadges.forEach(badge => {
    badge.addEventListener('mouseenter', () => {
        badge.style.transform = 'scale(1.1) rotateY(10deg)';
    });
    
    badge.addEventListener('mouseleave', () => {
        badge.style.transform = 'scale(1) rotateY(0deg)';
    });
});

// ===== Page Load Animation =====
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
    
    // Animate section titles
    document.querySelectorAll('.section-title').forEach((title, index) => {
        title.style.animation = `slideInDown 0.8s ease ${index * 0.1}s both`;
    });
    // Initialize code snippets modal handlers
    try { initCodeSnippets(); } catch (e) { console.warn('initCodeSnippets failed', e); }
});

// ===== TypeScript demo runtime (compiled JS equivalent) =====
document.addEventListener('DOMContentLoaded', () => {
    const runBtn = document.getElementById('ts-run-btn');
    const inputA = document.getElementById('ts-a');
    const inputB = document.getElementById('ts-b');
    const result = document.getElementById('ts-result');

    if (runBtn && inputA && inputB && result) {
        runBtn.addEventListener('click', () => {
            // compiled JS equivalent of: function add(a: number, b: number): number { return a + b; }
            const a = Number((inputA).value) || 0;
            const b = Number((inputB).value) || 0;
            const sum = a + b;
            result.textContent = `Result: ${sum}`;
        });
    }
});

// ===== Mouse Trail Effect (Optional - Premium Feel) =====
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// ===== Keyboard Navigation Support =====
document.addEventListener('keydown', (e) => {
    const sections = ['#home', '#about', '#projects', '#skills', '#contact'];
    let currentIndex = sections.findIndex(s => {
        const element = document.querySelector(s);
        return element && element.offsetTop <= window.scrollY + 100;
    });
    
    if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (currentIndex < sections.length - 1) {
            document.querySelector(sections[currentIndex + 1]).scrollIntoView({ behavior: 'smooth' });
        }
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (currentIndex > 0) {
            document.querySelector(sections[currentIndex - 1]).scrollIntoView({ behavior: 'smooth' });
        }
    }
});

// ===== Scroll Progress Bar =====
const createProgressBar = () => {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 60px;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, #00d4ff, #667eea);
        width: 0;
        z-index: 999;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
};

createProgressBar();

// ===== Dynamic Cursor Effect =====
const cursor = document.createElement('div');
cursor.style.cssText = `
    position: fixed;
    width: 20px;
    height: 20px;
    border: 2px solid #00d4ff;
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    opacity: 0.5;
    display: none;
`;
document.body.appendChild(cursor);

document.addEventListener('mousemove', (e) => {
    if (window.innerWidth > 768) {
        cursor.style.display = 'block';
        cursor.style.left = (e.clientX - 10) + 'px';
        cursor.style.top = (e.clientY - 10) + 'px';
    }
});
// Hide cursor when leaving window
window.addEventListener('mouseout', (e) => {
    if (!e.relatedTarget && !e.toElement) cursor.style.display = 'none';
});

// ===== Links and Buttons Hover Effect =====
document.querySelectorAll('a, button').forEach(element => {
    element.addEventListener('mouseenter', () => {
        cursor.style.borderColor = '#00d4ff';
        cursor.style.opacity = '1';
    });
    
    element.addEventListener('mouseleave', () => {
        cursor.style.borderColor = '#00d4ff';
        cursor.style.opacity = '0.5';
    });
});

// ===== Rotating Quotes & Jokes =====
const QUOTES_LIBRARY = [
    { text: '"Innovation distinguishes between a leader and a follower."', author: '— Steve Jobs' },
    { text: '"Code is poetry written for computers."', author: '— Unknown' },
    { text: '"The only way to do great work is to love what you do."', author: '— Steve Jobs' },
    { text: '"Why do programmers prefer dark mode? Because light attracts bugs!"', author: '— Dev Joke' },
    { text: '"I\'m not lazy, I\'m on standby mode."', author: '— Programmer\'s Life' },
    { text: '"Why did the developer go broke? Because he lost his cache!"', author: '— Dev Joke' },
    { text: '"It works on my machine."', author: '— Every Developer' },
    { text: '"Debugging: Like being a detective in a crime drama, except you are also the criminal."', author: '— Unknown' },
    { text: '"Talk is cheap. Show me the code."', author: '— Linus Torvalds' },
    { text: '"First, solve the problem. Then, write the code."', author: '— John Johnson' },
    { text: '"You\'re not done when it works, you\'re done when it\'s elegant."', author: '— Unknown' },
    { text: '"Any fool can write code that a computer can understand. Good programmers write code that humans can understand."', author: '— Martin Fowler' }
];

function initRotatingQuotes() {
    const quoteText = document.getElementById('rotating-quote');
    const quoteAuthor = document.getElementById('quote-author');
    if (!quoteText || !quoteAuthor) return;

    const rotateQuote = () => {
        const now = new Date();
        const hours = now.getHours();
        const index = Math.floor(hours / 6) % QUOTES_LIBRARY.length;
        const quote = QUOTES_LIBRARY[index];
        quoteText.textContent = quote.text;
        quoteAuthor.textContent = quote.author;
        quoteText.style.animation = 'fadeIn 0.8s ease';
    };

    rotateQuote();
    setInterval(rotateQuote, 6 * 60 * 60 * 1000); // 6 hours
}

// ===== Code Snippets =====
const CODE_SNIPPETS = {
    htmlcss: {
        code: `<!-- Interactive Card Component -->
<div class="card">
  <h3>✨ Beautiful Card</h3>
  <p>Hover over this to see the effect!</p>
</div>

<style>
  .card {
    padding: 2rem;
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    border-radius: 12px;
    text-align: center;
    transition: all 0.3s ease;
    cursor: pointer;
  }
  
  .card:hover {
    transform: translateY(-8px) scale(1.05);
    box-shadow: 0 20px 40px rgba(102, 126, 234, 0.5);
  }
  
  .card h3 { margin: 0 0 1rem; font-size: 1.5rem; }
  .card p { margin: 0; font-size: 0.95rem; }
</style>`,
        output: `<div style="padding: 2rem; background: linear-gradient(135deg, #667eea, #764ba2); color: white; border-radius: 12px; text-align: center; transition: all 0.3s ease; cursor: pointer;" onmouseover="this.style.transform='translateY(-8px) scale(1.05)'; this.style.boxShadow='0 20px 40px rgba(102, 126, 234, 0.5)'" onmouseout="this.style.transform='translateY(0) scale(1)'; this.style.boxShadow='none'">
  <h3 style="margin: 0 0 1rem; font-size: 1.5rem;">✨ Beautiful Card</h3>
  <p style="margin: 0; font-size: 0.95rem;">Hover over this to see the effect!</p>
</div>`,
        resource: { 
            url: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
            description: "Learn semantic HTML structure, accessibility, and modern CSS techniques from Mozilla's comprehensive guides."
        }
    },

    javascript: {
        code: `// Interactive Button Counter
const counter = { count: 0 };

function incrementCounter() {
  counter.count++;
  console.log('Count:', counter.count);
  updateDisplay();
}

function updateDisplay() {
  const display = document.getElementById('count-display');
  if (display) {
    display.textContent = counter.count;
    display.style.color = 
      counter.count > 5 ? '#00d4ff' : '#667eea';
  }
}

// Usage: Call incrementCounter() on button click`,
        output: `<div style="text-align: center; padding: 1.5rem;">
  <p style="margin: 0 0 1rem;">Click Counter:</p>
  <div id="count-display" style="font-size: 2.5rem; font-weight: bold; color: #667eea; margin: 1rem 0;">0</div>
  <button onclick="incrementCounter()" style="padding: 0.8rem 1.5rem; background: #00d4ff; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; color: #0f0f23;">Click Me!</button>
</div>
<script>
const counter = { count: 0 };
function incrementCounter() {
  counter.count++;
  const display = document.getElementById('count-display');
  if (display) {
    display.textContent = counter.count;
    display.style.color = counter.count > 5 ? '#00d4ff' : '#667eea';
  }
}
</script>`,
        resource: { 
            url: 'https://javascript.info',
            description: "Master JavaScript fundamentals with interactive tutorials, from basic syntax to advanced async/await patterns."
        }
    },

    react: {
        code: `// React: Interactive Counter Component
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div style={{ textAlign: 'center' }}>
      <h3>Count: {count}</h3>
      <button 
        onClick={() => setCount(count + 1)}
        style={{
          padding: '10px 20px',
          background: '#667eea',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Increment
      </button>
    </div>
  );
}

export default Counter;`,
        output: `<div style="text-align: center; padding: 1.5rem;">
  <h3 style="margin: 0 0 1rem; color: #667eea;">React Counter</h3>
  <p style="font-size: 1.2rem; color: #00d4ff; margin: 1rem 0;">Click the button to increment</p>
  <button style="padding: 0.8rem 1.5rem; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">⚛️ Works with state management</button>
</div>`,
        resource: { 
            url: 'https://react.dev',
            description: "Learn React from the official documentation. Build interactive UIs with hooks, state management, and component best practices."
        }
    },

    responsive: {
        code: `<!-- Mobile-First Responsive Grid -->
<div class="grid-container">
  <div class="grid-item">Item 1</div>
  <div class="grid-item">Item 2</div>
  <div class="grid-item">Item 3</div>
</div>

<style>
  .grid-container {
    display: grid;
    gap: 1rem;
  }
  
  /* Mobile: 1 column */
  .grid-item {
    padding: 2rem;
    background: #667eea;
    border-radius: 8px;
    text-align: center;
    color: white;
  }
  
  /* Tablet: 2 columns */
  @media (min-width: 768px) {
    .grid-container { grid-template-columns: repeat(2, 1fr); }
  }
  
  /* Desktop: 3 columns */
  @media (min-width: 1200px) {
    .grid-container { grid-template-columns: repeat(3, 1fr); }
  }
</style>`,
        output: `<div style="display: grid; gap: 1rem; grid-template-columns: repeat(3, 1fr);">
  <div style="padding: 2rem; background: #667eea; border-radius: 8px; text-align: center; color: white; font-weight: bold;">Item 1</div>
  <div style="padding: 2rem; background: #764ba2; border-radius: 8px; text-align: center; color: white; font-weight: bold;">Item 2</div>
  <div style="padding: 2rem; background: #f093fb; border-radius: 8px; text-align: center; color: white; font-weight: bold;">Item 3</div>
</div>`,
        resource: { 
            url: 'https://web.dev/responsive-web-design-basics/',
            description: "Master responsive design techniques. Learn mobile-first approach, flexbox, CSS grid, and media queries for all devices."
        }
    },

    nodejs: {
        code: `// Node.js: Express REST API
const express = require('express');
const app = express();

app.use(express.json());

// GET endpoint
app.get('/api/skills', (req, res) => {
  res.json({
    frontend: ['HTML', 'CSS', 'JavaScript', 'React'],
    backend: ['Node.js', 'Python', 'Express'],
    tools: ['Git', 'Docker', 'VS Code']
  });
});

// POST endpoint
app.post('/api/feedback', (req, res) => {
  const { message } = req.body;
  console.log('Feedback:', message);
  res.json({ success: true });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});`,
        output: `<div style="padding: 1.5rem; background: rgba(0,0,0,0.5); border-radius: 8px;">
  <h4 style="color: #00d4ff; margin-top: 0;">API Endpoints Available:</h4>
  <ul style="margin: 0; padding-left: 1.5rem; text-align: left;">
    <li>GET /api/skills - Returns all skills</li>
    <li>POST /api/feedback - Submit feedback</li>
    <li>Server running on port 3000 ✓</li>
  </ul>
  <p style="margin-top: 1rem; color: #667eea;">This is a production-ready Express setup!</p>
</div>`,
        resource: { 
            url: 'https://nodejs.org/docs/',
            description: "Learn Node.js server-side development. Build REST APIs, handle async operations, and create scalable backend applications."
        }
    },

    python: {
        code: `# Python: Portfolio Data Processing
def get_portfolio_stats(projects):
    """Calculate portfolio statistics"""
    total = len(projects)
    completed = len([p for p in projects if p['status'] == 'complete'])
    
    return {
        'total_projects': total,
        'completed': completed,
        'completion_rate': f"{(completed/total)*100:.1f}%"
    }

# Sample data
my_projects = [
    {'name': 'E-Commerce', 'status': 'complete'},
    {'name': 'Blog Platform', 'status': 'complete'},
    {'name': 'Analytics Dashboard', 'status': 'in-progress'}
]

stats = get_portfolio_stats(my_projects)
print(f"Portfolio Stats: {stats}")`,
        output: `<div style="padding: 1.5rem; background: rgba(0,0,0,0.5); border-radius: 8px;">
  <h4 style="color: #00d4ff; margin-top: 0;">📊 Portfolio Statistics:</h4>
  <ul style="margin: 0; padding-left: 1.5rem; color: #e0e0e0;">
    <li>Total Projects: 3</li>
    <li>Completed: 2</li>
    <li>Completion Rate: 66.7%</li>
    <li>Status: Active Development ✓</li>
  </ul>
</div>`,
        resource: { 
            url: 'https://python.org/about/gettingstarted/',
            description: "Learn Python programming from basics to advanced. Explore data structures, functions, and build real-world projects."
        }
    },

    database: {
        code: `-- SQL: Portfolio Database
CREATE TABLE projects (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  technologies JSON,
  completion_date DATE,
  github_url VARCHAR(255)
);

-- Insert sample data
INSERT INTO projects VALUES 
(1, 'E-Commerce Platform', 'Full-featured store', 
'["React", "Node.js", "PostgreSQL"]', '2025-06-15', 'github.com/user/shop');

-- Query examples
SELECT * FROM projects WHERE completion_date >= '2024-01-01';
SELECT title, technologies FROM projects ORDER BY completion_date DESC;`,
        output: `<div style="padding: 1.5rem; background: rgba(0,0,0,0.5); border-radius: 8px;">
  <h4 style="color: #00d4ff; margin-top: 0;">📋 Database Query Result:</h4>
  <table style="width: 100%; color: #e0e0e0; font-size: 0.9rem;">
    <tr style="border-bottom: 1px solid #667eea;">
      <td style="padding: 0.5rem;"><strong>E-Commerce Platform</strong></td>
      <td>React, Node.js, PostgreSQL</td>
    </tr>
    <tr>
      <td style="padding: 0.5rem;"><strong>Blog Platform</strong></td>
      <td>Vue.js, Express, MongoDB</td>
    </tr>
  </table>
</div>`,
        resource: { 
            url: 'https://www.w3schools.com/sql/',
            description: "Master database design and SQL queries. Learn database management, optimization, and best practices for data storage."
        }
    },

    api: {
        code: `// REST API: Fetch Data with Error Handling
async function fetchPortfolioData() {
  try {
    const response = await fetch('/api/portfolio');
    
    if (!response.ok) {
      throw new Error(\`HTTP \${response.status}\`);
    }
    
    const data = await response.json();
    console.log('Portfolio Data:', data);
    return data;
    
  } catch (error) {
    console.error('Fetch Error:', error);
    return null;
  }
}

// Usage
fetchPortfolioData().then(data => {
  if (data) console.log('Success!', data);
});`,
        output: `<div style="padding: 1.5rem; background: rgba(0,0,0,0.5); border-radius: 8px;">
  <h4 style="color: #00d4ff; margin-top: 0;">🌐 API Response:</h4>
  <pre style="margin: 0; color: #00d4ff; font-size: 0.85rem; overflow-x: auto;">
{
  "status": "success",
  "data": {
    "projects": 6,
    "skills": 12,
    "experience": "5+ years"
  }
}</pre>
</div>`,
        resource: { 
            url: 'https://restfulapi.net/',
            description: "Understand REST API design principles. Learn proper HTTP methods, status codes, and create well-designed APIs."
        }
    },

    git: {
        code: `# Git: Professional Workflow
# Initialize repository
git init
git add .
git commit -m "Initial commit"

# Create feature branch
git checkout -b feature/new-feature
git add .
git commit -m "Add new feature"

# Merge to main
git checkout main
git pull origin main
git merge feature/new-feature
git push origin main

# View history
git log --oneline
git status`,
        output: `<div style="padding: 1.5rem; background: rgba(0,0,0,0.5); border-radius: 8px;">
  <h4 style="color: #00d4ff; margin-top: 0;">📜 Git Workflow:</h4>
  <ul style="margin: 0; padding-left: 1.5rem; color: #e0e0e0; font-family: monospace; font-size: 0.9rem;">
    <li>main (HEAD) -> Latest code deployed ✓</li>
    <li>feature/new-feature -> In development</li>
    <li>Last commit: "Add new feature" 2 hours ago</li>
    <li>Status: Ready for merge</li>
  </ul>
</div>`,
        resource: { 
            url: 'https://git-scm.com/doc',
            description: "Learn Git version control thoroughly. Master branching, merging, collaboration workflows, and best practices for teams."
        }
    },

    agile: {
        code: `# Agile Sprint Workflow

## Sprint Planning (Day 1)
- Define sprint goal: "Improve UI/UX"
- Estimate user stories (story points)
- Team commitment: 40 points

## Daily Standup
- What did I complete?
- What am I working on?
- Any blockers?

## Code Review
- 2 reviewers minimum
- All tests passing
- Ready to merge

## Sprint Review & Retro
- Demo features to stakeholders
- Celebrate wins
- Plan improvements`,
        output: `<div style="padding: 1.5rem; background: rgba(0,0,0,0.5); border-radius: 8px;">
  <h4 style="color: #00d4ff; margin-top: 0;">🏃 Current Sprint (Sprint 12):</h4>
  <ul style="margin: 0; padding-left: 1.5rem; color: #e0e0e0;">
    <li>Duration: 2 weeks (Jan 27 - Feb 10)</li>
    <li>Goal: Performance Optimization</li>
    <li>Velocity: 35/40 points completed</li>
    <li>Team: 4 developers, 1 designer</li>
  </ul>
</div>`,
        resource: { 
            url: 'https://agilemanifesto.org/',
            description: "Understand Agile methodology and iterative development. Learn sprint planning, standups, and team collaboration practices."
        }
    },

    docker: {
        code: `# Docker: Complete Setup
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8080
CMD ["node", "server.js"]

# Build image
docker build -t my-portfolio .

# Run container
docker run -p 8080:8080 my-portfolio

# Useful commands
docker ps              # List running containers
docker logs <id>      # View container logs
docker stop <id>      # Stop container`,
        output: `<div style="padding: 1.5rem; background: rgba(0,0,0,0.5); border-radius: 8px;">
  <h4 style="color: #00d4ff; margin-top: 0;">🐳 Docker Container Status:</h4>
  <ul style="margin: 0; padding-left: 1.5rem; color: #e0e0e0; font-family: monospace;">
    <li>Container: my-portfolio:latest</li>
    <li>Status: Running ✓</li>
    <li>Port: 8080 -> 8080</li>
    <li>Memory: 256MB | CPU: 0.5</li>
  </ul>
</div>`,
        resource: { 
            url: 'https://docs.docker.com/',
            description: "Learn containerization with Docker. Build, deploy, and manage containers for consistent development and production environments."
        }
    },

    testing: {
        code: `// Jest Testing Examples
describe('Portfolio Functions', () => {
  
  test('calculate project completion rate', () => {
    const rate = (2 / 3) * 100;
    expect(rate).toBeCloseTo(66.67);
  });

  test('validate email format', () => {
    const isEmail = (str) => /^[^@]+@[^@]+\\.[^@]+$/.test(str);
    expect(isEmail('hello@example.com')).toBe(true);
    expect(isEmail('invalid')).toBe(false);
  });

  test('async API call', async () => {
    const data = await fetch('/api/skills').then(r => r.json());
    expect(data).toHaveProperty('frontend');
  });
});`,
        output: `<div style="padding: 1.5rem; background: rgba(0,0,0,0.5); border-radius: 8px;">
  <h4 style="color: #00d4ff; margin-top: 0;">✅ Test Results:</h4>
  <ul style="margin: 0; padding-left: 1.5rem; color: #e0e0e0;">
    <li>✓ calculate project completion rate (2ms)</li>
    <li>✓ validate email format (1ms)</li>
    <li>✓ async API call (45ms)</li>
    <li style="color: #00d4ff; margin-top: 1rem;"><strong>3 passed, 0 failed</strong></li>
  </ul>
</div>`,
        resource: { 
            url: 'https://jestjs.io/docs/getting-started',
            description: "Master automated testing with Jest. Learn unit testing, integration testing, and mocking for reliable code quality."
        }
    }
};

function initCodeSnippets() {
    const codeModal = document.getElementById('code-modal');
    const codeTitle = document.getElementById('code-title');
    const codeOutput = document.getElementById('code-output');
    const codeSnippetPre = document.getElementById('code-snippet');
    const codeSnippetBlock = codeSnippetPre.querySelector('code');
    const toggleFullBtn = document.getElementById('toggle-full-btn');
    const codeCopyBtn = document.getElementById('copy-code-btn');
    const codeRunBtn = document.getElementById('run-code-btn');
    const codeModalClose = document.getElementById('code-modal-close');
    const learnMoreBtn = document.getElementById('learn-more-btn');

    if (!codeModal) return;

    // Close Modal
    const closeCodeModal = () => codeModal.style.display = 'none';
    if (codeModalClose) codeModalClose.addEventListener('click', closeCodeModal);
    
    codeModal.addEventListener('click', (e) => {
        if (e.target === codeModal) closeCodeModal();
    });

    // Copy Code
    if (codeCopyBtn) {
        codeCopyBtn.addEventListener('click', () => {
            const code = codeSnippetBlock.textContent;
            navigator.clipboard.writeText(code).then(() => {
                const original = codeCopyBtn.textContent;
                codeCopyBtn.textContent = '✓ Copied!';
                setTimeout(() => codeCopyBtn.textContent = original, 2000);
            });
        });
    }

    // Run Code
    if (codeRunBtn) {
        codeRunBtn.addEventListener('click', () => {
            const skill = codeRunBtn.getAttribute('data-skill');
            const snippet = CODE_SNIPPETS[skill];
            if (snippet && snippet.output) {
                codeOutput.innerHTML = snippet.output;
                codeOutput.style.display = 'block';
                const original = codeRunBtn.textContent;
                codeRunBtn.textContent = '▶ Output Rendered!';
                setTimeout(() => codeRunBtn.textContent = original, 2000);
            }
        });
    }

    // Show Code Snippet
    document.querySelectorAll('.code-curiosity-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const skill = btn.getAttribute('data-skill');
            const snippet = CODE_SNIPPETS[skill];
            if (snippet) {
                const skillNames = {
                    htmlcss: 'HTML & CSS',
                    javascript: 'JavaScript',
                    react: 'React',
                    responsive: 'Responsive Design',
                    nodejs: 'Node.js',
                    python: 'Python',
                    database: 'Databases',
                    api: 'REST APIs',
                    git: 'Git',
                    agile: 'Agile',
                    docker: 'Docker',
                    testing: 'Testing'
                };
                codeTitle.textContent = `${skillNames[skill]} Code Example`;
                codeSnippetBlock.textContent = snippet.code;
                codeOutput.innerHTML = snippet.output || '';
                codeOutput.style.display = snippet.output ? 'block' : 'none';
                
                // Store skill for run button
                codeRunBtn.setAttribute('data-skill', skill);
                
                // Set Learn More link
                if (learnMoreBtn && snippet.resource) {
                    learnMoreBtn.href = snippet.resource.url;
                    learnMoreBtn.title = snippet.resource.description;
                    learnMoreBtn.style.display = 'inline-block';
                } else if (learnMoreBtn) {
                    learnMoreBtn.style.display = 'none';
                }
                // Set snippet collapsed by default
                if (codeSnippetPre) {
                    codeSnippetPre.classList.remove('expanded');
                }
                if (toggleFullBtn) {
                    toggleFullBtn.textContent = 'Show More';
                    toggleFullBtn.style.display = 'inline-block';
                }
                
                codeModal.style.display = 'flex';
            }
        });
    });

    // Toggle full snippet view
    if (toggleFullBtn && codeSnippetPre) {
        toggleFullBtn.addEventListener('click', () => {
            if (codeSnippetPre.classList.contains('expanded')) {
                codeSnippetPre.classList.remove('expanded');
                toggleFullBtn.textContent = 'Show More';
            } else {
                codeSnippetPre.classList.add('expanded');
                toggleFullBtn.textContent = 'Show Less';
            }
        });
    }
}