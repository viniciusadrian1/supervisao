/* =====================================================================
   SUPERVISÃO 360 — script-b.js (Landing Page B / teste A/B)
   Tudo que você ajusta está no bloco CONFIG abaixo.
   ===================================================================== */
(function () {
  "use strict";

  /* ===================================================================
     CONFIG  —  ⚠️ AJUSTAR AQUI (e só aqui)
     =================================================================== */

  // ⚠️ AJUSTAR: número de WhatsApp da campanha (formato internacional, só dígitos).
  const WHATSAPP_PHONE = "5511978752367"; // número do BOT — (11) 97875-2367

  // ⚠️ AJUSTAR: UTM para diferenciar a variante no A/B (mesmos pixels da A).
  const WHATSAPP_UTM = ""; // ex.: "&utm_source=meta&utm_medium=cpc&utm_content=varianteB"

  // Mensagem-GATILHO: TODOS os botões enviam este texto. É ele que ATIVA o bot no
  // WhatsApp (o bot só inicia com esta mensagem; qualquer outra não o aciona, para não
  // atrapalhar o atendimento humano). ⚠️ Deve conter o TRIGGER_TEXT do bot.
  const WHATSAPP_BASE_MSG =
    "Olá! Vim pelo site e quero meu Tour Virtual 360º no Google Maps 🚀";

  // Todas as CTAs usam a mensagem-gatilho (atribuição do botão fica no Meta Pixel).
  const WHATSAPP_MSGS = {};

  // Cronômetro de urgência (em MINUTOS). Conta a partir do load e REINICIA a cada
  // reload (urgência por sessão). OBS: é urgência PERCEBIDA, não um prazo real.
  const FLASH_MINUTES = 60;

  // Limiar (px de rolagem) para mostrar o botão flutuante.
  const FLOAT_SHOW_AFTER = 300;

  /* ===================================================================
     1) LINK DO WHATSAPP — centralizado
     =================================================================== */
  function buildWhatsappUrl(context) {
    var msg = WHATSAPP_MSGS[context] || WHATSAPP_BASE_MSG;
    return "https://api.whatsapp.com/send?phone=" + WHATSAPP_PHONE +
           "&text=" + encodeURIComponent(msg) + WHATSAPP_UTM;
  }

  /* ===================================================================
     2) DISPARO DE CONVERSÃO (pixels) — placeholders prontos no <head>
     =================================================================== */
  function trackConversion(label) {
    try {
      if (typeof window.fbq === "function") window.fbq("track", "Contact", { content_name: label || "whatsapp" });
      if (typeof window.gtag === "function") window.gtag("event", "generate_lead", { event_label: label || "whatsapp" });
      if (Array.isArray(window.dataLayer)) window.dataLayer.push({ event: "whatsapp_click", cta_label: label || "whatsapp" });
    } catch (e) { /* nunca bloquear o redirecionamento por causa do tracking */ }
  }

  /* ===================================================================
     3) WIRING DOS BOTÕES DE WHATSAPP (.js-wa)
     =================================================================== */
  function wireWhatsappButtons() {
    document.querySelectorAll(".js-wa").forEach(function (el) {
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
    var visible = null;
    function onScroll() {
      var shouldShow = window.scrollY > FLOAT_SHOW_AFTER;
      if (shouldShow === visible) return;
      visible = shouldShow;
      floatBtn.classList.toggle("is-visible", shouldShow);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ===================================================================
     5) CRONÔMETRO DE URGÊNCIA — HH:MM:SS, conta FLASH_MINUTES a partir
        do load e REINICIA a cada carregamento (urgência por sessão).
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
    wireFlashCountdown();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
