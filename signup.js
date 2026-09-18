/* =============================================
   ROBEL DESALEGN — Sign Up Page Scripts
   ============================================= */

'use strict';

/* =============================================
   HELPERS
   ============================================= */
const $ = id => document.getElementById(id);

function showErr(id, msg) {
  const el = $(id);
  if (el) el.textContent = msg;
}

function clearErr(id) {
  const el = $(id);
  if (el) el.textContent = '';
}

function markInput(inputEl, hasError) {
  if (inputEl) inputEl.classList.toggle('error', hasError);
}

function isValidEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

function isValidPhone(v) {
  return /^(\+251|0)[79]\d{8}$/.test(v.replace(/\s/g, ''));
}

/* =============================================
   STEP NAVIGATION
   ============================================= */
let currentStep = 1;

function goToStep(n) {
  // Hide all steps
  document.querySelectorAll('.signup-step').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.step').forEach(s => s.classList.remove('active', 'done'));

  // Show target step
  $(`step-${n}`).classList.add('active');

  // Update dots
  for (let i = 1; i <= 3; i++) {
    const dot = $(`step-dot-${i}`);
    if (i < n)  dot.classList.add('done');
    if (i === n) dot.classList.add('active');
  }

  // Hide social / login link on step 3
  const socialDivider  = $('social-divider');
  const socialBtns     = $('social-btns');
  const loginLinkWrap  = $('login-link-wrap');

  if (n === 3) {
    if (socialDivider) socialDivider.style.display = 'none';
    if (socialBtns)    socialBtns.style.display    = 'none';
    if (loginLinkWrap) loginLinkWrap.style.display  = 'none';
  } else {
    if (socialDivider) socialDivider.style.display = '';
    if (socialBtns)    socialBtns.style.display    = '';
    if (loginLinkWrap) loginLinkWrap.style.display  = '';
  }

  currentStep = n;
}

/* =============================================
   STEP 1 VALIDATION
   ============================================= */
function validateStep1() {
  let valid = true;
  const fn    = $('su-firstname');
  const ln    = $('su-lastname');
  const phone = $('su-phone');

  clearErr('su-firstname-err'); markInput(fn, false);
  clearErr('su-lastname-err');  markInput(ln, false);
  clearErr('su-phone-err');     markInput(phone, false);

  if (!fn.value.trim() || fn.value.trim().length < 2) {
    showErr('su-firstname-err', 'First name must be at least 2 characters.');
    markInput(fn, true); valid = false;
  }
  if (!ln.value.trim() || ln.value.trim().length < 2) {
    showErr('su-lastname-err', 'Last name must be at least 2 characters.');
    markInput(ln, true); valid = false;
  }
  if (!isValidPhone(phone.value)) {
    showErr('su-phone-err', 'Enter a valid phone number (e.g. +251 965587039).');
    markInput(phone, true); valid = false;
  }
  return valid;
}

$('next-btn-1').addEventListener('click', () => {
  if (validateStep1()) goToStep(2);
});

/* =============================================
   STEP 2 VALIDATION
   ============================================= */
function validateStep2() {
  let valid = true;
  const email   = $('su-email');
  const pw      = $('su-password');
  const confirm = $('su-confirm');
  const terms   = $('su-terms');

  clearErr('su-email-err');    markInput(email, false);
  clearErr('su-password-err'); markInput(pw, false);
  clearErr('su-confirm-err');  markInput(confirm, false);
  clearErr('su-terms-err');

  if (!isValidEmail(email.value)) {
    showErr('su-email-err', 'Please enter a valid email address.');
    markInput(email, true); valid = false;
  }
  if (pw.value.length < 8) {
    showErr('su-password-err', 'Password must be at least 8 characters.');
    markInput(pw, true); valid = false;
  }
  if (confirm.value !== pw.value || confirm.value === '') {
    showErr('su-confirm-err', 'Passwords do not match.');
    markInput(confirm, true); valid = false;
  }
  if (!terms.checked) {
    showErr('su-terms-err', 'You must agree to the Terms & Conditions.');
    valid = false;
  }
  return valid;
}

$('back-btn-2').addEventListener('click', () => goToStep(1));

/* =============================================
   PASSWORD STRENGTH METER
   ============================================= */
$('su-password').addEventListener('input', () => {
  const val    = $('su-password').value;
  const fill   = $('strength-fill');
  const label  = $('strength-label');
  let score    = 0;

  if (val.length >= 8)              score++;
  if (/[A-Z]/.test(val))            score++;
  if (/[0-9]/.test(val))            score++;
  if (/[^A-Za-z0-9]/.test(val))     score++;

  const levels = [
    { pct: '0%',   color: 'transparent', text: '' },
    { pct: '25%',  color: '#ff6584',     text: 'Weak' },
    { pct: '50%',  color: '#ff9f43',     text: 'Fair' },
    { pct: '75%',  color: '#48dbfb',     text: 'Good' },
    { pct: '100%', color: '#00c9a7',     text: 'Strong' },
  ];

  const lvl = levels[score] || levels[0];
  fill.style.width           = val.length ? lvl.pct : '0%';
  fill.style.background      = lvl.color;
  label.textContent          = val.length ? lvl.text : '';
  label.style.color          = lvl.color;
});

/* =============================================
   PASSWORD TOGGLES
   ============================================= */
function setupToggle(btnId, inputId) {
  const btn   = $(btnId);
  const input = $(inputId);
  if (!btn || !input) return;
  btn.addEventListener('click', () => {
    const show    = input.type === 'password';
    input.type    = show ? 'text' : 'password';
    btn.textContent = show ? '🙈' : '👁️';
  });
}

setupToggle('toggle-pw-su',      'su-password');
setupToggle('toggle-pw-confirm', 'su-confirm');

/* =============================================
   LIVE VALIDATION BLUR
   ============================================= */
const liveFields = [
  { id: 'su-firstname', errId: 'su-firstname-err', check: v => v.trim().length >= 2, msg: 'At least 2 characters required.' },
  { id: 'su-lastname',  errId: 'su-lastname-err',  check: v => v.trim().length >= 2, msg: 'At least 2 characters required.' },
  { id: 'su-phone',     errId: 'su-phone-err',     check: v => isValidPhone(v),       msg: 'Enter a valid phone number.' },
  { id: 'su-email',     errId: 'su-email-err',     check: v => isValidEmail(v),       msg: 'Enter a valid email address.' },
  { id: 'su-password',  errId: 'su-password-err',  check: v => v.length >= 8,         msg: 'Password must be at least 8 characters.' },
];

liveFields.forEach(({ id, errId, check, msg }) => {
  const el = $(id);
  if (!el) return;
  el.addEventListener('blur', () => {
    if (!check(el.value)) { showErr(errId, msg); markInput(el, true); }
    else                   { clearErr(errId);     markInput(el, false); }
  });
  el.addEventListener('input', () => { clearErr(errId); markInput(el, false); });
});

// Confirm password live
$('su-confirm').addEventListener('input', () => {
  const pw  = $('su-password').value;
  const con = $('su-confirm').value;
  if (con && con !== pw) {
    showErr('su-confirm-err', 'Passwords do not match.');
    markInput($('su-confirm'), true);
  } else {
    clearErr('su-confirm-err');
    markInput($('su-confirm'), false);
  }
});

/* =============================================
   FORM SUBMIT
   ============================================= */
$('signup-form').addEventListener('submit', e => {
  e.preventDefault();
  if (!validateStep2()) return;

  const btn    = $('signup-submit-btn');
  const label  = btn.querySelector('.btn-label');
  const loader = btn.querySelector('.btn-loader');

  btn.disabled = true;
  label.classList.add('hidden');
  loader.classList.remove('hidden');

  // Simulate async account creation
  setTimeout(() => {
    btn.disabled = false;
    label.classList.remove('hidden');
    loader.classList.add('hidden');

    // Set name on success screen
    const firstName = $('su-firstname').value.trim();
    $('success-name').textContent = firstName || 'there';
    sessionStorage.setItem('visited', 'true');

    goToStep(3);
  }, 1800);
});

/* =============================================
   SOCIAL BUTTONS (placeholder)
   ============================================= */
document.querySelectorAll('.social-login-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const original = btn.innerHTML;
    btn.textContent = '⏳ Connecting...';
    btn.disabled = true;
    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = original;
    }, 1500);
  });
});
