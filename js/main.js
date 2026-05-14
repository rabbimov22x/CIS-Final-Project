/* Active Nav Link */
(function () {
  const links = document.querySelectorAll('nav ul li a');
  const current = window.location.pathname.split('/').pop() || 'index.html';
  links.forEach(link => {
    if (link.getAttribute('href') === current) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
})();

/* Hamburger Menu */
const hamburger = document.querySelector('.hamburger');
const navMenu   = document.querySelector('nav ul');
if (hamburger && navMenu) {
  const closeMenu = () => {
    navMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  };

  hamburger.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  document.addEventListener('click', e => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });
}

/*  Hero Slider */
const slides = document.querySelectorAll('.hero-slide');
const dots   = document.querySelectorAll('.hero-dots button');
if (slides.length) {
  let current = 0;
  function goTo(n) {
    slides[current].classList.remove('active');
    slides[current].setAttribute('aria-hidden', 'true');
    dots[current]?.classList.remove('active');
    dots[current]?.setAttribute('aria-current', 'false');
    current = (n + slides.length) % slides.length;
    slides[current].classList.add('active');
    slides[current].setAttribute('aria-hidden', 'false');
    dots[current]?.classList.add('active');
    dots[current]?.setAttribute('aria-current', 'true');
  }
  slides.forEach((slide, index) => {
    slide.setAttribute('aria-hidden', index === 0 ? 'false' : 'true');
  });
  goTo(0);

  let paused = false;
  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    heroSection.addEventListener('mouseenter', () => { paused = true; });
    heroSection.addEventListener('mouseleave', () => { paused = false; });
    heroSection.addEventListener('focusin',    () => { paused = true; });
    heroSection.addEventListener('focusout',   () => { paused = false; });
  }

  setInterval(() => { if (!paused) goTo(current + 1); }, 5000);
  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));
}

/*  Product Filter Tabs */
const filterTabs = document.querySelectorAll('.filter-tab');
const productCards = document.querySelectorAll('.product-card');
if (filterTabs.length) {
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-pressed', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-pressed', 'true');
      const filter = tab.dataset.filter;
      productCards.forEach(card => {
        const categories = card.dataset.category.split(' ');
        const matches = filter === 'all' || categories.includes(filter);
        card.hidden = !matches;
      });
    });
  });
}

/* Form Validation (order.html & contact.html) */
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
  input.setAttribute('aria-invalid', String(!valid));
  if (errMsg) errMsg.classList.toggle('visible', !valid);
  return valid;
}

const forms = document.querySelectorAll('form[data-validate]');
forms.forEach(form => {
  const inputs = form.querySelectorAll('input, select, textarea');

  inputs.forEach(input => {
    const errorId = input.closest('.form-group')?.querySelector('.error-msg')?.id;
    if (errorId) input.setAttribute('aria-describedby', errorId);

    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.classList.contains('error')) validateField(input);
    });
  });

  form.addEventListener('submit', e => {
    let allValid = true;
    inputs.forEach(input => { if (!validateField(input)) allValid = false; });

    if (!allValid) {
      e.preventDefault();
      form.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }

    const successUrl = form.dataset.successUrl;
    if (successUrl) {
      e.preventDefault();
      window.location.href = successUrl;
    }
  });
});

/*  Email Signup */
const signupForm = document.getElementById('signup-form');
const signupMessage = document.getElementById('signup-message');
if (signupForm) {
  signupForm.addEventListener('submit', e => {
    e.preventDefault();
    const input = signupForm.querySelector('input[type="email"]');
    if (input && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
      input.classList.remove('error');
      input.setAttribute('aria-invalid', 'false');
      if (signupMessage) signupMessage.textContent = "Thanks! You're signed up for daily specials.";
      signupForm.reset();
    } else {
      input?.classList.add('error');
      input?.setAttribute('aria-invalid', 'true');
      input?.focus();
    }
  });
}
