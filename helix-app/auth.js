const HelixAuth = (() => {
  const SESSION_KEY = 'helix_session';
  const ATTEMPTS_KEY = 'helix_login_attempts';
  const SESSION_TTL_MS = 8 * 60 * 60 * 1000;
  const MAX_ATTEMPTS = 5;
  const LOCKOUT_MS = 15 * 60 * 1000;
  const PEPPER = 'helix_session_v1';
  const PANEL_URL = 'https://helix3d.vercel.app';

  const USERS = {
    'admin@helix.com': {
      passwordHash: '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9',
      name: 'Administrador',
      role: 'admin',
      initials: 'AD',
    },
  };

  async function hashPassword(password) {
    const data = new TextEncoder().encode(password);
    const buffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(buffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  async function signToken(email, expiresAt) {
    const payload = `${email}|${expiresAt}|${PEPPER}`;
    return hashPassword(payload);
  }

  function normalizeEmail(email) {
    return email.trim().toLowerCase();
  }

  function getAttempts() {
    try {
      const raw = sessionStorage.getItem(ATTEMPTS_KEY);
      if (!raw) return { count: 0, lockedUntil: 0 };
      return JSON.parse(raw);
    } catch {
      return { count: 0, lockedUntil: 0 };
    }
  }

  function saveAttempts(data) {
    sessionStorage.setItem(ATTEMPTS_KEY, JSON.stringify(data));
  }

  function getLockoutRemainingMs() {
    const { lockedUntil } = getAttempts();
    const remaining = lockedUntil - Date.now();
    return remaining > 0 ? remaining : 0;
  }

  function registerFailedAttempt() {
    const attempts = getAttempts();
    attempts.count += 1;
    if (attempts.count >= MAX_ATTEMPTS) {
      attempts.lockedUntil = Date.now() + LOCKOUT_MS;
      attempts.count = 0;
    }
    saveAttempts(attempts);
  }

  function clearAttempts() {
    sessionStorage.removeItem(ATTEMPTS_KEY);
  }

  async function createSession(email) {
    const user = USERS[email];
    const expiresAt = Date.now() + SESSION_TTL_MS;
    const token = await signToken(email, expiresAt);
    const session = { email, name: user.name, role: user.role, initials: user.initials, expiresAt, token };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  }

  async function validateSession(raw) {
    if (!raw) return null;
    let session;
    try {
      session = JSON.parse(raw);
    } catch {
      return null;
    }
    if (!session?.email || !session?.expiresAt || !session?.token) return null;
    if (Date.now() > session.expiresAt) return null;
    if (!USERS[session.email]) return null;
    const expected = await signToken(session.email, session.expiresAt);
    if (expected !== session.token) return null;
    return session;
  }

  async function getSession() {
    return validateSession(sessionStorage.getItem(SESSION_KEY));
  }

  async function login(email, password) {
    const lockout = getLockoutRemainingMs();
    if (lockout > 0) {
      const minutes = Math.ceil(lockout / 60000);
      throw new Error(`Muitas tentativas. Aguarde ${minutes} minuto(s) e tente novamente.`);
    }

    const normalized = normalizeEmail(email);
    const user = USERS[normalized];
    const hash = await hashPassword(password);

    if (!user || hash !== user.passwordHash) {
      registerFailedAttempt();
      throw new Error('E-mail ou senha incorretos.');
    }

    clearAttempts();
    return createSession(normalized);
  }

  function logout() {
    sessionStorage.removeItem(SESSION_KEY);
  }

  async function requireAuth(loginPath = 'login.html') {
    const session = await getSession();
    if (!session) {
      const next = encodeURIComponent(window.location.pathname.split('/').pop() + window.location.search);
      window.location.href = `${loginPath}?next=${next}`;
      return null;
    }
    return session;
  }

  async function redirectIfAuthenticated(target = 'servicos.html') {
    const session = await getSession();
    if (session) window.location.href = target;
  }

  function getPanelUrl(session) {
    const email = session?.email || '';
    const returnUrl = encodeURIComponent(window.location.origin + '/servicos.html');
    return `${PANEL_URL}?user=${encodeURIComponent(email)}&returnUrl=${returnUrl}`;
  }

  return {
    login,
    logout,
    getSession,
    requireAuth,
    redirectIfAuthenticated,
    getPanelUrl,
    PANEL_URL,
  };
})();

if (typeof window !== 'undefined') {
  window.HelixAuth = HelixAuth;
}
