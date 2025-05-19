// script.js
// JavaScript for Alex - Software Developer Portfolio
// Implements all requested interactivity and features

// -------------------
// 1. Project Modal Popup
// -------------------
const projectData = [
  {
    title: 'Multi-Post Stories',
    description: `A daily selection of privately personalized reads; no accounts or sign-ups required. This has been the industry's standard dummy text ever since the 1500s, when an unknown printer.`,
    image: 'image 1.png',
    tags: ['CSS', 'HTML', 'Bootstrap', 'Ruby'],
    github: 'https://github.com/yeabkal1001',
  },
  {
    title: 'Professional Art Printing Data More',
    description: `A daily selection of privately personalized reads; no accounts or sign-ups required. Has been the industry's standard.`,
    image: 'image 2.png',
    tags: ['HTML', 'Bootstrap', 'Ruby'],
    github: 'https://github.com/yeabkal1001',
  },
  {
    title: 'Data Dashboard Healthcare',
    description: `A daily selection of privately personalized reads; no accounts or sign-ups required. Has been the industry's standard.`,
    image: 'image 3.png',
    tags: [],
    github: 'https://github.com/yeabkal1001',
  },
  {
    title: 'Website Portfolio',
    description: `A daily selection of privately personalized reads; no accounts or sign-ups required. Has been the industry's standard.`,
    image: 'image 4.png',
    tags: [],
    github: 'https://github.com/yeabkal1001',
  },
];

// Helper to create modal
function createModal(project) {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal">
      <button class="modal-close" aria-label="Close">&times;</button>
      <img src="${project.image}" alt="${project.title}" class="modal-img">
      <h3>${project.title}</h3>
      <p>${project.description}</p>
      <div class="tags">${project.tags.map(tag => `<span>${tag}</span>`).join('')}</div>
      <a href="${project.github}" target="_blank" class="modal-github">View on GitHub</a>
    </div>
  `;
  document.body.appendChild(modal);
  // Close logic
  modal.querySelector('.modal-close').onclick = () => modal.remove();
  modal.onclick = e => { if (e.target === modal) modal.remove(); };
  // ESC key
  document.addEventListener('keydown', function esc(e) {
    if (e.key === 'Escape') { modal.remove(); document.removeEventListener('keydown', esc); }
  });
}

// Attach modal to all .see-project buttons
function setupProjectModals() {
  const buttons = document.querySelectorAll('.see-project');
  buttons.forEach((btn, i) => {
    btn.onclick = e => {
      e.preventDefault();
      createModal(projectData[i % projectData.length]);
    };
  });
}

// -------------------
// 2. Responsive Navigation
// -------------------
function setupMobileNav() {
  // Create hamburger
  const nav = document.querySelector('nav');
  const navLinks = document.querySelector('.nav-links');
  // Create hamburger only if not already present and only for mobile
  let hamburger = document.querySelector('.hamburger');
  if (!hamburger) {
    hamburger = document.createElement('button');
    hamburger.className = 'hamburger';
    hamburger.setAttribute('aria-label', 'Open menu');
    hamburger.innerHTML = '<span></span><span></span><span></span>';
    nav.insertBefore(hamburger, navLinks);
  }

  function toggleHamburger() {
    navLinks.classList.toggle('open');
    hamburger.classList.toggle('open');
  }

  hamburger.onclick = toggleHamburger;

  // Show/hide hamburger based on window width
  // Always show hamburger on mobile
  function handleResize() {
    if (window.innerWidth <= 800) {
      hamburger.style.display = 'flex';
      hamburger.style.position = 'fixed';
      hamburger.style.top = '24px';
      hamburger.style.right = '32px';
      hamburger.style.zIndex = '1100';
      // Do NOT close the menu or remove open class on resize, only on nav link click
    } else {
      hamburger.style.display = 'none';
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
    }
  }
  window.addEventListener('resize', handleResize);
  handleResize();

  // Close menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.onclick = (e) => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      // Smooth scroll to section
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };
  });
}

// -------------------
// 3. Smooth Scrolling & Active Section
// -------------------
function setupSmoothScroll() {
  document.querySelectorAll('nav a[href^="#"]').forEach(link => {
    link.onclick = function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    };
  });
}

// Fix: Only set nav link active state on click if the link is not a hash link ("#") and matches a section
// Also, keep scroll-based active section detection for correct highlighting
function setupActiveSection() {
  const sections = document.querySelectorAll('section, .recent-works-wrapper');
  const navLinks = document.querySelectorAll('nav .nav-links a');

  // Helper: get section id in view
  function getCurrentSection() {
    let current = '';
    let minDist = Infinity;
    const scrollY = window.scrollY;
    sections.forEach(sec => {
      const id = sec.getAttribute('id') || (sec.classList.contains('recent-works-wrapper') ? 'portfolio' : '');
      if (!id) return;
      const offset = sec.offsetTop - 120; // header height + margin
      const dist = Math.abs(scrollY - offset);
      if (scrollY >= offset - 10 && dist < minDist) {
        minDist = dist;
        current = id;
      }
    });
    return current;
  }

  // Update nav active state on scroll
  function updateActiveNav() {
    const current = getCurrentSection();
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
    });
  }
  window.addEventListener('scroll', updateActiveNav);
  updateActiveNav();

  // On nav click: scroll and set active immediately
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          window.scrollTo({
            top: target.offsetTop - 100, // offset for header
            behavior: 'smooth'
          });
          navLinks.forEach(l => l.classList.remove('active'));
          this.classList.add('active');
        }
      }
    });
  });
}

// -------------------
// 4. Contact Form Validation & Success
// -------------------
function setupContactForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;
  form.onsubmit = function(e) {
    e.preventDefault();
    // Validation
    const [first, last] = form.querySelectorAll('.form-row input');
    const email = form.querySelector('input[type="email"]');
    const textarea = form.querySelector('textarea');
    let valid = true;
    // Reset
    [first, last, email, textarea].forEach(f => f.classList.remove('error'));
    // First/Last name: required, min 2 chars
    if (!first.value.trim() || first.value.trim().length < 2) { first.classList.add('error'); valid = false; }
    if (!last.value.trim() || last.value.trim().length < 2) { last.classList.add('error'); valid = false; }
    // Email: required, valid format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim() || !emailPattern.test(email.value.trim())) { email.classList.add('error'); valid = false; }
    // Message: required, min 10 chars
    if (!textarea.value.trim() || textarea.value.trim().length < 10) { textarea.classList.add('error'); valid = false; }
    if (!valid) return;
    // Success message
    const msg = document.createElement('div');
    msg.className = 'form-success';
    msg.textContent = 'Thank you! Your message has been sent.';
    form.parentNode.insertBefore(msg, form);
    form.reset();
    setTimeout(() => msg.remove(), 4000);
  };
}

// -------------------
// 5. Resume Button
// -------------------
function setupResumeBtn() {
  const btn = document.querySelector('.resume-btn');
  if (btn) {
    btn.onclick = () => {
      window.open('https://github.com/yeabkal1001', '_blank');
    };
  }
}

// -------------------
// 6. Social & Mail Links
// -------------------
function setupSocialLinks() {
  // All social links and mail icon
  const github = 'https://github.com/yeabkal1001';
  document.querySelectorAll('.social-sidebar a, .footer .social-links a').forEach(a => {
    a.href = github;
    a.target = '_blank';
  });
  // Mail icon
  const mailLink = document.querySelector('.mail-link');
  if (mailLink) {
    mailLink.href = '#';
    mailLink.onclick = e => {
      e.preventDefault();
      // Copy email to clipboard
      const email = 'yeabkal1001@gmail.com';
      navigator.clipboard.writeText(email);
      // Tooltip
      let tip = document.createElement('span');
      tip.className = 'mail-tooltip';
      tip.textContent = 'Email copied!';
      mailLink.appendChild(tip);
      setTimeout(() => tip.remove(), 2000);
    };
  }
}

// -------------------
// 7. Animations on Scroll
// -------------------
function setupScrollAnimations() {
  const animated = document.querySelectorAll('.work-card, .about-top, .skills-section, .contact-wrapper');
  function animate() {
    animated.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 100) {
        el.classList.add('visible');
      }
    });
  }
  window.addEventListener('scroll', animate);
  animate();
}

// -------------------
// 8. Init All
// -------------------
document.addEventListener('DOMContentLoaded', () => {
  setupProjectModals();
  setupMobileNav();
  setupSmoothScroll();
  setupActiveSection();
  setupContactForm();
  setupResumeBtn();
  setupSocialLinks();
  setupScrollAnimations();
});
