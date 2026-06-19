/* =====================================================================
   SUPERVISÃO 360 — script.js
   Tudo que você precisa ajustar está no bloco "CONFIG" abaixo.
   ===================================================================== */
(function () {
  "use strict";

  /* ===================================================================
     CONFIG  —  ⚠️ AJUSTAR AQUI (e só aqui)
     =================================================================== */

  // ⚠️ AJUSTAR: número de WhatsApp da campanha (formato internacional, só dígitos).
  // Decisão pendente: este número é o do atendimento humano OU o do bot de
  // automação (2º projeto)? Trocar em 1 lugar só.
  // OBS: o número exibido no rodapé (index.html) deve casar com este valor.
  const WHATSAPP_PHONE = "5511995770360"; // SP — (11) 99577-0360

  // ⚠️ AJUSTAR (opcional): parâmetros UTM anexados ao link (rastreio de origem).
  const WHATSAPP_UTM = ""; // ex.: "&utm_source=meta&utm_medium=cpc&utm_campaign=tour360"

  // Mensagem padrão pré-preenchida (sinaliza que o lead veio do anúncio).
  const WHATSAPP_BASE_MSG =
    "Olá! Vim pelo anúncio do Tour Virtual 360º no Google Maps. Quero saber os valores e como funciona.";

  // Bloco de qualificação anexado às mensagens: captura SEGMENTO e CIDADE já na
  // 1ª mensagem (o serviço é presencial — cidade/segmento são decisivos p/ o atendimento/bot).
  const WHATSAPP_QUALIFY =
    "\n\nMeu segmento: ____ (ex.: academia, restaurante, clínica)\nCidade/bairro: ____";

  // Mensagens por contexto (cada CTA qualifica melhor o lead p/ o atendimento/bot).
  const WHATSAPP_MSGS = {
    hero:               WHATSAPP_BASE_MSG + WHATSAPP_QUALIFY,
    problema:           "Olá! Vim pelo anúncio. Quero aparecer na frente do concorrente no Google Maps com um Tour 360º." + WHATSAPP_QUALIFY,
    dados:              "Olá! Vim pelo anúncio e quero esses resultados do Google (mais visitas e pedidos de rota) com um Tour 360º." + WHATSAPP_QUALIFY,
    como_funciona:      "Olá! Vim pelo anúncio e quero agendar o Tour Virtual 360º para a minha empresa." + WHATSAPP_QUALIFY,
    galeria:            "Olá! Vim pelo anúncio. Vi os tours publicados e quero um Tour 360º assim para o meu negócio." + WHATSAPP_QUALIFY,
    oferta:             "Olá! Vim pelo anúncio e quero garantir o valor da promoção do Tour 360º no Google Maps." + WHATSAPP_QUALIFY,
    pacote_essencial:   "Olá! Vim pelo anúncio e quero o pacote Essencial (2 fotos + 1 vídeo) do Tour 360º." + WHATSAPP_QUALIFY,
    pacote_profissional:"Olá! Vim pelo anúncio e quero o pacote Profissional (4 fotos + 2 vídeos) do Tour 360º." + WHATSAPP_QUALIFY,
    pacote_completo:    "Olá! Vim pelo anúncio e quero o pacote Completo (10 fotos + 5 vídeos) do Tour 360º." + WHATSAPP_QUALIFY,
    faq:                "Olá! Vim pelo anúncio e quero falar com um especialista sobre o Tour Virtual 360º no Google Maps." + WHATSAPP_QUALIFY,
    final:              WHATSAPP_BASE_MSG + WHATSAPP_QUALIFY,
    flutuante:          WHATSAPP_BASE_MSG + WHATSAPP_QUALIFY,
    rodape:             WHATSAPP_BASE_MSG + WHATSAPP_QUALIFY
  };

  // Cronômetro de urgência (em MINUTOS). Conta a partir do carregamento da página e
  // REINICIA toda vez que o visitante recarrega/reabre o site (urgência por sessão).
  // OBS: é urgência PERCEBIDA, não um prazo real — quem recarrega vê o relógio voltar.
  // Para urgência honesta com data fixa, troque por uma data ISO e conte até ela.
  const FLASH_MINUTES = 60;

  // Limiar (px de rolagem) para mostrar o botão flutuante (mais cedo = mais visível).
  const FLOAT_SHOW_AFTER = 300;

  /* ===================================================================
     1) LINK DO WHATSAPP — centralizado
     =================================================================== */
  function buildWhatsappUrl(context) {
    const msg = WHATSAPP_MSGS[context] || WHATSAPP_BASE_MSG;
    return (
      "https://api.whatsapp.com/send?phone=" +
      WHATSAPP_PHONE +
      "&text=" +
      encodeURIComponent(msg) +
      WHATSAPP_UTM
    );
  }

  /* ===================================================================
     2) DISPARO DE CONVERSÃO (pixels) — placeholders prontos
        Os snippets dos pixels estão comentados no index.html (<head>).
        Aqui só disparamos o EVENTO no clique de cada CTA do WhatsApp.
     =================================================================== */
  function trackConversion(label) {
    try {
      // Meta Pixel: evento "Contact" (lead que abre conversa).
      if (typeof window.fbq === "function") {
        window.fbq("track", "Contact", { content_name: label || "whatsapp" });
      }
      // Google (gtag): evento "generate_lead".
      if (typeof window.gtag === "function") {
        window.gtag("event", "generate_lead", { event_label: label || "whatsapp" });
      }
      // dataLayer (GTM) — fallback genérico.
      if (Array.isArray(window.dataLayer)) {
        window.dataLayer.push({ event: "whatsapp_click", cta_label: label || "whatsapp" });
      }
    } catch (e) {
      /* nunca bloquear o redirecionamento por causa do tracking */
    }
  }

  /* ===================================================================
     3) WIRING DOS BOTÕES DE WHATSAPP (.js-wa)
     =================================================================== */
  function wireWhatsappButtons() {
    var nodes = document.querySelectorAll(".js-wa");
    nodes.forEach(function (el) {
      var context = el.getAttribute("data-wa-context") || "hero";
      var label = el.getAttribute("data-track-label") || ("cta_" + context);
      var url = buildWhatsappUrl(context);

      if (el.tagName === "A") {
        el.setAttribute("href", url);
        el.setAttribute("target", "_blank");
        el.setAttribute("rel", "noopener");
      }
      el.addEventListener("click", function () {
        trackConversion(label);
        if (el.tagName !== "A") window.open(url, "_blank", "noopener");
      });
    });
  }

  /* ===================================================================
     4) BOTÃO FLUTUANTE — aparece após o primeiro scroll
     =================================================================== */
  function wireFloatingButton() {
    var floatBtn = document.getElementById("wa-float");
    if (!floatBtn) return;
    var visible = null; // força a 1ª aplicação
    function onScroll() {
      var shouldShow = window.scrollY > FLOAT_SHOW_AFTER;
      if (shouldShow === visible) return; // só mexe no DOM quando o estado muda
      visible = shouldShow;
      floatBtn.classList.toggle("is-visible", shouldShow);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ===================================================================
     5) FAQ — acordeão acessível e animado
        Fechado => atributo [hidden] (sai da árvore de acessibilidade).
        Aberto  => max-height anima a abertura.
     =================================================================== */
  function wireAccordion() {
    var items = Array.prototype.slice.call(document.querySelectorAll(".faq-item"));

    function openPanel(item, btn, panel) {
      item.setAttribute("aria-open", "true");
      btn.setAttribute("aria-expanded", "true");
      panel.hidden = false;               // volta para a árvore / display:block
      panel.style.maxHeight = "0px";      // ponto de partida explícito
      void panel.offsetHeight;            // reflow: garante o 0 antes de animar
      panel.style.maxHeight = panel.scrollHeight + "px";
    }

    function closePanel(item, btn, panel) {
      item.setAttribute("aria-open", "false");
      btn.setAttribute("aria-expanded", "false");
      panel.style.maxHeight = panel.scrollHeight + "px"; // garante valor em px
      void panel.offsetHeight;
      panel.style.maxHeight = "0px";
      var done = function (e) {
        if (e.target !== panel || e.propertyName !== "max-height") return;
        panel.removeEventListener("transitionend", done);
        // se o usuário reabriu durante a animação, não esconder
        if (btn.getAttribute("aria-expanded") === "false") panel.hidden = true;
      };
      panel.addEventListener("transitionend", done);
    }

    items.forEach(function (item) {
      var btn = item.querySelector(".faq-item__q");
      var panel = item.querySelector(".faq-item__a");
      if (!btn || !panel) return;
      btn.addEventListener("click", function () {
        var isOpen = btn.getAttribute("aria-expanded") === "true";
        if (isOpen) {
          closePanel(item, btn, panel);
          return;
        }
        // comportamento de acordeão: fecha os demais
        items.forEach(function (other) {
          if (other === item) return;
          var ob = other.querySelector(".faq-item__q");
          var op = other.querySelector(".faq-item__a");
          if (ob && op && ob.getAttribute("aria-expanded") === "true") closePanel(other, ob, op);
        });
        openPanel(item, btn, panel);
      });
    });

    // Recalcula a altura do item aberto se a janela mudar de tamanho/orientação
    // (evita que o conteúdo seja cortado pelo max-height fixo).
    var resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        items.forEach(function (item) {
          var btn = item.querySelector(".faq-item__q");
          var panel = item.querySelector(".faq-item__a");
          if (btn && panel && btn.getAttribute("aria-expanded") === "true" && !panel.hidden) {
            panel.style.maxHeight = panel.scrollHeight + "px";
          }
        });
      }, 150);
    }, { passive: true });
  }

  /* ===================================================================
     6) REVEAL ao rolar (IntersectionObserver) + count-up dos números
     =================================================================== */
  function wireReveal() {
    var revealEls = document.querySelectorAll(".reveal");

    function revealAll() {
      revealEls.forEach(function (el) {
        if (!el.classList.contains("is-in")) { el.classList.add("is-in"); runCounters(el); }
      });
    }

    // Sem IntersectionObserver: mostra tudo de uma vez (degrada com segurança).
    if (!("IntersectionObserver" in window)) { revealAll(); return; }

    // Rede de segurança: se o IO NUNCA entregar um callback (alguns webviews de
    // apps — Instagram/Facebook/WhatsApp — onde o anúncio abre — podem não
    // disparar), revelamos tudo para o conteúdo nunca ficar invisível.
    // Em navegadores saudáveis o IO entrega um callback inicial na hora, então
    // a animação ao rolar é preservada e este fallback não dispara.
    var ioDelivered = false;
    var io = new IntersectionObserver(function (entries, obs) {
      ioDelivered = true;
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        runCounters(entry.target);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });

    setTimeout(function () { if (!ioDelivered) revealAll(); }, 1500);
  }

  // Dispara o count-up para o próprio elemento (se tiver data-count) e/ou filhos.
  function runCounters(root) {
    var list = [];
    if (root.matches && root.matches("[data-count]")) list.push(root);
    if (root.querySelectorAll) {
      Array.prototype.forEach.call(root.querySelectorAll("[data-count]"), function (n) { list.push(n); });
    }
    list.forEach(countUp);
  }

  function countUp(el) {
    if (el.dataset.counted) return; // guarda contra disparo duplo
    var target = parseInt(el.getAttribute("data-count"), 10);
    if (isNaN(target)) return;
    el.dataset.counted = "1";
    var suffix = el.getAttribute("data-suffix") || "";
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) { el.textContent = target + suffix; return; }
    var dur = 1100, start = null;
    function tick(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ===================================================================
     7) CRONÔMETRO DE URGÊNCIA — conta FLASH_MINUTES a partir do load e
        REINICIA a cada carregamento da página (urgência por sessão).
     =================================================================== */
  function wireFlashCountdown() {
    var targets = [
      document.getElementById("flash-countdown"), // faixa do topo
      document.getElementById("promo-countdown")  // bloco da oferta
    ].filter(Boolean);
    if (!targets.length) return;

    var endAt = Date.now() + FLASH_MINUTES * 60 * 1000; // reinicia a cada load
    var timer = null;

    function pad(n) { return n < 10 ? "0" + n : "" + n; }
    function update() {
      var rem = Math.max(0, Math.round((endAt - Date.now()) / 1000));
      var text = pad(Math.floor(rem / 3600)) + ":" + pad(Math.floor((rem % 3600) / 60)) + ":" + pad(rem % 60);
      targets.forEach(function (el) { el.textContent = text; });
      if (rem <= 0 && timer) clearInterval(timer);
    }
    update();
    timer = setInterval(update, 1000);
  }

  /* ===================================================================
     INIT
     =================================================================== */
  function init() {
    wireWhatsappButtons();
    wireFloatingButton();
    wireAccordion();
    wireReveal();
    wireFlashCountdown();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
