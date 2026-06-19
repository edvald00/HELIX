# Hélix — Digital Twin AI

Site institucional e plataforma de gêmeo digital da fábrica **Hélix**, desenvolvida para conectar dados físicos e digitais em réplicas inteligentes de ambientes reais.


## O que é o Hélix

O Hélix é uma plataforma de **Digital Twin com IA** que espelha operações físicas em modelos virtuais atualizados em tempo real. A proposta é unir sensoriamento (IoT, APIs, ERP), modelos preditivos e automações para simular, prever e otimizar processos antes que ocorram no mundo real.

### Casos de uso previstos

- Indústria 4.0 e monitoramento operacional
- Manutenção preditiva
- Eficiência energética
- Cidades inteligentes e gestão de ativos

### Pilares da solução

| Pilar | Descrição |
|-------|-----------|
| Sensoriamento | Telemetria de IoT, APIs e ERP em um único plano de dados |
| Inteligência | Modelos preditivos e de simulação adaptados ao contexto |
| Ação | Recomendações e automações disparadas em tempo real |

## Estrutura do projeto

```
HELIX/
├── index.html, historia.html, integrantes.html ...   # Site institucional (HTML/CSS/JS)
├── login.html                                      # Autenticação (simulada)
├── servicos.html                                   # Painel de serviços (pós-login)
├── styles.css, script.js                           # Estilos e interações do site
├── helix-app/                                      # Aplicação Next.js (painel 3D)
│   └── src/
│       ├── app/page.tsx                            # Hub de seleção de ambientes
│       ├── app/room/[id]/page.tsx                  # Dashboard do gêmeo digital
│       └── components/DigitalTwin.tsx              # Visualização 3D (Three.js)
├── duplex/                                         # Modelo 3D do ambiente
├── docume/                                         # Documentos do projeto
└── imagens/                                        # Assets visuais
```

## Como executar localmente

### 1. Site institucional

Na raiz do repositório:

```bash
npx serve -l 8080
```

Acesse: **http://localhost:8080**

### 2. Painel 3D (Next.js)

```bash
cd helix-app
npm install
npm run dev
```

Acesse: **http://localhost:3000**

### Fluxo de teste (admin)

1. Abra `http://localhost:8080` e vá em **Entrar**
2. Credenciais de demonstração: `admin@helix.com` / `admin123`
3. Após login, você acessa o painel admin com sidebar unificada:
   - **Serviços** → visão geral da plataforma
   - **Documentos** → repositório técnico (área restrita)
   - **Visualizador** → prévia do ambiente 3D
   - **Modelos 3D** → painel completo na Vercel

A sessão expira em 8 horas. Após 5 tentativas inválidas, o login é bloqueado por 15 minutos.

## Missão, visão e valores

**Missão:** refletir o mundo físico em inteligência operacional acessível, em tempo real.

**Visão:** tornar Digital Twin AI um padrão para operações inteligentes em qualquer escala.

**Valores:** ética em IA, engenharia rigorosa e colaboração.

## Tecnologias

- **Site:** HTML5, CSS3, JavaScript
- **Painel 3D:** Next.js 16, React 19, TypeScript
- **Renderização 3D:** Three.js, React Three Fiber, Drei
- **Deploy de referência:** [helix-dt.vercel.app](https://helix-dt.vercel.app)

## Equipe

Projeto desenvolvido pela fábrica de software Hélix. Páginas de equipe, história, showcase e documentos estão disponíveis na navegação do site institucional.

## Observações para desenvolvimento

- A autenticação usa **sessão assinada** no `sessionStorage` (não expõe senha na URL)
- Senha armazenada apenas como hash SHA-256 no código (ambiente demo/acadêmico)
- Páginas admin (`servicos.html`, `documentos.html`, `dashboard.html`) exigem login válido
- O modelo 3D principal está em `helix-app/public/Duplex.glb`
- Posições de sensores (luz e ar) são salvas no `localStorage` do navegador
