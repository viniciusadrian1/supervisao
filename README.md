# Supervisão 360 — Landing Page (Tour Virtual 360º no Google Maps)

Landing page de **conversão** (one-page) para campanha de tráfego pago.
Objetivo: esquentar o lead, derrubar objeções com prova social + autoridade e
levá-lo ao **WhatsApp** praticamente decidido. A página vende a **conversa**,
não o checkout.

> **Esta entrega é só a landing page.** A automação do WhatsApp (bot) é um
> segundo projeto. O link do CTA está centralizado para apontar, depois, para o
> número humano **ou** para o bot — trocando em um lugar só.

---

## 🗂️ Estrutura de arquivos

```
LPSupervisao/
├── index-a.html            # Versão A (completa) — página inteira
├── style-a.css             # CSS da versão A
├── script-a.js             # JS da versão A (WhatsApp, pixels, countdown, etc.)
├── index-b.html            # Versão B (enxuta, 2 dobras) — teste A/B
├── style-b.css             # CSS da versão B
├── script-b.js             # JS da versão B
├── vercel.json             # Deploy estático (URLs limpas + raiz → versão A)
├── README.md               # Este arquivo
└── assets/                 # Compartilhados pelas duas versões
    ├── favicon.svg
    ├── og-image.jpg        # Capa de compartilhamento (Open Graph)
    ├── images/             # Thumbnails .webp dos tours (+ .png originais)
    └── README-assets.md    # Guia dos placeholders a substituir
```

Sem build, sem dependências, sem `npm install`. É HTML/CSS/JS puro.

### Teste A/B — duas versões
- **Versão A** (`index-a.html`): a landing completa.
- **Versão B** (`index-b.html`): variante enxuta de 2 dobras, com reforço da identidade Google Maps.
- No deploy (Vercel), a raiz `/` serve a **A**; a **B** fica em **`/index-b`**. Os arquivos `*-a` e `*-b` são independentes e compartilham a pasta `assets/`.

### Por que **não** usei Tailwind CDN?
O briefing pede **Core Web Vitals altíssimos** (melhor Quality Score no anúncio).
O Tailwind via Play CDN é um compilador que roda **no navegador** e bloqueia a
renderização — ruim para o LCP. CSS escrito à mão entrega o mesmo resultado
visual, mais leve e mais rápido. (Se quiser Tailwind mesmo assim, dá para migrar
fazendo um build local com purge — mas não recomendo para esta LP de campanha.)

### Decisões de performance & acessibilidade já aplicadas
- **Hero pinta na hora** (não depende de JS) — protege o LCP. As animações de
  "aparecer ao rolar" valem só para o conteúdo abaixo da dobra.
- **À prova de falha:** se o JS não carregar (ou rodar num webview de app que não
  dispara o IntersectionObserver), todo o conteúdo aparece mesmo assim — nada
  fica invisível. CTAs nunca somem.
- **Fontes não-bloqueantes** (`media="print"`/`onload`), só os pesos usados.
- **Ícones em sprite SVG** (`<symbol>`/`<use>`) — HTML mais leve, 1 definição por ícone.
- **JSON-LD** (LocalBusiness + FAQPage) para rich results no Google.
- **Acessibilidade:** acordeão com `aria-controls`/`[hidden]` (respostas fechadas
  saem da leitura por leitor de tela), contraste AA, alvos de toque ≥ 44px,
  `prefers-reduced-motion`, navegação por teclado, `og-image.jpg` raster real.
- **Breakpoints reais:** mobile-first com ajustes em **560 / 768 / 960px**
  (cobrem bem os tamanhos de teste 375 / 768 / 1280).

---

## ▶️ Como rodar / testar localmente

É um site estático. Qualquer uma das opções:

- **Mais simples:** dê duplo clique em `index-a.html` (abre no navegador).
- **Com servidor local** (recomendado p/ testar tudo certinho):

```bash
# Python 3
python -m http.server 8000
# depois abra http://localhost:8000

# ou Node
npx serve .
```

Teste a responsividade nas larguras **375px**, **768px** e **1280px**
(DevTools → modo dispositivo).

---

## 🚀 Como hospedar

Funciona em qualquer hospedagem estática:

- **Vercel:** `vercel` na pasta (ou arraste no dashboard). Zero config.
- **Netlify:** arraste a pasta em app.netlify.com/drop.
- **Cloudflare Pages / GitHub Pages / hospedagem comum:** suba os arquivos
  mantendo a pasta `assets/` ao lado do `index-a.html`.

---

## ⚙️ O que ajustar antes de publicar (`⚠️ AJUSTAR`)

Tudo que muda está **comentado e centralizado**. Resumo:

### 1) Link do WhatsApp — `script-a.js`, bloco `CONFIG` (topo)
```js
const WHATSAPP_PHONE = "5511995770360"; // ⚠️ número da campanha (só dígitos)
const WHATSAPP_UTM   = "";              // ⚠️ opcional: "&utm_source=meta&utm_medium=cpc&..."
```
- Troque o número aqui **uma vez** — todos os botões da página usam ele.
- Decisão pendente: humano ou bot? É só trocar `WHATSAPP_PHONE`.
- As mensagens pré-preenchidas por contexto ficam em `WHATSAPP_MSGS` (mesmo arquivo).
  Todas já sinalizam que **"vim pelo anúncio"** (ajuda a qualificar o lead/bot).

### 2) Pixels de rastreamento — `index-a.html` (`<head>`)
- Descomente o bloco **Meta Pixel** e troque `SEU_PIXEL_ID`.
- Descomente o bloco **Google Tag (gtag.js)** e troque `G-XXXXXXX`.
- **Não precisa mexer no JS:** todo clique de WhatsApp já dispara
  `Contact` (Meta) + `generate_lead` (Google) + um push no `dataLayer` (GTM).
  Veja `trackConversion()` em `script-a.js`.

### 3) Promoção / prazo — `script-a.js`, `CONFIG`
```js
const PROMO_DEADLINE = "2026-06-21T23:59:59-03:00"; // ⚠️ data real (horário de Brasília)
```
- A contagem é **honesta**: conta até a data real e, ao expirar, **esconde** o
  bloco de prazo (não reinicia, não inventa urgência).
- Sem promoção ativa? Deixe `PROMO_DEADLINE = ""` para esconder o selo.
- Os **valores dos pacotes** estão na seção `#oferta` do `index-a.html`
  (procure `⚠️ AJUSTAR: valores e pacotes`).

### 4) Número do rodapé — `index-a.html` (seção 11)
- O institucional tem 4 números (SP, Guarulhos, RJ, Vitória). A LP usa **um**
  (SP, atual). Confirme qual usar na campanha.

### 5) SEO / Open Graph — `index-a.html` (`<head>`)
- Ajuste `og:url` / `canonical` para o **domínio final**.
- Exporte `assets/og-image.svg` → `assets/og-image.jpg` (ver `assets/README-assets.md`).

### 6) Assets reais (vídeo, badge Google, logos, thumbnails)
- Veja **`assets/README-assets.md`** — tabela com cada placeholder e o que colocar.
- Procure `⚠️ ASSET` no `index-a.html` para achar os pontos exatos.

---

## 🧪 Teste A/B — como duplicar para criar variantes

A página é stateless e auto-contida, então clonar é trivial:

1. Copie a pasta inteira (ex.: `LPSupervisao-B/`).
2. Edite só o que vai testar (headline do hero, CTA, ordem das seções, oferta…).
3. Publique em uma URL diferente (ex.: `/v2` ou subdomínio).
4. Divida o tráfego do anúncio entre as URLs (ou use a ferramenta de
   experimentos do Google Ads/Meta).
5. Diferencie a origem no rastreio mudando `WHATSAPP_UTM` em cada variante
   (ex.: `&utm_content=heroA` vs `&utm_content=heroB`) — assim dá para medir
   qual variante gera mais conversas no WhatsApp.

Dica: mantenha os IDs de pixel iguais entre variantes para comparar maçãs com maçãs.

---

## ✅ Checklist de "pronto para publicar"

- [ ] `WHATSAPP_PHONE` definido (humano ou bot) em `script-a.js`
- [ ] IDs de Meta Pixel e Google Tag colados e descomentados em `index-a.html`
- [ ] `PROMO_DEADLINE` confere com o prazo real (ou vazio se não houver promoção)
- [ ] Valores/pacotes da seção de oferta confirmados
- [ ] `og:url` / `canonical` / `og:image` com o **domínio final** (a `og-image.jpg` já existe como placeholder raster; troque pela arte do cliente se quiser)
- [ ] Vídeo do hero, badge oficial do Google, logos e thumbnails reais inseridos
- [ ] Testado em 375 / 768 / 1280 px
- [ ] Permissão de uso dos logos dos clientes confirmada

---

## 📊 Dados usados na página (todos reais)

Os números são do **Estudo Ipsos MediaCT para o Google** (41%, 78%, 62%, 2x,
29%, 42%, 35%) e os specs técnicos (7.296×3.648 px, formatos de vídeo) vêm do
site institucional. **Nada foi inventado** — inclusive a urgência, que é apenas
o prazo real da promoção. Mantenha esse princípio ao editar.
