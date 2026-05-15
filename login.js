/* ============ HÉLIX — LOGIN ============ */

// ano dinâmico no rodapé
document.getElementById('year').textContent = new Date().getFullYear();

// toggle de senha
document.querySelectorAll('[data-toggle]').forEach(btn => {
  btn.addEventListener('click', () => {
    const input = document.getElementById(btn.dataset.toggle);
    if (!input) return;
    const isPwd = input.type === 'password';
    input.type = isPwd ? 'text' : 'password';
    btn.setAttribute('aria-label', isPwd ? 'Ocultar senha' : 'Mostrar senha');
  });
});

// submit (placeholder — conecte ao seu backend)
const form = document.getElementById('loginForm');
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  console.log('[Hélix] login submit:', data);
  // TODO: integrar autenticação real
  alert('Login enviado! (substitua por chamada ao seu backend)');
});