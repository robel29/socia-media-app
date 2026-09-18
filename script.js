/* =============================================
   ROBEL DESALEGN — Personal Website Scripts
   ============================================= */

'use strict';

/* =============================================
   1. NAVBAR — scroll shrink + active link
   ============================================= */
const navbar   = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

function onScroll() {
  // shrink navbar on scroll
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // highlight active nav link based on scroll position
  let current = '';
  sections.forEach(section => {
    const sectionTop    = section.offsetTop - 100;
    const sectionHeight = section.offsetHeight;
    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll(); // run once on load

/* =============================================
   2. HAMBURGER MENU
   ============================================= */
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  navMenu.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
});

// Close menu when a link is clicked
navMenu.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

// Close menu on outside click
document.addEventListener('click', e => {
  if (!navbar.contains(e.target)) {
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }
});

/* =============================================
   3. TYPEWRITER EFFECT
   ============================================= */
const typewriterEl = document.getElementById('typewriter');
const roles = [
  'Software Developer',
  'Full-Stack Engineer',
  'UI / UX Enthusiast',
  'Problem Solver',
  'Open Source Contributor',
];

let roleIndex   = 0;
let charIndex   = 0;
let isDeleting  = false;
let typeTimeout = null;

function type() {
  const currentRole = roles[roleIndex];

  if (!isDeleting) {
    // Typing forward
    typewriterEl.textContent = currentRole.substring(0, charIndex + 1);
    charIndex++;

    if (charIndex === currentRole.length) {
      // Pause at end before deleting
      isDeleting = true;
      typeTimeout = setTimeout(type, 1800);
      return;
    }
  } else {
    // Deleting
    typewriterEl.textContent = currentRole.substring(0, charIndex - 1);
    charIndex--;

    if (charIndex === 0) {
      isDeleting = false;
      roleIndex  = (roleIndex + 1) % roles.length;
      typeTimeout = setTimeout(type, 400);
      return;
    }
  }

  const speed = isDeleting ? 60 : 90;
  typeTimeout = setTimeout(type, speed);
}

// Start typewriter after hero animation completes
setTimeout(type, 1400);

/* =============================================
   4. SKILLS — tab switching + animated bars
   ============================================= */
const tabBtns    = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;

    tabBtns.forEach(b => b.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('active'));

    btn.classList.add('active');
    const targetContent = document.getElementById(`tab-${target}`);
    if (targetContent) {
      targetContent.classList.add('active');
      // Animate skill bars if switching to tech tab
      if (target === 'tech') {
        animateSkillBars();
      }
    }
  });
});

function animateSkillBars() {
  const fills = document.querySelectorAll('#tab-tech .skill-fill');
  fills.forEach(fill => {
    const width = fill.dataset.width;
    // Reset first, then animate
    fill.style.width = '0';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        fill.style.width = `${width}%`;
      });
    });
  });
}

/* =============================================
   5. INTERSECTION OBSERVER — reveal on scroll
   ============================================= */
const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -40px 0px',
};

// Skill cards
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const delay = parseInt(entry.target.dataset.delay || 0);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      skillObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.skill-card').forEach(card => skillObserver.observe(card));

// Skill bar trigger when skills section enters view
const skillsSection = document.getElementById('skills');
if (skillsSection) {
  const barObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      animateSkillBars();
      barObserver.disconnect();
    }
  }, { threshold: 0.2 });
  barObserver.observe(skillsSection);
}

/* =============================================
   6. PROJECTS FILTER
   ============================================= */
const filterBtns    = document.querySelectorAll('.filter-btn');
const projectCards  = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    projectCards.forEach(card => {
      const category = card.dataset.category;
      if (filter === 'all' || category === filter) {
        card.classList.remove('hidden-card');
        // Small stagger animation
        card.style.animation = 'none';
        card.offsetHeight; // reflow
        card.style.animation = '';
      } else {
        card.classList.add('hidden-card');
      }
    });
  });
});

/* =============================================
   7. CONTACT FORM VALIDATION + SUBMISSION
   ============================================= */
const contactForm = document.getElementById('contact-form');
const submitBtn   = document.getElementById('submit-btn');
const btnText     = document.getElementById('btn-text');
const btnLoader   = document.getElementById('btn-loader');
const formSuccess = document.getElementById('form-success');

function getField(id) {
  return document.getElementById(id);
}

function showError(fieldId, message) {
  const field    = getField(fieldId);
  const errorEl  = document.getElementById(`${fieldId}-error`);
  if (field)   field.classList.add('error');
  if (errorEl) errorEl.textContent = message;
}

function clearError(fieldId) {
  const field    = getField(fieldId);
  const errorEl  = document.getElementById(`${fieldId}-error`);
  if (field)   field.classList.remove('error');
  if (errorEl) errorEl.textContent = '';
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function validateForm() {
  let valid = true;

  const name    = getField('name').value.trim();
  const email   = getField('email').value.trim();
  const subject = getField('subject').value.trim();
  const message = getField('message').value.trim();

  clearError('name');
  clearError('email');
  clearError('subject');
  clearError('message');

  if (!name || name.length < 2) {
    showError('name', 'Please enter your name (at least 2 characters).');
    valid = false;
  }

  if (!email || !validateEmail(email)) {
    showError('email', 'Please enter a valid email address.');
    valid = false;
  }

  if (!subject || subject.length < 3) {
    showError('subject', 'Please enter a subject.');
    valid = false;
  }

  if (!message || message.length < 10) {
    showError('message', 'Message must be at least 10 characters.');
    valid = false;
  }

  return valid;
}

// Live inline validation on blur
['name', 'email', 'subject', 'message'].forEach(id => {
  const field = getField(id);
  if (!field) return;

  field.addEventListener('blur', () => {
    const value = field.value.trim();

    if (id === 'name') {
      if (!value || value.length < 2) {
        showError('name', 'Please enter your name (at least 2 characters).');
      } else {
        clearError('name');
      }
    }

    if (id === 'email') {
      if (!value || !validateEmail(value)) {
        showError('email', 'Please enter a valid email address.');
      } else {
        clearError('email');
      }
    }

    if (id === 'subject') {
      if (!value || value.length < 3) {
        showError('subject', 'Please enter a subject.');
      } else {
        clearError('subject');
      }
    }

    if (id === 'message') {
      if (!value || value.length < 10) {
        showError('message', 'Message must be at least 10 characters.');
      } else {
        clearError('message');
      }
    }
  });

  // Clear error on input
  field.addEventListener('input', () => clearError(id));
});

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Show loading state
    submitBtn.disabled = true;
    btnText.classList.add('hidden');
    btnLoader.classList.remove('hidden');
    formSuccess.classList.add('hidden');

    // Simulate async send (replace with real fetch/EmailJS/etc.)
    setTimeout(() => {
      submitBtn.disabled = false;
      btnText.classList.remove('hidden');
      btnLoader.classList.add('hidden');
      formSuccess.classList.remove('hidden');
      contactForm.reset();

      // Hide success message after 5 seconds
      setTimeout(() => formSuccess.classList.add('hidden'), 5000);
    }, 1800);
  });
}

/* =============================================
   8. FOOTER — dynamic year
   ============================================= */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* =============================================
   9. SMOOTH SCROLL for all anchor links
   ============================================= */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* =============================================
   10. KEYBOARD ACCESSIBILITY — skip focus trap
       when nav menu is closed
   ============================================= */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.focus();
  }
});

/* =============================================
   STATS COUNTER ANIMATION
   ============================================= */
const statNumbers = document.querySelectorAll('.stat-number');

function animateCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const step     = Math.ceil(duration / target);
  let current    = 0;

  const timer = setInterval(() => {
    current++;
    el.textContent = current;
    if (current >= target) {
      el.textContent = target;
      clearInterval(timer);
    }
  }, step);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      statNumbers.forEach(animateCounter);
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.4 });

const statsStrip = document.querySelector('.stats-strip');
if (statsStrip) statsObserver.observe(statsStrip);
