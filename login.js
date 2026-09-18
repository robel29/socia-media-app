/* =============================================
   ROBEL DESALEGN — Login Page Scripts
   ============================================= */

'use strict';

/* =============================================
   1. TAB SWITCHING — Email / Phone
   ============================================= */
const tabs      = document.querySelectorAll('.login-tab');
const formEmail = document.getElementById('form-email');
const formPhone = document.getElementById('form-phone');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    const method = tab.dataset.method;
    formEmail.classList.toggle('active', method === 'email');
    formPhone.classList.toggle('active', method === 'phone');
  });
});

/* =============================================
   2. PASSWORD VISIBILITY TOGGLES
   ============================================= */
function setupPasswordToggle(btnId, inputId) {
  const btn   = document.getElementById(btnId);
  const input = document.getElementById(inputId);
  if (!btn || !input) return;

  btn.addEventListener('click', () => {
    const isPassword = input.type === 'password';
    input.type       = isPassword ? 'text' : 'password';
    btn.textContent  = isPassword ? '🙈' : '👁️';
  });
}

setupPasswordToggle('toggle-pw-email', 'login-password');
setupPasswordToggle('toggle-pw-phone', 'login-phone-password');

/* =============================================
   3. VALIDATION HELPERS
   ============================================= */
function showErr(id, msg) {
  const el = document.getElementById(id);
  if (el) el.textContent = msg;
  const input = el && el.previousElementSibling && el.previousElementSibling.querySelector('input');
  // mark the input inside .input-wrap as error
}

function clearErr(id) {
  const el = document.getElementById(id);
  if (el) el.textContent = '';
}

function markInput(inputEl, hasError) {
  if (!inputEl) return;
  inputEl.classList.toggle('error', hasError);
}

function isValidEmail(val) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
}

function isValidPhone(val) {
  // accepts formats: +251XXXXXXXXX, 09XXXXXXXX, 07XXXXXXXX
  return /^(\+251|0)[79]\d{8}$/.test(val.replace(/\s/g, ''));
}

/* =============================================
   4. EMAIL FORM SUBMISSION
   ============================================= */
const emailForm      = document.getElementById('form-email');
const emailSubmitBtn = document.getElementById('email-submit-btn');
const emailSuccess   = document.getElementById('email-success');

if (emailForm) {
  // Live validation on blur
  const emailInput = document.getElementById('login-email');
  const pwInput    = document.getElementById('login-password');

  emailInput.addEventListener('blur', () => {
    if (!isValidEmail(emailInput.value)) {
      showErr('email-err', 'Please enter a valid email address.');
      markInput(emailInput, true);
    } else {
      clearErr('email-err');
      markInput(emailInput, false);
    }
  });
  emailInput.addEventListener('input', () => { clearErr('email-err'); markInput(emailInput, false); });

  pwInput.addEventListener('blur', () => {
    if (pwInput.value.length < 6) {
      showErr('password-err', 'Password must be at least 6 characters.');
      markInput(pwInput, true);
    } else {
      clearErr('password-err');
      markInput(pwInput, false);
    }
  });
  pwInput.addEventListener('input', () => { clearErr('password-err'); markInput(pwInput, false); });

  emailForm.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    clearErr('email-err');
    clearErr('password-err');
    markInput(emailInput, false);
    markInput(pwInput, false);

    if (!isValidEmail(emailInput.value)) {
      showErr('email-err', 'Please enter a valid email address.');
      markInput(emailInput, true);
      valid = false;
    }
    if (pwInput.value.trim().length < 6) {
      showErr('password-err', 'Password must be at least 6 characters.');
      markInput(pwInput, true);
      valid = false;
    }
    if (!valid) return;

    // Show loading
    const label  = emailSubmitBtn.querySelector('.btn-label');
    const loader = emailSubmitBtn.querySelector('.btn-loader');
    emailSubmitBtn.disabled = true;
    label.classList.add('hidden');
    loader.classList.remove('hidden');
    emailSuccess.classList.add('hidden');

    // Simulate async login (replace with real auth call)
    setTimeout(() => {
      emailSubmitBtn.disabled = false;
      label.classList.remove('hidden');
      loader.classList.add('hidden');
      emailSuccess.classList.remove('hidden');

      // Redirect to portfolio after 2 seconds
      setTimeout(() => {
        sessionStorage.setItem('visited', 'true');
        window.location.href = 'index.html';
      }, 2000);
    }, 1800);
  });
}

/* =============================================
   5. PHONE FORM SUBMISSION
   ============================================= */
const phoneForm      = document.getElementById('form-phone');
const phoneSubmitBtn = document.getElementById('phone-submit-btn');
const phoneSuccess   = document.getElementById('phone-success');

if (phoneForm) {
  const phoneInput = document.getElementById('login-phone');
  const phonePwInput = document.getElementById('login-phone-password');

  phoneInput.addEventListener('blur', () => {
    if (!isValidPhone(phoneInput.value)) {
      showErr('phone-err', 'Enter a valid phone number (e.g. +251 965587039).');
      markInput(phoneInput, true);
    } else {
      clearErr('phone-err');
      markInput(phoneInput, false);
    }
  });
  phoneInput.addEventListener('input', () => { clearErr('phone-err'); markInput(phoneInput, false); });

  phonePwInput.addEventListener('blur', () => {
    if (phonePwInput.value.length < 6) {
      showErr('phone-password-err', 'Password must be at least 6 characters.');
      markInput(phonePwInput, true);
    } else {
      clearErr('phone-password-err');
      markInput(phonePwInput, false);
    }
  });
  phonePwInput.addEventListener('input', () => { clearErr('phone-password-err'); markInput(phonePwInput, false); });

  phoneForm.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    clearErr('phone-err');
    clearErr('phone-password-err');
    markInput(phoneInput, false);
    markInput(phonePwInput, false);

    if (!isValidPhone(phoneInput.value)) {
      showErr('phone-err', 'Enter a valid phone number (e.g. +251 965587039).');
      markInput(phoneInput, true);
      valid = false;
    }
    if (phonePwInput.value.trim().length < 6) {
      showErr('phone-password-err', 'Password must be at least 6 characters.');
      markInput(phonePwInput, true);
      valid = false;
    }
    if (!valid) return;

    // Show loading
    const label  = phoneSubmitBtn.querySelector('.btn-label');
    const loader = phoneSubmitBtn.querySelector('.btn-loader');
    phoneSubmitBtn.disabled = true;
    label.classList.add('hidden');
    loader.classList.remove('hidden');
    phoneSuccess.classList.add('hidden');

    // Simulate async login
    setTimeout(() => {
      phoneSubmitBtn.disabled = false;
      label.classList.remove('hidden');
      loader.classList.add('hidden');
      phoneSuccess.classList.remove('hidden');

      // Redirect to portfolio after 2 seconds
      setTimeout(() => {
        sessionStorage.setItem('visited', 'true');
        window.location.href = 'index.html';
      }, 2000);
    }, 1800);
  });
}

/* =============================================
   6. SOCIAL LOGIN BUTTONS (placeholder)
   ============================================= */
document.querySelectorAll('.social-login-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.textContent = '⏳ Connecting...';
    btn.disabled = true;
    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = btn.getAttribute('aria-label').includes('Google')
        ? `<svg viewBox="0 0 24 24" width="20" height="20"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg> Google`
        : `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg> GitHub`;
    }, 1500);
  });
});

/* =============================================
   7. KEYBOARD — Escape clears errors
   ============================================= */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    ['email-err', 'password-err', 'phone-err', 'phone-password-err'].forEach(clearErr);
  }
});
