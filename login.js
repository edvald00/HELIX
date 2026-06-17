// --- AUTENTICAÇÃO SIMULADA ---
const MOCK_USER = {
  email: 'admin@helix.com',
  password: '123'
};

// Verifica se já está logado
if (localStorage.getItem('helix_auth') === 'true') {
  window.location.href = 'dashboard.html';
}

function showLoginError(msg) {
  const errDiv = document.getElementById('loginErrorMsg');
  if (errDiv) {
    errDiv.textContent = msg;
    errDiv.style.display = 'block';
  }
}

function showRegisterError(msg) {
  const errDiv = document.getElementById('registerErrorMsg');
  if (errDiv) {
    errDiv.textContent = msg;
    errDiv.style.display = 'block';
  }
}

// ============ FORM: LOGIN ============
const form = document.getElementById('loginForm');
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const errDiv = document.getElementById('loginErrorMsg');
  if (errDiv) errDiv.style.display = 'none';

  const email = form.email.value.trim();
  const password = form.password.value.trim();
  const btn = form.querySelector('button[type="submit"]');

  if (!email || !password) {
    showLoginError("Por favor, preencha o e-mail e a senha.");
    return;
  }

  btn.textContent = "Carregando...";
  btn.disabled = true;

  // Simula tempo de rede
  setTimeout(() => {
    if (email === MOCK_USER.email && password === MOCK_USER.password) {
      localStorage.setItem('helix_auth', 'true');
      localStorage.setItem('helix_user_email', email);
      window.location.href = 'dashboard.html';
    } else {
      btn.textContent = "Entrar";
      btn.disabled = false;
      showLoginError("Credenciais inválidas. Tente admin@helix.com e senha 123");
    }
  }, 800);
});

// Login com Google (Simulado)
const btnGoogle = document.getElementById('btnGoogle');
btnGoogle?.addEventListener('click', () => {
  localStorage.setItem('helix_auth', 'true');
  localStorage.setItem('helix_user_email', 'google.user@helix.com');
  window.location.href = 'dashboard.html';
});

const btnGoogleSignup = document.getElementById('btnGoogleSignup');
btnGoogleSignup?.addEventListener('click', () => {
  localStorage.setItem('helix_auth', 'true');
  localStorage.setItem('helix_user_email', 'google.user@helix.com');
  window.location.href = 'dashboard.html';
});

// ============ FORM: CADASTRO ============
const registerForm = document.getElementById('registerForm');
registerForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const errDiv = document.getElementById('registerErrorMsg');
  if (errDiv) errDiv.style.display = 'none';

  const email = registerForm.email.value.trim();
  const password = registerForm.password.value.trim();
  const btn = registerForm.querySelector('button[type="submit"]');

  if (!email || !password) {
    showRegisterError("Preencha o e-mail e a senha para criar a conta.");
    return;
  }

  btn.textContent = "Criando...";
  btn.disabled = true;

  setTimeout(() => {
    localStorage.setItem('helix_auth', 'true');
    localStorage.setItem('helix_user_email', email);
    alert("Conta criada com sucesso! Redirecionando...");
    window.location.href = 'dashboard.html';
  }, 800);
});

// Esqueci minha senha
const btnForgot = document.getElementById('btnForgot');
btnForgot?.addEventListener('click', (e) => {
  e.preventDefault();
  const email = form.email.value;
  if(!email) {
    showLoginError("Digite seu email no campo acima para recuperar a senha.");
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