// Filter chips
document.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
  });
});

// Period toggle
document.querySelectorAll('.mini-toggle button').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.parentElement.querySelectorAll('button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    // randomize bars for fun
    document.querySelectorAll('.bars div').forEach(b => {
      b.style.setProperty('--h', (30 + Math.random() * 65) + '%');
    });
  });
});

// Card click → go to 3D
document.querySelectorAll('.env-card').forEach(card => {
  card.addEventListener('click', (e) => {
    const link = card.querySelector('.env-go');
    if (link && !e.target.closest('a')) {
      window.location.href = link.href;
    }
  });
});

// Keyboard shortcut for search
document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    document.querySelector('.search input')?.focus();
  }
});

// Live "consumption" tick
const kpi = document.querySelector('.kpi-value');
if (kpi) {
  let base = 12847;
  setInterval(() => {
    base += Math.floor((Math.random() - 0.4) * 3);
    kpi.firstChild.textContent = base.toLocaleString('pt-BR') + ' ';
  }, 2500);
}
