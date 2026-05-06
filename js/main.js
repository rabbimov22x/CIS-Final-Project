/* Martha's Country Bakery — Main JS */

/* --- Active Nav Link --- */
(function () {
  const links = document.querySelectorAll('nav ul li a');
  const current = window.location.pathname.split('/').pop() || 'index.html';
  links.forEach(link => {
    if (link.getAttribute('href') === current) link.classList.add('active');
  });
})();

/* --- Hamburger Menu --- */
const hamburger = document.querySelector('.hamburger');
const navMenu   = document.querySelector('nav ul');
if (hamburger && navMenu) {
  hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', navMenu.classList.contains('open'));
  });
  document.addEventListener('click', e => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
      navMenu.classList.remove('open');
    }
  });
}

/* --- Hero Slider --- */
const slides = document.querySelectorAll('.hero-slide');
const dots   = document.querySelectorAll('.hero-dots button');
if (slides.length) {
  let current = 0;
  function goTo(n) {
    slides[current].classList.remove('active');
    dots[current]?.classList.remove('active');
    current = (n + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current]?.classList.add('active');
  }
  goTo(0);
  setInterval(() => goTo(current + 1), 5000);
  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));
}

/* --- Product Filter Tabs --- */
const filterTabs = document.querySelectorAll('.filter-tab');
const productCards = document.querySelectorAll('.product-card');
if (filterTabs.length) {
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.dataset.filter;
      productCards.forEach(card => {
        card.style.display =
          (filter === 'all' || card.dataset.category === filter) ? '' : 'none';
      });
    });
  });
}

/* --- Form Validation (order.html & contact.html) --- */
function validateField(input) {
  const group  = input.closest('.form-group');
  const errMsg = group?.querySelector('.error-msg');
  let valid = true;

  if (input.required && !input.value.trim()) {
    valid = false;
  } else if (input.type === 'email' && input.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
    valid = false;
  } else if (input.type === 'tel' && input.value && !/^\+?[\d\s\-()]{7,}$/.test(input.value)) {
    valid = false;
  }

  input.classList.toggle('error', !valid);
  if (errMsg) errMsg.classList.toggle('visible', !valid);
  return valid;
}

const forms = document.querySelectorAll('form[data-validate]');
forms.forEach(form => {
  const inputs = form.querySelectorAll('input, select, textarea');

  inputs.forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.classList.contains('error')) validateField(input);
    });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    let allValid = true;
    inputs.forEach(input => { if (!validateField(input)) allValid = false; });
    if (allValid) {
      window.location.href = 'thankyou.html';
    }
  });
});

/* --- Email Signup --- */
const signupForm = document.getElementById('signup-form');
if (signupForm) {
  signupForm.addEventListener('submit', e => {
    e.preventDefault();
    const input = signupForm.querySelector('input[type="email"]');
    if (input && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
      signupForm.innerHTML = '<p style="color:var(--chocolate);font-weight:600;">Thanks! You\'re signed up for daily specials.</p>';
    } else {
      input?.classList.add('error');
    }
  });
}
