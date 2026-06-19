const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

HelixAuth.redirectIfAuthenticated('servico.html');

function getNextUrl() {
  const next = new URLSearchParams(window.location.search).get('next');
  if (next && !next.includes('://') && !next.startsWith('//')) {
    return decodeURIComponent(next);
  }
  return 'servico.html';
}

function showError(message) {
  let box = document.getElementById('loginError');
  if (!box) {
    box = document.createElement('p');
    box.id = 'loginError';
    box.style.cssText = 'margin-top:12px;padding:10px 12px;border-radius:8px;font-size:14px;background:rgba(239,68,68,.12);border:1px solid rgba(239,68,68,.35);color:#fca5a5';
    loginForm?.appendChild(box);
  }
  box.textContent = message;
  box.hidden = false;
}

function clearError() {
  const box = document.getElementById('loginError');
  if (box) box.hidden = true;
}

loginForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearError();
  const email = loginForm.email.value;
  const password = loginForm.password.value;
  const btn = loginForm.querySelector('button[type="submit"]');
  if (!email.trim() || !password) {
    showError('Preencha o e-mail e a senha.');
    return;
  }
  btn.textContent = 'Entrando...';
  btn.disabled = true;
  try {
    await HelixAuth.login(email, password);
    window.location.href = getNextUrl();
  } catch (err) {
    showError(err.message || 'Não foi possível entrar.');
    btn.textContent = 'Entrar';
    btn.disabled = false;
  }
});

registerForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  alert('Cadastro disponível apenas mediante convite da equipe Hélix.');
});

document.getElementById('btnGoogle')?.addEventListener('click', () => {
  alert('Login social indisponível no ambiente de demonstração.');
});
document.getElementById('btnGoogleSignup')?.addEventListener('click', () => {
  alert('Cadastro social indisponível no ambiente de demonstração.');
});

document.getElementById('btnForgot')?.addEventListener('click', (e) => {
  e.preventDefault();
  alert('Recuperação de senha: entre em contato com o administrador do sistema.');
});

document.querySelectorAll('[data-toggle]').forEach(btn => {
  btn.addEventListener('click', () => {
    const input = document.getElementById(btn.dataset.toggle);
    if (!input) return;
    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';
    btn.setAttribute('aria-label', isPassword ? 'Ocultar senha' : 'Mostrar senha');
  });
});

(function () {
  const card = document.getElementById('authCard');
  if (!card) return;
  const goRegister = (e) => { e?.preventDefault(); card.classList.add('active'); };
  const goLogin = (e) => { e?.preventDefault(); card.classList.remove('active'); };
  ['btnGoToRegister', 'btnGoToRegisterMobile'].forEach((id) => {
    document.getElementById(id)?.addEventListener('click', goRegister);
  });
  ['btnGoToLogin', 'btnGoToLoginMobile'].forEach((id) => {
    document.getElementById(id)?.addEventListener('click', goLogin);
  });
  const year = new Date().getFullYear();
  const yearEl = document.getElementById('year');
  const yearAlt = document.getElementById('yearAlt');
  if (yearEl) yearEl.textContent = year;
  if (yearAlt) yearAlt.textContent = year;
})();
