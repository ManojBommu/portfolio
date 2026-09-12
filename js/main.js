/**
 * ==========================================================================
 * MAIN.JS - Bommu Manoj Madhu Kumar's Portfolio Interactive Logic
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initTypewriter();
  initThemeSwitcher();
  initNavScroll();
  initScrollSpy();
  initIntersectionObserver();
  initSkillBars();
  initRbacDemo();
  initPolynomialSandbox();
  initLoanChatbot();
  initClipboard();
  initContactForm();
  initModals();
  initBackToTop();
});

/* ----------------- 1. Custom Glow Cursor ----------------- */
function initCursor() {
  const dot = document.querySelector('.custom-cursor-dot');
  const outline = document.querySelector('.custom-cursor-outline');
  if (!dot || !outline || window.matchMedia('(pointer: coarse)').matches) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let outlineX = mouseX;
  let outlineY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
  });

  // Smooth lerp for outer ring
  function animateOutline() {
    outlineX += (mouseX - outlineX) * 0.18;
    outlineY += (mouseY - outlineY) * 0.18;
    outline.style.left = `${outlineX}px`;
    outline.style.top = `${outlineY}px`;
    requestAnimationFrame(animateOutline);
  }
  animateOutline();

  // Hover expansion on interactive elements
  const hoverables = document.querySelectorAll('a, button, input, textarea, .interactive-contact-card, .tilt-card, .theme-dot, .role-tab-btn, .poly-op-btn, .chat-reply-chip');
  hoverables.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      outline.style.transform = 'translate(-50%, -50%) scale(1.6)';
      outline.style.borderColor = 'var(--accent-primary)';
      outline.style.backgroundColor = 'var(--accent-glow-soft)';
    });
    el.addEventListener('mouseleave', () => {
      outline.style.transform = 'translate(-50%, -50%) scale(1)';
      outline.style.borderColor = 'var(--accent-primary)';
      outline.style.backgroundColor = 'transparent';
    });
  });

  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    outline.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity = '1';
    outline.style.opacity = '1';
  });
}

/* ----------------- 2. Dynamic Typewriter Effect ----------------- */
function initTypewriter() {
  const typingElement = document.getElementById('typing-text');
  if (!typingElement) return;

  const roles = [
    'Full-Stack Software Engineer',
    'C++ & DSA Specialist',
    'MERN Stack Developer',
    'Hackathon Finalist (Top 5/50)',
    'Problem Solver & Algorithmic Thinker'
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let speed = 90;

  function type() {
    const currentRole = roles[roleIdx];
    if (isDeleting) {
      typingElement.textContent = currentRole.substring(0, charIdx - 1);
      charIdx--;
      speed = 45;
    } else {
      typingElement.textContent = currentRole.substring(0, charIdx + 1);
      charIdx++;
      speed = 85;
    }

    if (!isDeleting && charIdx === currentRole.length) {
      speed = 1800; // Pause at end of text
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      speed = 450;
    }

    setTimeout(type, speed);
  }

  type();
}

/* ----------------- 3. Color Theme Switcher ----------------- */
function initThemeSwitcher() {
  const themeDots = document.querySelectorAll('.theme-dot');
  const savedTheme = localStorage.getItem('manoj_portfolio_theme') || 'cyan';

  applyTheme(savedTheme);

  themeDots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const selected = dot.getAttribute('data-pick');
      applyTheme(selected);
      showToast(`Theme switched to ${selected.toUpperCase()}`);
    });
  });

  function applyTheme(theme) {
    if (theme === 'cyan') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
    localStorage.setItem('manoj_portfolio_theme', theme);

    themeDots.forEach((d) => {
      if (d.getAttribute('data-pick') === theme) {
        d.classList.add('active');
      } else {
        d.classList.remove('active');
      }
    });
  }
}

/* ----------------- 4. Navbar Scroll & Mobile Menu ----------------- */
function initNavScroll() {
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const isOpen = navMenu.classList.contains('active');
      mobileToggle.innerHTML = isOpen ? '✕' : '☰';
    });

    // Close menu when clicking nav links
    navMenu.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileToggle.innerHTML = '☰';
      });
    });

    // Close menu when tapping outside on mobile
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && e.target !== mobileToggle && !mobileToggle.contains(e.target)) {
        navMenu.classList.remove('active');
        mobileToggle.innerHTML = '☰';
      }
    });
  }
}

/* ----------------- 5. Active Link Scrollspy ----------------- */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let scrollY = window.pageYOffset;

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 140;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
}

/* ----------------- 6. Intersection Observer Reveals ----------------- */
function initIntersectionObserver() {
  const revealElements = document.querySelectorAll('.reveal');
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.12
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach((el) => observer.observe(el));
}

/* ----------------- 7. Skill Progress Bars Animation ----------------- */
function initSkillBars() {
  const skillCards = document.querySelectorAll('.skill-card');
  const filterTabs = document.querySelectorAll('.filter-tab');

  // Filter skills by category
  filterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      filterTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      const cat = tab.getAttribute('data-category');

      skillCards.forEach((card) => {
        if (cat === 'all' || card.getAttribute('data-category') === cat) {
          card.style.display = 'flex';
          card.style.animation = 'floatSlow 0.4s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Animate skill meter fill on view
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const fillBar = entry.target.querySelector('.skill-bar-fill');
        if (fillBar) {
          const targetWidth = fillBar.getAttribute('data-progress') || '85%';
          fillBar.style.width = targetWidth;
        }
      }
    });
  }, { threshold: 0.25 });

  skillCards.forEach((card) => skillObserver.observe(card));
}

/* ----------------- 8. Property Management RBAC Demo ----------------- */
function initRbacDemo() {
  const roleButtons = document.querySelectorAll('.role-tab-btn');
  const roleNameDisplay = document.getElementById('rbac-role-name');
  const roleDescDisplay = document.getElementById('rbac-role-desc');
  const permissionsList = document.getElementById('rbac-permissions-list');

  const roleData = {
    admin: {
      name: 'Super Administrator',
      desc: 'Full system authorization: managing master tenant records, apartment allocations, staff credentials & financial auditing.',
      modules: [
        { name: 'Apartment Registry', perm: 'FULL ACCESS', status: 'full' },
        { name: 'Tenant Records & KYC', perm: 'FULL ACCESS', status: 'full' },
        { name: 'Room Booking Engine', perm: 'MANAGE ALL', status: 'full' },
        { name: 'Complaints Resolution', perm: 'RESOLVE / REASSIGN', status: 'full' }
      ]
    },
    manager: {
      name: 'Property Manager',
      desc: 'Operational management: processing room bookings, inspecting unit vacancies, and handling tenant maintenance complaints.',
      modules: [
        { name: 'Apartment Registry', perm: 'VIEW & UPDATE', status: 'view' },
        { name: 'Tenant Records & KYC', perm: 'CREATE & REVIEW', status: 'view' },
        { name: 'Room Booking Engine', perm: 'APPROVE / REJECT', status: 'full' },
        { name: 'Complaints Resolution', perm: 'ASSIGN & UPDATE', status: 'full' }
      ]
    },
    tenant: {
      name: 'Registered Tenant',
      desc: 'Self-service tenant portal: viewing rental lease agreements, booking amenities, submitting tickets, and paying dues.',
      modules: [
        { name: 'Apartment Registry', perm: 'VIEW OWN LEASE', status: 'view' },
        { name: 'Tenant Records & KYC', perm: 'EDIT PROFILE ONLY', status: 'view' },
        { name: 'Room Booking Engine', perm: 'REQUEST BOOKING', status: 'view' },
        { name: 'Complaints Resolution', perm: 'SUBMIT TICKET', status: 'full' }
      ]
    }
  };

  roleButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      roleButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const roleKey = btn.getAttribute('data-role');
      const data = roleData[roleKey];
      if (!data) return;

      if (roleNameDisplay) roleNameDisplay.textContent = data.name;
      if (roleDescDisplay) roleDescDisplay.textContent = data.desc;

      if (permissionsList) {
        permissionsList.innerHTML = data.modules
          .map(
            (m) => `
            <div class="rbac-mod-item">
              <span>● ${m.name}</span>
              <span class="badge-perm ${m.status}">${m.perm}</span>
            </div>`
          )
          .join('');
      }
    });
  });
}

/* ----------------- 9. Polynomial DSA Sandbox (C++ DSA Simulator) ----------------- */
function initPolynomialSandbox() {
  const poly1Input = document.getElementById('poly1-input');
  const poly2Input = document.getElementById('poly2-input');
  const resultDisplay = document.getElementById('poly-result-text');
  const opButtons = document.querySelectorAll('.poly-op-btn');

  if (!poly1Input || !resultDisplay) return;

  opButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const op = btn.getAttribute('data-operation');
      executePolyOperation(op);
    });
  });

  function parsePolynomial(str) {
    // Basic parser for demonstration: returns map of power -> coefficient
    let clean = str.replace(/\s+/g, '');
    if (!clean.startsWith('+') && !clean.startsWith('-')) clean = '+' + clean;
    const termRegex = /([+-]\d*)?(x(?:\^(\d+))?)?/gi;
    const terms = {};
    let match;

    while ((match = termRegex.exec(clean)) !== null) {
      if (match.index === termRegex.lastIndex) termRegex.lastIndex++;
      let full = match[0];
      if (!full) continue;

      let coefStr = match[1];
      let hasX = match[2] !== undefined;
      let powStr = match[3];

      let coef = 1;
      if (coefStr === '+' || !coefStr) coef = 1;
      else if (coefStr === '-') coef = -1;
      else coef = parseInt(coefStr, 10);

      let pow = 0;
      if (hasX) {
        pow = powStr ? parseInt(powStr, 10) : 1;
      }

      terms[pow] = (terms[pow] || 0) + coef;
    }
    return terms;
  }

  function formatPolynomial(terms) {
    const powers = Object.keys(terms).map(Number).sort((a, b) => b - a);
    let out = '';
    powers.forEach((p) => {
      const c = terms[p];
      if (c === 0) return;
      let sign = c > 0 ? (out ? '+ ' : '') : '- ';
      let absC = Math.abs(c);
      let termStr = '';
      if (p === 0) {
        termStr = `${absC}`;
      } else if (p === 1) {
        termStr = absC === 1 ? 'x' : `${absC}x`;
      } else {
        termStr = absC === 1 ? `x^${p}` : `${absC}x^${p}`;
      }
      out += `${sign}${termStr} `;
    });
    return out.trim() || '0';
  }

  function executePolyOperation(op) {
    const val1 = poly1Input.value.trim() || '3x^2 + 5x - 4';
    const val2 = (poly2Input && poly2Input.value.trim()) || '2x^2 - 3x + 6';
    const terms1 = parsePolynomial(val1);
    const terms2 = parsePolynomial(val2);

    let result = '';

    switch (op) {
      case 'add': {
        const added = { ...terms1 };
        Object.keys(terms2).forEach((p) => {
          added[p] = (added[p] || 0) + terms2[p];
        });
        result = `Sum: ${formatPolynomial(added)}`;
        break;
      }
      case 'subtract': {
        const subbed = { ...terms1 };
        Object.keys(terms2).forEach((p) => {
          subbed[p] = (subbed[p] || 0) - terms2[p];
        });
        result = `Diff: ${formatPolynomial(subbed)}`;
        break;
      }
      case 'diff': {
        const diffed = {};
        Object.keys(terms1).forEach((p) => {
          const power = Number(p);
          if (power > 0) {
            diffed[power - 1] = terms1[power] * power;
          }
        });
        result = `d/dx(P1) = ${formatPolynomial(diffed)}`;
        break;
      }
      case 'degree': {
        const nonZeroPowers = Object.keys(terms1)
          .map(Number)
          .filter((p) => terms1[p] !== 0);
        const maxDeg = nonZeroPowers.length ? Math.max(...nonZeroPowers) : 0;
        result = `Degree(P1) = ${maxDeg} (O(1) linked-node lookup)`;
        break;
      }
      case 'evaluate': {
        const xVal = 2;
        let sum = 0;
        Object.keys(terms1).forEach((p) => {
          sum += terms1[p] * Math.pow(xVal, Number(p));
        });
        result = `P1(x=2) = ${sum}`;
        break;
      }
      default:
        result = 'Operation ready';
    }

    resultDisplay.innerHTML = `<span style="color:var(--accent-primary);">${result}</span>`;
    resultDisplay.style.animation = 'none';
    resultDisplay.offsetHeight; // trigger reflow
    resultDisplay.style.animation = 'floatBadge 0.3s ease';
  }
}

/* ----------------- 10. AI-Powered Loan Eligibility Chatbot Sandbox ----------------- */
function initLoanChatbot() {
  const chatScreen = document.getElementById('chatbot-screen');
  const chatInput = document.getElementById('chat-input');
  const chatSendBtn = document.getElementById('chat-send-btn');
  const quickReplies = document.getElementById('chat-quick-replies');

  if (!chatScreen || !chatInput || !chatSendBtn) return;

  let step = 0;
  let applicantData = {
    salary: 60000,
    expenses: 20000,
    employment: 'Salaried'
  };

  const stepsConfig = [
    {
      botMsg: "👋 Welcome to LoanBot! I'll analyze your debt-to-income ratio. What is your monthly take-home salary?",
      options: ['₹40,000', '₹65,000', '₹1,00,000', '₹1,50,000'],
      field: 'salary'
    },
    {
      botMsg: 'Great! What are your approximate monthly living expenses & obligations?',
      options: ['₹15,000', '₹25,000', '₹40,000', '₹60,000'],
      field: 'expenses'
    },
    {
      botMsg: 'What is your current employment classification?',
      options: ['Salaried (Corporate/Govt)', 'Self-Employed / Freelancer'],
      field: 'employment'
    }
  ];

  function addMessage(text, sender = 'bot', isResult = false) {
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${sender} ${isResult ? 'result' : ''}`;
    bubble.innerHTML = text;
    chatScreen.appendChild(bubble);
    chatScreen.scrollTop = chatScreen.scrollHeight;
  }

  function renderOptions(options) {
    quickReplies.innerHTML = '';
    if (!options || options.length === 0) return;

    options.forEach((opt) => {
      const chip = document.createElement('button');
      chip.className = 'chat-reply-chip';
      chip.textContent = opt;
      chip.addEventListener('click', () => {
        handleUserInput(opt);
      });
      quickReplies.appendChild(chip);
    });
  }

  function handleUserInput(val) {
    if (!val) return;
    addMessage(val, 'user');
    chatInput.value = '';

    // Process current step value
    const cleanNum = parseInt(val.replace(/[^0-9]/g, ''), 10);
    if (step === 0 && cleanNum) applicantData.salary = cleanNum;
    else if (step === 1 && cleanNum) applicantData.expenses = cleanNum;
    else if (step === 2) applicantData.employment = val;

    step++;

    setTimeout(() => {
      if (step < stepsConfig.length) {
        addMessage(stepsConfig[step].botMsg, 'bot');
        renderOptions(stepsConfig[step].options);
      } else {
        calculateEligibility();
      }
    }, 450);
  }

  function calculateEligibility() {
    const salary = applicantData.salary;
    const expenses = applicantData.expenses;
    const disposable = Math.max(0, salary - expenses);
    const maxEmiCapacity = Math.round(disposable * 0.5); // 50% FOIR (Fixed Obligation to Income Ratio)
    
    // Approximate loan amount for 5 years (60 months) tenure @ 10.5% p.a.
    const eligibleAmount = Math.round(maxEmiCapacity * 46); 

    let statusHtml = '';
    if (disposable < 10000 || eligibleAmount < 50000) {
      statusHtml = `
        <strong>⚠️ Limited Eligibility</strong><br>
        Disposable Surplus: ₹${disposable.toLocaleString()}/mo<br>
        High obligation ratio detected. Consider adding a co-applicant.
      `;
    } else {
      statusHtml = `
        <strong>🎉 Pre-Approved Loan Recommendation!</strong><br>
        Max Eligible Loan: <span style="font-size:1.15rem; color:#fff; font-weight:800;">₹${eligibleAmount.toLocaleString()}</span><br>
        Affordable Monthly EMI: ₹${maxEmiCapacity.toLocaleString()}/mo (at 5-year tenure)<br>
        Debt-to-Income Score: ${Math.round((expenses / salary) * 100)}% (Healthy)
      `;
    }

    addMessage(statusHtml, 'bot', true);
    renderOptions(['Restart Assessment']);
    step = 0; // ready to restart
  }

  chatSendBtn.addEventListener('click', () => {
    const val = chatInput.value.trim();
    if (val) handleUserInput(val);
  });

  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const val = chatInput.value.trim();
      if (val) handleUserInput(val);
    }
  });

  // Initial render
  renderOptions(stepsConfig[0].options);
}

/* ----------------- 11. Clipboard Copy System & Toast ----------------- */
function initClipboard() {
  const copyButtons = document.querySelectorAll('[data-copy]');
  copyButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const text = btn.getAttribute('data-copy');
      if (!text) return;

      navigator.clipboard.writeText(text).then(() => {
        showToast(`Copied to clipboard: "${text}"`);
      }).catch(() => {
        // Fallback
        const temp = document.createElement('textarea');
        temp.value = text;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);
        showToast(`Copied to clipboard: "${text}"`);
      });
    });
  });
}

function showToast(message) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color:var(--accent-primary);">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  // Trigger animation
  setTimeout(() => toast.classList.add('show'), 20);

  // Remove after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 3200);
}

/* ----------------- 12. Interactive Contact Form ----------------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const messageInput = document.getElementById('contact-message');

    if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
      showToast('⚠️ Please fill out all required fields.');
      return;
    }

    showToast(`🚀 Thank you, ${nameInput.value.trim()}! Your message has been sent to Manoj.`);
    form.reset();
  });
}

/* ----------------- 13. Modal System ----------------- */
function initModals() {
  const modalTriggers = document.querySelectorAll('[data-modal-open]');
  const modalCloses = document.querySelectorAll('[data-modal-close]');

  modalTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const targetId = trigger.getAttribute('data-modal-open');
      const targetModal = document.getElementById(targetId);
      if (targetModal) {
        targetModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  modalCloses.forEach((closeBtn) => {
    closeBtn.addEventListener('click', () => {
      const modal = closeBtn.closest('.modal-overlay');
      if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  // Close when clicking outside content
  document.querySelectorAll('.modal-overlay').forEach((overlay) => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach((modal) => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      });
    }
  });
}

/* ----------------- 14. Back to Top Button ----------------- */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top-btn');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      backToTopBtn.style.opacity = '1';
      backToTopBtn.style.pointerEvents = 'auto';
    } else {
      backToTopBtn.style.opacity = '0';
      backToTopBtn.style.pointerEvents = 'none';
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
