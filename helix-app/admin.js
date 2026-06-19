const ADMIN_PAGES = {
  servicos: { label: 'Serviços', href: 'servico.html' },
  documentos: { label: 'Documentos', href: 'documentos.html' },
  dashboard: { label: 'Visualizador', href: 'dashboard.html' },
};

function adminIcon(name) {
  const icons = {
    servicos: '<path d="M12 2L2 7l10 5 10-5-10-5Z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>',
    documentos: '<path d="M6 3h9l4 4v14H6Z"/><path d="M9 13h6M9 17h6"/>',
    dashboard: '<rect x="3" y="3" width="7" height="7" rx="1.2"/><rect x="14" y="3" width="7" height="7" rx="1.2"/><rect x="3" y="14" width="7" height="7" rx="1.2"/><rect x="14" y="14" width="7" height="7" rx="1.2"/>',
    models: '<rect x="3" y="3" width="10" height="10" rx="1"/><rect x="11" y="11" width="10" height="10" rx="1"/>',
    site: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  };
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">${icons[name]}</svg>`;
}

function renderAdminSidebar(activePage, session, panelUrl) {
  const navItems = Object.entries(ADMIN_PAGES).map(([key, page]) => {
    const active = key === activePage ? ' is-active' : '';
    const current = key === activePage ? ' aria-current="page"' : '';
    return `<a class="admin-sidebar__link${active}" href="${page.href}"${current}>${adminIcon(key)}${page.label}</a>`;
  }).join('');

  return `
    <aside class="admin-sidebar" id="adminSidebar">
      <div class="admin-sidebar__brand">
        <div class="admin-sidebar__mark">H</div>
        <span class="admin-sidebar__name">Hélix</span>
      </div>
      <nav class="admin-sidebar__nav" aria-label="Painel administrativo">
        <span class="admin-sidebar__label">Administração</span>
        ${navItems}
        <span class="admin-sidebar__label">Plataforma</span>
        <a class="admin-sidebar__link" href="${panelUrl}" target="_blank" rel="noopener noreferrer">
          ${adminIcon('models')}Modelos 3D
        </a>
        <span class="admin-sidebar__label">Geral</span>
        <a class="admin-sidebar__link" href="index.html">${adminIcon('site')}Site público</a>
      </nav>
      <div class="admin-sidebar__footer">
        <div class="admin-avatar" id="adminAvatar">${session.initials || 'AD'}</div>
        <div>
          <div class="admin-user-name" id="adminUserName">${session.name || session.email}</div>
          <div class="admin-user-role" id="adminUserRole">${session.role === 'admin' ? 'Administrador' : session.role}</div>
        </div>
        <button type="button" class="admin-logout" id="adminLogout" title="Sair" aria-label="Sair">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg>
        </button>
      </div>
    </aside>`;
}

function setupMobileNav() {
  const sidebar = document.getElementById('adminSidebar');
  const backdrop = document.getElementById('adminBackdrop');
  const toggle = document.getElementById('adminNavToggle');
  if (!sidebar || !backdrop || !toggle) return;

  toggle.addEventListener('click', () => {
    sidebar.classList.toggle('is-open');
    backdrop.classList.toggle('is-open');
  });
  backdrop.addEventListener('click', () => {
    sidebar.classList.remove('is-open');
    backdrop.classList.remove('is-open');
  });
}

async function initAdminPage(activePage) {
  const session = await HelixAuth.requireAuth();
  if (!session) return null;

  const panelUrl = HelixAuth.getPanelUrl(session);
  const mount = document.getElementById('adminSidebarMount');
  if (mount) {
    mount.outerHTML = renderAdminSidebar(activePage, session, panelUrl);
  }

  document.getElementById('adminLogout')?.addEventListener('click', () => {
    HelixAuth.logout();
    window.location.href = 'login.html';
  });

  setupMobileNav();
  return session;
}

if (typeof window !== 'undefined') {
  window.initAdminPage = initAdminPage;
}
