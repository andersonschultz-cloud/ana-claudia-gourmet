/* =================================================================
   ANA CLAUDIA GOURMET · script.js (versão premium)
   Vanilla JS, sem dependências. Compatível com GitHub Pages.
================================================================= */
(function () {
  "use strict";

  /* ===============================================================
     ⚙️ CONFIGURAÇÕES RÁPIDAS (edite só aqui no futuro)
     • TOTAL_FOTOS: nº de imagens em /images (foto1.jpg, foto2.jpg…).
       Para EXPANDIR a galeria, aumente o número e adicione os
       arquivos foto16.jpg, foto17.jpg… Nada mais precisa mudar.
  =============================================================== */
  var TOTAL_FOTOS    = 15;
  var PASTA_FOTOS    = "images/";
  var PREFIXO        = "foto";
  var EXTENSAO       = ".jpg";
  var INSTAGRAM_USER = "@aclaudiagourmet";
  var INSTAGRAM_URL  = "https://www.instagram.com/aclaudiagourmet?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==";

  /* atalhos + flags */
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var REDUZ = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var FINE  = window.matchMedia("(pointer: fine)").matches;
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };

  /* ===============================================================
     PRELOADER + ENTRADA CINEMATOGRÁFICA
  =============================================================== */
  function iniciar() {
    document.body.classList.add("is-loaded");
    var pre = $("#preloader");
    if (pre) { pre.classList.add("is-done"); setTimeout(function () { pre.remove(); }, 900); }
  }
  window.addEventListener("load", function () { setTimeout(iniciar, 350); });
  // fallback caso 'load' demore
  setTimeout(function () { if (!document.body.classList.contains("is-loaded")) iniciar(); }, 2500);

  var ano = $("#ano"); if (ano) ano.textContent = new Date().getFullYear();

  /* ===============================================================
     IMAGENS QUEBRADAS → placeholder elegante
  =============================================================== */
  function tratarFalha(img, rotulo) {
    img.addEventListener("error", function () {
      img.classList.add("img-fallback"); img.dataset.label = rotulo || "Foto"; img.removeAttribute("src");
    });
  }

  /* ===============================================================
     NAV: fundo ao rolar + menu mobile
  =============================================================== */
  var nav = $(".nav"), toggle = $(".nav__toggle"), menu = $("#menu");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var aberto = menu.classList.toggle("is-open");
      document.documentElement.classList.toggle("no-scroll", aberto);
      toggle.classList.toggle("is-open", aberto);
      toggle.setAttribute("aria-expanded", String(aberto));
    });
    $$(".nav__menu a").forEach(function (a) {
      a.addEventListener("click", function () { menu.classList.remove("is-open"); toggle.classList.remove("is-open"); document.documentElement.classList.remove("no-scroll"); });
    });
  }

  /* ===============================================================
     REVEAL (entradas com variações) + stagger + glow-on-enter
  =============================================================== */
  $$(".cards, .dif-grid").forEach(function (grid) {
    $$(".reveal", grid).forEach(function (el, i) { el.style.setProperty("--i", i % 4); });
  });
  if ("IntersectionObserver" in window) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("is-visible");
          var g = en.target.querySelector ? en.target.querySelector(".glow-on-enter") : null;
          if (en.target.classList.contains("glow-on-enter")) en.target.classList.add("lit");
          if (g) g.classList.add("lit");
          obs.unobserve(en.target);
        }
      });
    }, { threshold: 0.16, rootMargin: "0px 0px -7% 0px" });
    $$(".reveal").forEach(function (el) { obs.observe(el); });
    $$(".glow-on-enter").forEach(function (el) { if (!el.closest(".reveal")) obs.observe(el); });
  } else {
    $$(".reveal").forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ===============================================================
     CONTADORES (data-count) — animam ao entrarem na tela
  =============================================================== */
  function animarContador(el) {
    var alvo = parseFloat(el.dataset.count), suf = el.dataset.suffix || "", dur = 1500, t0 = null;
    function frame(t) {
      if (!t0) t0 = t;
      var p = clamp((t - t0) / dur, 0, 1), eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(alvo * eased) + suf;
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  if ("IntersectionObserver" in window) {
    var obsC = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { animarContador(e.target); obsC.unobserve(e.target); } });
    }, { threshold: 0.6 });
    $$("[data-count]").forEach(function (el) { obsC.observe(el); });
  } else {
    $$("[data-count]").forEach(function (el) { el.textContent = el.dataset.count + (el.dataset.suffix || ""); });
  }

  /* ===============================================================
     GALERIA: carrossel infinito + arraste + lightbox
  =============================================================== */
  var track = $("#carouselTrack"), carousel = $("#carousel");
  var fotos = [];
  for (var f = 1; f <= TOTAL_FOTOS; f++) fotos.push(PASTA_FOTOS + PREFIXO + f + EXTENSAO);

  function criarSlide(n) {
    var d = document.createElement("div"); d.className = "slide"; d.dataset.idx = (n - 1);
    var img = document.createElement("img");
    img.src = fotos[n - 1]; img.alt = "Criação Ana Claudia Gourmet " + n; img.loading = "lazy";
    tratarFalha(img, "foto" + n + EXTENSAO);
    var z = document.createElement("span"); z.className = "slide__zoom";
    z.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4M11 8v6M8 11h6"/></svg>';
    d.appendChild(img); d.appendChild(z);
    return d;
  }
  if (track && carousel) {
    function conjunto() { var fr = document.createDocumentFragment(); for (var i = 1; i <= TOTAL_FOTOS; i++) fr.appendChild(criarSlide(i)); return fr; }
    track.appendChild(conjunto()); track.appendChild(conjunto());

    var pausado = false, vel = 0.5, arr = false, x0 = 0, sl0 = 0, moveu = false;
    function passo() {
      if (!pausado && !REDUZ) {
        carousel.scrollLeft += vel;
        var metade = track.scrollWidth / 2;
        if (carousel.scrollLeft >= metade) carousel.scrollLeft -= metade;
      }
      requestAnimationFrame(passo);
    }
    requestAnimationFrame(passo);
    carousel.addEventListener("mouseenter", function () { pausado = true; });
    carousel.addEventListener("mouseleave", function () { if (!arr) pausado = false; });
    carousel.addEventListener("pointerdown", function (e) { arr = true; moveu = false; x0 = e.clientX; sl0 = carousel.scrollLeft; pausado = true; carousel.classList.add("is-dragging"); });
    window.addEventListener("pointermove", function (e) { if (!arr) return; var dx = e.clientX - x0; if (Math.abs(dx) > 4) moveu = true; carousel.scrollLeft = sl0 - dx; });
    window.addEventListener("pointerup", function () { if (!arr) return; arr = false; carousel.classList.remove("is-dragging"); setTimeout(function () { pausado = false; }, 800); });

    // abre lightbox ao clicar (se não estava arrastando)
    carousel.addEventListener("click", function (e) {
      if (moveu) return;
      var s = e.target.closest(".slide"); if (!s) return;
      abrirLightbox(parseInt(s.dataset.idx, 10));
    });
  }

  /* Lightbox */
  var lb = $("#lightbox"), lbImg = $("#lightboxImg"), lbIdx = 0;
  function abrirLightbox(i) {
    if (!lb) return; lbIdx = i; lbImg.src = fotos[i]; lbImg.alt = "Foto " + (i + 1);
    lb.classList.add("is-open"); lb.setAttribute("aria-hidden", "false"); document.documentElement.classList.add("no-scroll");
  }
  function fecharLightbox() { if (lb) { lb.classList.remove("is-open"); lb.setAttribute("aria-hidden", "true"); document.documentElement.classList.remove("no-scroll"); } }
  function navLightbox(d) { lbIdx = (lbIdx + d + fotos.length) % fotos.length; lbImg.src = fotos[lbIdx]; lbImg.alt = "Foto " + (lbIdx + 1); }
  if (lb) {
    $(".lightbox__close", lb).addEventListener("click", fecharLightbox);
    $(".lightbox__next", lb).addEventListener("click", function () { navLightbox(1); });
    $(".lightbox__prev", lb).addEventListener("click", function () { navLightbox(-1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) fecharLightbox(); });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("is-open")) return;
      if (e.key === "Escape") fecharLightbox();
      if (e.key === "ArrowRight") navLightbox(1);
      if (e.key === "ArrowLeft") navLightbox(-1);
    });
  }

  /* ===============================================================
     DEPOIMENTOS: slider automático + dots + swipe
  =============================================================== */
  var depTrack = $("#depTrack"), depDots = $("#depDots");
  if (depTrack && depDots) {
    var itens = $$(".dep__item", depTrack), atual = 0, timer;
    itens.forEach(function (_, i) {
      var b = document.createElement("button"); b.setAttribute("aria-label", "Depoimento " + (i + 1));
      if (i === 0) b.classList.add("is-active");
      b.addEventListener("click", function () { irPara(i); reiniciar(); });
      depDots.appendChild(b);
    });
    function irPara(i) {
      atual = (i + itens.length) % itens.length;
      depTrack.style.transform = "translateX(" + (-atual * 100) + "%)";
      $$("button", depDots).forEach(function (b, j) { b.classList.toggle("is-active", j === atual); });
    }
    function proximo() { irPara(atual + 1); }
    function reiniciar() { clearInterval(timer); if (!REDUZ) timer = setInterval(proximo, 5500); }
    reiniciar();
    var dep = $("#dep");
    dep.addEventListener("mouseenter", function () { clearInterval(timer); });
    dep.addEventListener("mouseleave", reiniciar);
    var sx = 0;
    dep.addEventListener("pointerdown", function (e) { sx = e.clientX; });
    dep.addEventListener("pointerup", function (e) { var dx = e.clientX - sx; if (Math.abs(dx) > 50) { irPara(atual + (dx < 0 ? 1 : -1)); reiniciar(); } });
  }

  /* ===============================================================
     INSTAGRAM: feed + usuário + link
  =============================================================== */
  var igFeed = $("#igFeed"), igHandle = $("#igHandle"), igButton = $("#igButton");
  if (igHandle) igHandle.textContent = INSTAGRAM_USER;
  if (igButton) igButton.href = INSTAGRAM_URL;
  if (igFeed) {
    var n = Math.min(6, TOTAL_FOTOS);
    for (var k = 1; k <= n; k++) {
      var a = document.createElement("a"); a.className = "ig-cell"; a.href = INSTAGRAM_URL; a.target = "_blank"; a.rel = "noopener"; a.setAttribute("aria-label", "Abrir Instagram");
      var im = document.createElement("img"); im.src = fotos[k - 1]; im.alt = "Publicação " + k; im.loading = "lazy"; tratarFalha(im, "foto" + k + EXTENSAO);
      var ic = document.createElement("span"); ic.className = "ig-cell__ico";
      ic.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10m0 8.2A3.2 3.2 0 1 1 12 8.8a3.2 3.2 0 0 1 0 6.4M17.3 6.7a1.15 1.15 0 1 1-2.3 0 1.15 1.15 0 0 1 2.3 0M3 7.2C3 5 4.9 3 7.2 3h9.6C19 3 21 5 21 7.2v9.6c0 2.3-2 4.2-4.2 4.2H7.2C5 21 3 19.1 3 16.8z"/></svg>';
      a.appendChild(im); a.appendChild(ic); igFeed.appendChild(a);
    }
  }

  /* ===============================================================
     TILT 3D + GLARE (cards e foto da chef) — só ponteiro fino
  =============================================================== */
  if (FINE && !REDUZ) {
    $$("[data-tilt]").forEach(function (el) {
      var alvo = el.classList.contains("card") ? el : ($(".chef__frame", el) || el);
      var glare = el.classList.contains("card") ? (function () { var g = document.createElement("span"); g.className = "card__glare"; el.appendChild(g); return g; })() : $(".chef__shine", el);
      var rid = null, rx = 0, ry = 0, mx = 50, my = 50, max = el.classList.contains("card") ? 8 : 5;
      function render() {
        alvo.style.transform = "perspective(900px) rotateX(" + rx + "deg) rotateY(" + ry + "deg)";
        if (glare) { glare.style.setProperty("--mx", mx + "%"); glare.style.setProperty("--my", my + "%"); }
        rid = null;
      }
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        ry = (px - 0.5) * max * 2; rx = -(py - 0.5) * max * 2; mx = px * 100; my = py * 100;
        if (!rid) rid = requestAnimationFrame(render);
      });
      el.addEventListener("pointerleave", function () { alvo.style.transform = ""; });
    });
  }

  /* ===============================================================
     BOTÕES MAGNÉTICOS (.magnetic) — atraídos pelo cursor
  =============================================================== */
  if (FINE && !REDUZ) {
    $$(".magnetic").forEach(function (el) {
      var rid = null, tx = 0, ty = 0;
      function render() { el.style.transform = "translate(" + tx + "px," + ty + "px)"; rid = null; }
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect();
        tx = (e.clientX - (r.left + r.width / 2)) * 0.25; ty = (e.clientY - (r.top + r.height / 2)) * 0.35;
        if (!rid) rid = requestAnimationFrame(render);
      });
      el.addEventListener("pointerleave", function () { tx = ty = 0; el.style.transform = ""; });
    });
  }

  /* ===============================================================
     SPOTLIGHT (luz que segue o cursor) — desktop
  =============================================================== */
  var spot = $("#spotlight");
  if (spot && FINE && !REDUZ) {
    document.body.classList.add("has-pointer");
    var sxp = 0, syp = 0, rs = null;
    function rspot() { spot.style.transform = "translate(" + sxp + "px," + syp + "px)"; rs = null; }
    window.addEventListener("pointermove", function (e) { sxp = e.clientX; syp = e.clientY; if (!rs) rs = requestAnimationFrame(rspot); }, { passive: true });
  }

  /* ===============================================================
     GRANULADO CAINDO (canvas) — sutil, sensível ao scroll
  =============================================================== */
  var canvas, ctx, parts = [], W = 0, H = 0, DPR = Math.min(window.devicePixelRatio || 1, 2);
  var paleta = ["#c2906c", "#e0b89c", "#97a791", "#f6f2ea", "#c98e84"];
  var MAXP = window.innerWidth < 700 ? 26 : 52;
  var scrollBoost = 0, lastY = window.pageYOffset, visivel = true;

  function novaParticula(top) {
    return { x: Math.random() * W, y: top ? -10 : Math.random() * H,
      s: 2 + Math.random() * 3, vy: 0.3 + Math.random() * 0.6, vx: (Math.random() - 0.5) * 0.3,
      rot: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.05,
      col: paleta[(Math.random() * paleta.length) | 0], a: 0.5 + Math.random() * 0.4 };
  }
  function initCanvas() {
    if (REDUZ) return;
    canvas = document.createElement("canvas"); canvas.id = "granulado";
    canvas.style.pointerEvents = "none";          // nunca captura mouse/roda
    canvas.setAttribute("aria-hidden", "true");
    document.body.appendChild(canvas);
    ctx = canvas.getContext("2d"); redimensionar();
    for (var i = 0; i < MAXP; i++) parts.push(novaParticula(false));
    requestAnimationFrame(loopCanvas);
  }
  function redimensionar() {
    if (!canvas) return; W = window.innerWidth; H = window.innerHeight;
    canvas.width = W * DPR; canvas.height = H * DPR; canvas.style.width = W + "px"; canvas.style.height = H + "px";
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  function loopCanvas() {
    requestAnimationFrame(loopCanvas);
    if (!ctx || !visivel) return;
    ctx.clearRect(0, 0, W, H);
    var extra = 1 + scrollBoost * 4;
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i];
      p.y += p.vy * extra; p.x += p.vx + scrollBoost * 0.6; p.rot += p.vr;
      if (p.y > H + 10) { parts[i] = novaParticula(true); continue; }
      ctx.save(); ctx.globalAlpha = p.a; ctx.translate(p.x, p.y); ctx.rotate(p.rot);
      ctx.fillStyle = p.col;
      roundRect(ctx, -p.s, -p.s / 2.2, p.s * 2, p.s / 1.1, p.s / 2.2); ctx.fill();
      ctx.restore();
    }
    scrollBoost *= 0.9; // decai suavemente
  }
  function roundRect(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
  document.addEventListener("visibilitychange", function () { visivel = !document.hidden; });
  window.addEventListener("resize", redimensionar);
  initCanvas();

  /* ===============================================================
     LOOP DE SCROLL ÚNICO: progresso, nav, parallax, velas
  =============================================================== */
  var bar = $("#progressBar");
  var heroLayers = $$(".hero__inner[data-depth]"); // scroll move só o conteúdo do hero
  var candlesEl = $("#candles");
  var velas = $$("#candles .candle");
  var ticking = false;

  function aoRolar() {
    var y = window.pageYOffset || document.documentElement.scrollTop;
    var docH = document.documentElement.scrollHeight - window.innerHeight;

    // velocidade de scroll → mais granulado
    var dy = Math.abs(y - lastY); scrollBoost = clamp(scrollBoost + dy * 0.012, 0, 1.4); lastY = y;

    // barra de progresso
    if (bar) bar.style.width = (docH > 0 ? (y / docH) * 100 : 0) + "%";

    // nav
    if (nav) nav.classList.toggle("is-scrolled", y > 30);

    // parallax das camadas do hero (apenas enquanto visível)
    if (!REDUZ && y < window.innerHeight * 1.2) {
      for (var i = 0; i < heroLayers.length; i++) {
        var d = parseFloat(heroLayers[i].dataset.depth) || 0;
        heroLayers[i].style.transform = "translate3d(0," + (y * d) + "px,0)";
      }
    }

    // VELAS acendem uma a uma conforme o bolo sobe na tela
    if (candlesEl && velas.length) {
      var cr = candlesEl.getBoundingClientRect(), vh = window.innerHeight;
      // 0 quando as velas surgem na base; 1 quando sobem até ~35% da tela
      var p = clamp((vh * 0.92 - cr.top) / (vh * 0.55), 0, 1);
      var acesas = Math.round(p * velas.length);
      for (var c = 0; c < velas.length; c++) velas[c].classList.toggle("is-lit", c < acesas);
    }
    ticking = false;
  }
  window.addEventListener("scroll", function () { if (!ticking) { requestAnimationFrame(aoRolar); ticking = true; } }, { passive: true });

  /* parallax suave com o mouse no hero (desktop) */
  if (FINE && !REDUZ) {
    var hero = $(".hero");
    if (hero) hero.addEventListener("pointermove", function (e) {
      var cx = (e.clientX / window.innerWidth - 0.5), cy = (e.clientY / window.innerHeight - 0.5);
      $$(".hero__layers [data-depth]").forEach(function (el) {
        var d = parseFloat(el.dataset.depth) || 0;
        el.style.transform = "translate3d(" + (cx * d * -60) + "px," + (cy * d * -40) + "px,0)";
      });
    });
  }

  aoRolar();
})();
