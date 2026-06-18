// --- AUTENTICAÇÃO SIMULADA ---
const MOCK_USER = {
  email: 'admin@helix.com',
  password: 'admin123'
};

// ============ FORM: LOGIN ============
const form = document.getElementById('loginForm');
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const email = form.email.value.trim();
  const password = form.password.value.trim();
  const btn = form.querySelector('button[type="submit"]');

  if (!email || !password) {
    alert("Por favor, preencha o e-mail e a senha.");
    return;
  }

  btn.textContent = "Carregando...";
  btn.disabled = true;

  // Simula tempo de rede
  setTimeout(() => {
    if (email === MOCK_USER.email && password === MOCK_USER.password) {
      const returnUrl = encodeURIComponent(window.location.href);
      window.location.href = `servicos.html?user=${encodeURIComponent(email)}`;
    } else {
      btn.textContent = "Entrar";
      btn.disabled = false;
      alert("Credenciais inválidas. Tente admin@helix.com e admin123");
    }
  }, 800);
});

// Login com Google (Simulado)
const btnGoogle = document.getElementById('btnGoogle');
btnGoogle?.addEventListener('click', () => {
  window.location.href = 'servicos.html';
});

const btnGoogleSignup = document.getElementById('btnGoogleSignup');
btnGoogleSignup?.addEventListener('click', () => {
  window.location.href = 'servicos.html';
});

// ============ FORM: CADASTRO ============
const registerForm = document.getElementById('registerForm');
registerForm?.addEventListener('submit', (e) => {
  e.preventDefault();

  const email = registerForm.email.value.trim();
  const password = registerForm.password.value.trim();
  const btn = registerForm.querySelector('button[type="submit"]');

  if (!email || !password) {
    alert("Preencha o e-mail e a senha para criar a conta.");
    return;
  }

  btn.textContent = "Criando...";
  btn.disabled = true;

  setTimeout(() => {
    alert("Conta criada com sucesso! Redirecionando...");
    window.location.href = 'servicos.html';
  }, 800);
});

// Esqueci minha senha
const btnForgot = document.getElementById('btnForgot');
btnForgot?.addEventListener('click', (e) => {
  e.preventDefault();
  const email = form.email.value;
  if(!email) {
    alert("Digite seu email no campo acima para recuperar a senha.");
    return;
  }
  alert("E-mail de recuperação enviado para: " + email);
});

// Toggle Password visual
document.querySelectorAll('[data-toggle]').forEach(btn => {
  btn.addEventListener('click', () => {
    const input = document.getElementById(btn.dataset.toggle);
    if (!input) return;
    const isPwd = input.type === 'password';
    input.type = isPwd ? 'text' : 'password';
    btn.setAttribute('aria-label', isPwd ? 'Ocultar senha' : 'Mostrar senha');
  });
});