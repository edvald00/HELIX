const MOCK_USER = { email: 'admin@helix.com', password: 'admin123' };

const loginForm = document.getElementById('loginForm');
loginForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = loginForm.email.value.trim();
  const password = loginForm.password.value.trim();
  const btn = loginForm.querySelector('button[type="submit"]');
  if (!email || !password) {
    alert('Preencha o e-mail e a senha.');
    return;
  }
  btn.textContent = 'Carregando...';
  btn.disabled = true;
  setTimeout(() => {
    if (email === MOCK_USER.email && password === MOCK_USER.password) {
      window.location.href = `servicos.html?user=${encodeURIComponent(email)}`;
    } else {
      btn.textContent = 'Entrar';
      btn.disabled = false;
      alert('Credenciais inválidas. Use admin@helix.com / admin123');
    }
  }, 800);
});

document.getElementById('btnGoogle')?.addEventListener('click', () => {
  window.location.href = 'servicos.html';
});
document.getElementById('btnGoogleSignup')?.addEventListener('click', () => {
  window.location.href = 'servicos.html';
});

const registerForm = document.getElementById('registerForm');
registerForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = registerForm.email.value.trim();
  const password = registerForm.password.value.trim();
  const btn = registerForm.querySelector('button[type="submit"]');
  if (!email || !password) {
    alert('Preencha o e-mail e a senha para criar a conta.');
    return;
  }
  btn.textContent = 'Criando...';
  btn.disabled = true;
  setTimeout(() => {
    alert('Conta criada. Redirecionando...');
    window.location.href = 'servicos.html';
  }, 800);
});

document.getElementById('btnForgot')?.addEventListener('click', (e) => {
  e.preventDefault();
  const email = loginForm?.email.value;
  if (!email) {
    alert('Digite seu e-mail no campo acima.');
    return;
  }
  alert('E-mail de recuperação enviado para: ' + email);
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
