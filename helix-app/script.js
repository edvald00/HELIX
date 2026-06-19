document.addEventListener('click', (e) => {
  if (e.target.closest('[data-burger]')) {
    document.querySelector('.menu')?.classList.toggle('open');
  }
  if (e.target.closest('[data-close-lightbox]')) {
    document.querySelector('.lightbox')?.classList.remove('open');
  }
  const downloadBtn = e.target.closest('[data-download]');
  if (downloadBtn) {
    e.preventDefault();
    const fileUrl = downloadBtn.getAttribute('data-download');
    const originalText = downloadBtn.innerHTML;
    downloadBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg> Baixando...';
    downloadBtn.style.pointerEvents = 'none';
    fetch(encodeURI(fileUrl))
      .then(res => {
        if (!res.ok) throw new Error('Arquivo não encontrado');
        return res.blob();
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
      .catch(() => alert('Erro ao baixar o arquivo. Verifique se ele está na pasta.'))
      .finally(() => {
        downloadBtn.innerHTML = originalText;
        downloadBtn.style.pointerEvents = 'auto';
      });
  }
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(en => {
    if (en.isIntersecting) {
      en.target.classList.add('in');
      revealObserver.unobserve(en.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

function countUp(el) {
  const target = parseFloat(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const start = performance.now();
  const duration = 1400;
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = progress < 1 ? Math.floor(eased * target) : target;
    el.textContent = value + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(en => {
    if (en.isIntersecting) {
      countUp(en.target);
      countObserver.unobserve(en.target);
    }
  });
}, { threshold: 0.4 });
document.querySelectorAll('[data-count]').forEach(el => countObserver.observe(el));

document.querySelectorAll('[data-thumb]').forEach(thumb => {
  thumb.addEventListener('click', () => {
    const bgUrl = thumb.getAttribute('data-image');
    const lightboxBox = document.querySelector('.lightbox .box');
    if (lightboxBox) {
      if (bgUrl) {
        lightboxBox.innerHTML = `<img src="${bgUrl}" style="width:100%;height:100%;object-fit:contain;border-radius:var(--radius)">`;
      } else {
        lightboxBox.innerHTML = `<svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" stroke-width="1"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="M21 15l-5-5L5 21"/></svg>`;
      }
    }
    document.querySelector('.lightbox')?.classList.add('open');
  });
});

const docSearch = document.getElementById('docSearch');
const filterPills = document.querySelectorAll('[data-filter]');
const docRows = document.querySelectorAll('[data-doc]');
const docCounter = document.getElementById('docCount');
let activeFilter = 'Todos';

function filterDocuments() {
  const query = (docSearch?.value || '').toLowerCase();
  let visible = 0;
  docRows.forEach(row => {
    const matchesCategory = activeFilter === 'Todos' || row.dataset.cat === activeFilter;
    const matchesSearch = row.dataset.name.toLowerCase().includes(query);
    const show = matchesCategory && matchesSearch;
    row.style.display = show ? '' : 'none';
    if (show) visible++;
  });
  if (docCounter) docCounter.textContent = `${visible} de ${docRows.length} documentos`;
}

filterPills.forEach(pill => {
  pill.addEventListener('click', () => {
    filterPills.forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    activeFilter = pill.dataset.filter;
    filterDocuments();
  });
});
docSearch?.addEventListener('input', filterDocuments);
filterDocuments();

document.addEventListener('DOMContentLoaded', () => {
  const avatars = document.querySelectorAll('.team-avatar');
  const nameEl = document.getElementById('teamName');
  const roleEl = document.getElementById('teamRole');
  const descEl = document.getElementById('teamDesc');
  if (!avatars.length) return;
  avatars.forEach(btn => {
    btn.addEventListener('click', () => {
      avatars.forEach(a => a.classList.remove('active'));
      btn.classList.add('active');
      if (nameEl) nameEl.textContent = btn.getAttribute('data-name');
      if (roleEl) roleEl.textContent = btn.getAttribute('data-role');
      if (descEl) descEl.textContent = btn.getAttribute('data-desc');
    });
  });
});
