'use strict';

/* ---------- Data (arrays of objects) ---------- */
const skills = [
  { group: 'Languages', items: ['Python', 'Java', 'C', 'SQL', 'JavaScript', 'TypeScript', 'HTML5', 'CSS3'] },
  { group: 'Machine Learning & AI', items: ['Machine Learning', 'Deep Learning', 'LLMs', 'RAG', 'Conversational AI'] },
  { group: 'Libraries & Frameworks', items: ['React.js', 'Node.js', 'Express.js', 'NumPy', 'Pandas', 'Matplotlib', 'Seaborn', 'Scikit-learn'] },
  { group: 'Backend & API', items: ['REST APIs', 'API Integration', 'Third-Party APIs', 'Axios'] },
  { group: 'Databases', items: ['PostgreSQL', 'MySQL', 'Supabase', 'Drizzle ORM'] },
  { group: 'Services', items: ['Twilio', 'Groq API', 'Binance API', 'Multer'] },
  { group: 'Tools & Platforms', items: ['Git', 'GitHub', 'VS Code', 'Jupyter Notebook', 'Google Colab', 'npm', 'pnpm', 'Vite'] }
];

const experience = [
  { role: 'Software Development Intern', org: 'Purview India Consulting and Services LLP', date: 'Apr 2026 to Jun 2026',
    points: ['Contributed to Doctor Bot GenAgent, an AI-powered healthcare application.', 'Worked on AI agent and application development tasks.', 'Collaborated on project development and technical problem-solving.'] },
  { role: 'AI Intern', org: 'Microsoft-Edunet Foundations', date: 'May 2025 to Jul 2025',
    points: ['Applied AI/ML concepts to structured datasets: preprocessing, feature selection and classification.', 'Built and evaluated ML workflows with Python, Pandas and Scikit-learn.'] },
  { role: 'Machine Learning Intern', org: 'Unified Mentor', date: 'Feb 2025 to Apr 2025',
    points: ['Developed supervised learning models for risk prediction and classification.', 'Cleaned data, engineered features and evaluated models on accuracy, precision and recall.'] }
];

const projects = [
  { title: 'Doctor Bot GenAgent', subtitle: 'AI-powered healthcare assistant', cats: ['ai', 'fullstack'],
    tech: ['React.js', 'Node.js', 'PostgreSQL', 'Drizzle ORM', 'LLM APIs', 'Twilio'],
    points: ['Full-stack platform for conversational patient assistance and appointment management.', 'AI consultations with conversation history, voice consultations and automated consultation notes.', 'Twilio for OTP authentication, reminders, notifications and emergency communication.'] },
  { title: 'EduServe', subtitle: 'Smart student service system', cats: ['fullstack', 'backend'],
    tech: ['React.js', 'TypeScript', 'Node.js', 'Express.js', 'PostgreSQL', 'Multer'],
    points: ['Student document approval system with role-based access and request tracking.', 'Automatic routing of requests to academic or administrative approvers.', 'REST APIs and document-upload workflows.'] },
  { title: 'Binance Futures Trading Bot', subtitle: 'CLI automated trade execution', cats: ['backend'],
    tech: ['Python', 'Binance API', 'CLI', 'Logging'],
    points: ['Places MARKET and LIMIT orders on Binance Futures Testnet.', 'Input validation, structured logging and robust error handling.'] },
  { title: 'Social-to-Lead AI Agent (AutoStream)', subtitle: 'Conversational AI for lead generation', cats: ['ai'],
    tech: ['Python', 'LLM', 'RAG', 'JSON'],
    points: ['Converts conversations into qualified leads using intent detection and multi-turn dialogue.', 'RAG over a structured knowledge base, with lead capture for high-intent users.'] }
];

/* ---------- Helpers ---------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const badges = list => list.map(t => `<span class="badge badge-tech">${t}</span>`).join('');
const bullets = list => `<ul>${list.map(p => `<li>${p}</li>`).join('')}</ul>`;

/* ---------- Render sections from data ---------- */
$('#skillsGrid').innerHTML = skills.map(s => `
  <div class="col-md-6 col-lg-4"><div class="card item-card skill-group"><div class="card-body">
    <h3>${s.group}</h3>${badges(s.items)}</div></div></div>`).join('');

$('#expGrid').innerHTML = experience.map(e => `
  <div class="col-lg-4"><article class="card item-card"><div class="card-body">
    <h3 class="h5">${e.role}</h3><p class="meta mb-2">${e.org}<br>${e.date}</p>${bullets(e.points)}</div></article></div>`).join('');

$('#projectGrid').innerHTML = projects.map(p => `
  <div class="col-md-6 project-item" data-cats="${p.cats.join(' ')}"><article class="card item-card"><div class="card-body">
    <h3 class="h5 mb-0">${p.title}</h3><p class="meta">${p.subtitle}</p>
    <div class="mb-2">${badges(p.tech)}</div>${bullets(p.points)}</div></article></div>`).join('');

/* ---------- Feature 1: Theme switching (remembered) ---------- */
const root = document.documentElement;
const themeBtn = $('#themeToggle');
function applyTheme(theme) {
  root.setAttribute('data-theme', theme);
  const dark = theme === 'dark';
  themeBtn.textContent = dark ? 'Light mode' : 'Dark mode';
  themeBtn.setAttribute('aria-pressed', String(dark));
}
let saved = null;
try { saved = localStorage.getItem('theme'); } catch (e) { /* storage unavailable */ }
applyTheme(saved || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
themeBtn.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  try { localStorage.setItem('theme', next); } catch (e) { /* ignore */ }
});

/* ---------- Feature 2: Project filtering ---------- */
$('#filters').addEventListener('click', e => {
  const btn = e.target.closest('button[data-filter]');
  if (!btn) return;
  const f = btn.dataset.filter;
  $$('#filters button').forEach(b => {
    const on = b === btn;
    b.classList.toggle('btn-accent', on);
    b.classList.toggle('btn-outline-accent', !on);
    b.setAttribute('aria-pressed', String(on));
  });
  let shown = 0;
  $$('.project-item').forEach(card => {
    const match = f === 'all' || card.dataset.cats.split(' ').includes(f);
    card.classList.toggle('is-hidden', !match);
    if (match) shown++;
  });
  $('#filterStatus').textContent = `Showing ${shown} project${shown === 1 ? '' : 's'}`;
});

/* ---------- Feature 3: Rotating headline text ---------- */
const phrases = ['AI-powered applications', 'conversational AI agents', 'RAG systems', 'full-stack web apps'];
let idx = 0;
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  setInterval(() => { idx = (idx + 1) % phrases.length; $('#typed').textContent = phrases[idx]; }, 2500);
}

/* ---------- Contact form validation ---------- */
const form = $('#contactForm');
const alertBox = $('#formAlert');
const rules = {
  name: v => v.trim().length < 2 ? 'Enter your name (at least 2 characters).' : '',
  email: v => !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? 'Enter a valid email, like name@example.com.' : '',
  subject: v => !v ? 'Choose a subject.' : '',
  message: v => v.trim().length < 10 ? 'Write a message of at least 10 characters.' : ''
};

function validateField(field) {
  const error = rules[field.name](field.value);
  const fb = field.parentElement.querySelector('.invalid-feedback');
  field.classList.toggle('is-invalid', !!error);
  field.classList.toggle('is-valid', !error);
  fb.textContent = error;
  field.setAttribute('aria-invalid', String(!!error));
  return !error;
}

$$('#contactForm [name]').forEach(f => {
  f.addEventListener('blur', () => validateField(f));
  f.addEventListener('input', () => { if (f.classList.contains('is-invalid')) validateField(f); });
});
$('#message').addEventListener('input', e => { $('#count').textContent = `${e.target.value.length} / 500`; });

form.addEventListener('submit', e => {
  e.preventDefault();
  const fields = $$('#contactForm [name]');
  const results = fields.map(validateField);
  if (results.every(Boolean)) {
    const name = $('#name').value.trim();
    alertBox.innerHTML = `<div class="alert alert-success alert-dismissible fade show">Thanks, ${name}. Your message is ready to send.
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`;
    form.reset();
    fields.forEach(f => f.classList.remove('is-valid', 'is-invalid'));
    $('#count').textContent = '0 / 500';
  } else {
    alertBox.innerHTML = `<div class="alert alert-danger alert-dismissible fade show">Fix the highlighted fields and try again.
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`;
    fields.find(f => f.classList.contains('is-invalid')).focus();
  }
});

$('#year').textContent = new Date().getFullYear();
