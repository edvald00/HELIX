# Hélix — Digital Twin AI

> Plataforma de gêmeo digital que conecta o mundo físico ao digital — com visualização 3D, painel administrativo e site institucional completo.

**Projeto Integrador Acadêmico · Fábrica de Software Hélix**


---

## O projeto

O **Hélix** é uma plataforma de **Digital Twin com IA** que cria réplicas inteligentes de ambientes reais.

**Problema:** operações físicas com decisões baseadas em dados desatualizados.

**Solução:** gêmeo virtual em tempo real para simular, prever e otimizar processos.

**Três pilares:**

| Pilar | Função |
|-------|--------|
| Sensoriamento | IoT, APIs e ERP unificados |
| Inteligência | Modelos preditivos e simulação |
| Ação | Automações e recomendações em tempo real |

---

## Site institucional

Interface pública com identidade visual própria — paleta azul/roxo, animações e layout responsivo.

**Páginas**

- **Home** — hero com animação físico ↔ digital, pilares e casos de uso
- **História** — linha do tempo do projeto
- **Equipe** — 4 integrantes e papéis
- **Showcase** — fotos reais com lightbox
- **Missão e Valores** — propósito da fábrica

**Arquivos principais**

- `index.html` — landing page
- `styles.css` — design system e animações
- `script.js` — scroll reveal, lightbox, filtros

---

## Autenticação e painel admin

Área restrita com login protegido e navegação unificada por sidebar.

**Segurança (`auth.js`)**

- Senha verificada via hash SHA-256
- Sessão assinada no navegador (TTL 8h)
- Bloqueio após 5 tentativas inválidas
- Rotas admin protegidas — redireciona para login

**Painel admin**

| Página | Função |
|--------|--------|
| `servicos.html` | Visão geral de serviços e recursos |
| `documentos.html` | Repositório técnico com download |
| `dashboard.html` | Prévia do visualizador 3D |

**Layout compartilhado:** `admin.js` + `admin.css`

**Demo:** `admin@helix.com` · `admin123`

---

## Gêmeo digital 3D

Painel Next.js com renderização em tempo real via Three.js.

**Hub de ambientes** — Suíte Presidencial · Quarto Deluxe · Lobby

**Controles interativos**

- Luz e ar-condicionado refletem no modelo 3D
- Telemetria simulada (temperatura, consumo kW)
- Posicionamento de sensores no ambiente (CMS espacial)

**Arquivos principais**

| Arquivo | Função |
|---------|--------|
| `helix-app/src/app/page.tsx` | Hub de seleção de ambientes |
| `helix-app/src/app/room/[id]/page.tsx` | Dashboard com controles |
| `helix-app/src/components/DigitalTwin.tsx` | Cena 3D completa |
| `helix-app/public/Duplex.glb` | Modelo do ambiente |

**Componentes 3D:** lustre procedural · ar-condicionado · partículas de frio · marcadores AR

---

## Fluxo da aplicação

```
Site público
    ↓
Login (auth.js)
    ↓
Painel Admin — Serviços · Documentos · Visualizador
    ↓
Modelos 3D (helix3d.vercel.app)
    ↓
Gêmeo Digital interativo
```

---

## Estrutura do repositório

```
HELIX/
├── index.html · historia.html · integrantes.html · fotos.html
├── login.html · servicos.html · documentos.html · dashboard.html
├── auth.js · admin.js · admin.css · styles.css · script.js
├── helix-app/
│   ├── src/app/page.tsx
│   ├── src/app/room/[id]/page.tsx
│   ├── src/components/DigitalTwin.tsx
│   └── public/Duplex.glb
├── imagens/
└── documentos/ (PDF, DOCX)
```

---

## Tecnologias

| Camada | Stack |
|--------|-------|
| Site | HTML5 · CSS3 · JavaScript |
| Admin | auth.js · sessionStorage |
| Painel 3D | Next.js 16 · React 19 · TypeScript |
| Renderização | Three.js · React Three Fiber · Drei |
| Deploy | Vercel · GitHub Pages |

---

## Equipe

| Integrante | Papel |
|------------|-------|
| Edvaldo Silva | Analista de Requisitos / PO |
| Pabllo Hyan | Engenheiro de Software / IA |
| Flávio Barros | Scrum Master |
| Gabriel Manoel | Engenheiro de Requisitos / GP |

---

## Documentos do projeto

- Documento de Requisitos Hélix (PDF)
- Levantamento de Requisitos v1 (PDF)
- Revisão de Requisitos — 02/06/2026 (DOCX)
- Ata Sprint Planning — Sprint 1 (PDF)

---

## Executar localmente

```bash
# Site + painel admin
npx serve -l 8080

# Painel 3D
cd helix-app && npm install && npm run dev
```

---

## Missão · Visão · Valores

**Missão** — refletir o mundo físico em inteligência operacional acessível, em tempo real.

**Visão** — tornar Digital Twin AI um padrão para operações inteligentes.

**Valores** — ética em IA · engenharia rigorosa · colaboração.
