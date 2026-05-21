import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, sendPasswordResetEmail, createUserWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBnh0xrXL4DsMNx1PuS8xzqcxsy_cnnrWM",
  authDomain: "helix-3da17.firebaseapp.com",
  projectId: "helix-3da17",
  storageBucket: "helix-3da17.firebasestorage.app",
  messagingSenderId: "1001757455710",
  appId: "1:1001757455710:web:f8c64062bd4ac61075cbcf",
  measurementId: "G-S37SK0EH2F"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Se já estiver logado, vai direto pro Hub Central (Next.js)
onAuthStateChanged(auth, (user) => {
  if (user) {
    // Redireciona para o servidor local do Next.js
    window.location.href = "http://localhost:3000/";
  }
});

// (Não precisamos mais do getRedirectResult pois usaremos Popup)

// ============ FORM: LOGIN ============
const form = document.getElementById('loginForm');
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = form.email.value;
  const password = form.password.value;
  const btn = form.querySelector('button[type="submit"]');
  btn.textContent = "Carregando...";

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Sucesso, o onAuthStateChanged vai redirecionar
    })
    .catch((error) => {
      btn.textContent = "Entrar";
      alert("Erro ao entrar: " + error.message);
    });
});

// Login com Google
const btnGoogle = document.getElementById('btnGoogle');
btnGoogle?.addEventListener('click', () => {
  signInWithPopup(auth, provider)
    .catch((error) => {
      console.error(error);
      alert("Erro com Google: " + error.message);
    });
});

// Google no painel de cadastro (mesma lógica)
const btnGoogleSignup = document.getElementById('btnGoogleSignup');
btnGoogleSignup?.addEventListener('click', () => {
  signInWithPopup(auth, provider)
    .catch((error) => {
      console.error(error);
      alert("Erro com Google: " + error.message);
    });
});

// ============ FORM: CADASTRO ============
const registerForm = document.getElementById('registerForm');
registerForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = registerForm.email.value;
  const password = registerForm.password.value;
  const btn = registerForm.querySelector('button[type="submit"]');

  if (!email || !password) {
    alert("Preencha o email e senha para criar a conta.");
    return;
  }

  btn.textContent = "Criando...";
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      alert("Conta criada com sucesso! Redirecionando...");
    })
    .catch((error) => {
      btn.textContent = "Criar conta";
      alert("Erro ao criar conta: " + error.message);
    });
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

  sendPasswordResetEmail(auth, email)
    .then(() => {
      alert("E-mail de recuperação enviado para: " + email);
    })
    .catch((error) => {
      alert("Erro ao enviar e-mail: " + error.message);
    });
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

// Slider toggle e footer year são tratados no script inline do HTML
// (garante funcionamento mesmo se este módulo Firebase falhar ao carregar).