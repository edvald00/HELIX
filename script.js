/* ============ HÉLIX — interactions ============ */

// mobile menu toggle
document.addEventListener('click', (e) => {
  const burger = e.target.closest('[data-burger]');
  if (burger) {
    document.querySelector('.menu')?.classList.toggle('open');
  }
  const closer = e.target.closest('[data-close-lightbox]');
  if (closer) document.querySelector('.lightbox')?.classList.remove('open');
});

// reveal-on-scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// count-up
function countUp(el) {
  const target = parseFloat(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const dur = 1400;
  const start = performance.now();
  function tick(now) {
    const p = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    const v = Math.floor(eased * target);
    el.textContent = v + suffix;
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = target + suffix;
  }
  requestAnimationFrame(tick);
}
const cio = new IntersectionObserver((entries) => {
  entries.forEach(en => { if (en.isIntersecting) { countUp(en.target); cio.unobserve(en.target); } });
}, { threshold: 0.4 });
document.querySelectorAll('[data-count]').forEach(el => cio.observe(el));

// gallery lightbox
document.querySelectorAll('[data-thumb]').forEach(t => {
  t.addEventListener('click', () => {
    document.querySelector('.lightbox')?.classList.add('open');
  });
});

// docs filter
const search = document.getElementById('docSearch');
const pills = document.querySelectorAll('[data-filter]');
const rows = document.querySelectorAll('[data-doc]');
const counter = document.getElementById('docCount');
let activeFilter = 'Todos';

function applyDocs() {
  const q = (search?.value || '').toLowerCase();
  let shown = 0;
  rows.forEach(r => {
    const cat = r.dataset.cat;
    const name = r.dataset.name.toLowerCase();
    const ok = (activeFilter === 'Todos' || cat === activeFilter) && name.includes(q);
    r.style.display = ok ? '' : 'none';
    if (ok) shown++;
  });
  if (counter) counter.textContent = `${shown} de ${rows.length} documentos`;
}
pills.forEach(p => p.addEventListener('click', () => {
  pills.forEach(x => x.classList.remove('active'));
  p.classList.add('active');
  activeFilter = p.dataset.filter;
  applyDocs();
}));
search?.addEventListener('input', applyDocs);
applyDocs();



/* Fix: Interatividade da Equipe */
document.addEventListener('DOMContentLoaded', () => {
  const avatars = document.querySelectorAll('.team-avatar');
  const nameEl = document.getElementById('teamName');
  const roleEl = document.getElementById('teamRole');
  const descEl = document.getElementById('teamDesc');

  if (avatars.length > 0) {
    avatars.forEach(btn => {
      btn.addEventListener('click', () => {
        avatars.forEach(a => a.classList.remove('active'));
        btn.classList.add('active');

        if (nameEl) nameEl.textContent = btn.getAttribute('data-name');
        if (roleEl) roleEl.textContent = btn.getAttribute('data-role');
        if (descEl) descEl.textContent = btn.getAttribute('data-desc');
      });
    });
  }
});

/* Fix: Download via JavaScript */
document.addEventListener('click', (e) => {
  const downloadBtn = e.target.closest('[data-download]');
  if (downloadBtn) {
    e.preventDefault();
    const fileUrl = downloadBtn.getAttribute('data-download');
    
    const originalText = downloadBtn.innerHTML;
    downloadBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg> Baixando...';
    downloadBtn.style.pointerEvents = 'none';

    fetch(fileUrl)
      .then(response => {
        if (!response.ok) throw new Error("Arquivo não encontrado");
        return response.blob();
      })
      .then(blob => {
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = blobUrl;
        a.download = fileUrl.split('/').pop();
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(blobUrl);
        document.body.removeChild(a);
      })
      .catch(err => {
        console.error("Erro no download:", err);
        alert("Erro ao tentar baixar o arquivo. Verifique se ele está na pasta.");
      })
      .finally(() => {
        downloadBtn.innerHTML = originalText;
        downloadBtn.style.pointerEvents = 'auto';
      });
  }
});
