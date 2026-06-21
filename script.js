/* =================================================================
   ANA CLAUDIA GOURMET  ·  script.js
   Sem dependências externas. Compatível com GitHub Pages.
================================================================= */
(function () {
  "use strict";

  /* ===============================================================
     ⚙️  CONFIGURAÇÕES RÁPIDAS  (edite só esta parte no futuro)
     ---------------------------------------------------------------
     • TOTAL_FOTOS: quantas fotos a galeria/feed devem carregar.
       As imagens ficam em /images com os nomes foto1.jpg, foto2.jpg…
       Para EXPANDIR a galeria (20, 30, 50 fotos), basta aumentar
       este número e adicionar os arquivos foto16.jpg, foto17.jpg…
       Nenhuma outra alteração no código é necessária.

     • INSTAGRAM_USER  e  INSTAGRAM_URL: usuário e link do perfil.
  =============================================================== */
  var TOTAL_FOTOS = 15;
  var PASTA_FOTOS = "images/";          // pasta das imagens
  var PREFIXO     = "foto";             // foto1.jpg, foto2.jpg, ...
  var EXTENSAO    = ".jpg";

  var INSTAGRAM_USER = "@instagram_da_empresa";        // ← troque pelo @ real
  var INSTAGRAM_URL  = "https://instagram.com/";       // ← troque pelo link real

  /* Atalhos */
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduzMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ===============================================================
     ANO DO RODAPÉ
  =============================================================== */
  var ano = $("#ano");
  if (ano) ano.textContent = new Date().getFullYear();

  /* ===============================================================
     IMAGENS QUEBRADAS → placeholder elegante
     (para <img> criados via JS; os do HTML já usam onerror inline)
  =============================================================== */
  function tratarFalha(img, rotulo) {
    img.addEventListener("error", function () {
      img.classList.add("img-fallback");
      img.dataset.label = rotulo || "Foto";
      img.removeAttribute("src"); // evita ícone de quebrado
    });
  }

  /* ===============================================================
     NAVEGAÇÃO: sombra ao rolar + menu mobile
  =============================================================== */
  var nav    = $(".nav");
  var toggle = $(".nav__toggle");
  var menu   = $("#menu");

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var aberto = menu.classList.toggle("is-open");
      toggle.classList.toggle("is-open", aberto);
      toggle.setAttribute("aria-expanded", String(aberto));
      toggle.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
    });
    // fecha o menu ao clicar em um link
    $$(".nav__menu a").forEach(function (a) {
      a.addEventListener("click", function () {
        menu.classList.remove("is-open");
        toggle.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ===============================================================
     GALERIA — carrossel infinito com auto-scroll e arraste
  =============================================================== */
  var track    = $("#carouselTrack");
  var carousel = $("#carousel");

  function criarSlide(n) {
    var fig = document.createElement("div");
    fig.className = "slide";
    var img = document.createElement("img");
    img.src = PASTA_FOTOS + PREFIXO + n + EXTENSAO;
    img.alt = "Criação Ana Claudia Gourmet " + n;
    img.loading = "lazy";
    img.width = 320; img.height = 400;
    tratarFalha(img, "foto" + n + EXTENSAO);
    fig.appendChild(img);
    return fig;
  }

  if (track && carousel) {
    // monta um conjunto completo de slides (1..TOTAL_FOTOS)
    function montarConjunto() {
      var frag = document.createDocumentFragment();
      for (var i = 1; i <= TOTAL_FOTOS; i++) frag.appendChild(criarSlide(i));
      return frag;
    }
    // dois conjuntos idênticos = loop infinito contínuo, sem "saltos"
    track.appendChild(montarConjunto());
    track.appendChild(montarConjunto());

    var pausado = false;
    var velocidade = 0.55; // px por frame (≈ 33px/s) — ajuste se quiser

    // auto-scroll suave; ao passar da metade, volta sem perceber (loop infinito)
    function passo() {
      if (!pausado && !reduzMovimento) {
        carousel.scrollLeft += velocidade;
        var metade = track.scrollWidth / 2;
        if (carousel.scrollLeft >= metade) carousel.scrollLeft -= metade;
      }
      requestAnimationFrame(passo);
    }
    requestAnimationFrame(passo);

    // pausa no hover (desktop)
    carousel.addEventListener("mouseenter", function () { pausado = true; });
    carousel.addEventListener("mouseleave", function () { pausado = false; });

    /* ---- Arraste com o dedo (touch) e com o mouse (pointer) ---- */
    var arrastando = false, xInicial = 0, scrollInicial = 0, moveu = false;

    carousel.addEventListener("pointerdown", function (e) {
      arrastando = true; moveu = false;
      xInicial = e.clientX;
      scrollInicial = carousel.scrollLeft;
      pausado = true;
      carousel.classList.add("is-dragging");
    });
    window.addEventListener("pointermove", function (e) {
      if (!arrastando) return;
      var dx = e.clientX - xInicial;
      if (Math.abs(dx) > 4) moveu = true;
      carousel.scrollLeft = scrollInicial - dx;
    });
    window.addEventListener("pointerup", function () {
      if (!arrastando) return;
      arrastando = false;
      carousel.classList.remove("is-dragging");
      // retoma o movimento automático pouco depois de soltar
      setTimeout(function () { pausado = false; }, 900);
    });
    // evita que o "arraste" dispare cliques acidentais
    carousel.addEventListener("click", function (e) {
      if (moveu) { e.preventDefault(); e.stopPropagation(); }
    }, true);
  }

  /* ===============================================================
     SEÇÃO DA CHEF — enfeites no hover/foco/toque
  =============================================================== */
  var chef = $(".chef");
  if (chef) {
    var liga  = function () { chef.classList.add("is-active"); };
    var desliga = function () { chef.classList.remove("is-active"); };
    chef.addEventListener("mouseenter", liga);
    chef.addEventListener("mouseleave", desliga);
    chef.addEventListener("focus", liga);
    chef.addEventListener("blur", desliga);
    // toque no celular: alterna os enfeites
    chef.addEventListener("touchstart", function () { chef.classList.toggle("is-active"); }, { passive: true });
  }

  /* ===============================================================
     INSTAGRAM — feed + usuário + link configuráveis
  =============================================================== */
  var igFeed   = $("#igFeed");
  var igHandle = $("#igHandle");
  var igButton = $("#igButton");

  if (igHandle) igHandle.textContent = INSTAGRAM_USER;
  if (igButton) igButton.href = INSTAGRAM_URL;

  if (igFeed) {
    // mostra até 6 imagens da galeria como mini-feed
    var totalFeed = Math.min(6, TOTAL_FOTOS);
    for (var k = 1; k <= totalFeed; k++) {
      var cell = document.createElement("a");
      cell.className = "ig-cell";
      cell.href = INSTAGRAM_URL;
      cell.target = "_blank";
      cell.rel = "noopener";
      cell.setAttribute("aria-label", "Abrir Instagram");

      var im = document.createElement("img");
      im.src = PASTA_FOTOS + PREFIXO + k + EXTENSAO;
      im.alt = "Publicação " + k;
      im.loading = "lazy";
      tratarFalha(im, "foto" + k + EXTENSAO);

      var ico = document.createElement("span");
      ico.className = "ig-cell__ico";
      ico.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10m0 8.2A3.2 3.2 0 1 1 12 8.8a3.2 3.2 0 0 1 0 6.4M17.3 6.7a1.15 1.15 0 1 1-2.3 0 1.15 1.15 0 0 1 2.3 0M3 7.2C3 5 4.9 3 7.2 3h9.6C19 3 21 5 21 7.2v9.6c0 2.3-2 4.2-4.2 4.2H7.2C5 21 3 19.1 3 16.8z"/></svg>';

      cell.appendChild(im);
      cell.appendChild(ico);
      igFeed.appendChild(cell);
    }
  }

  /* ===============================================================
     SCROLL REVEAL — entrada suave dos elementos
  =============================================================== */
  var alvos = $$(".reveal");
  if ("IntersectionObserver" in window && !reduzMovimento) {
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("is-visible");
          obs.unobserve(en.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
    alvos.forEach(function (el) { obs.observe(el); });
  } else {
    alvos.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ===============================================================
     PARTÍCULAS DOURADAS (atmosfera)
  =============================================================== */
  var sparkles = $(".sparkles");
  if (sparkles && !reduzMovimento) {
    var QTD = window.innerWidth < 600 ? 10 : 18;
    for (var p = 0; p < QTD; p++) {
      var s = document.createElement("span");
      var size = 3 + Math.random() * 5;
      s.style.left = Math.random() * 100 + "vw";
      s.style.width = s.style.height = size + "px";
      s.style.animationDuration = 9 + Math.random() * 12 + "s";
      s.style.animationDelay = -Math.random() * 15 + "s";
      sparkles.appendChild(s);
    }
  }

  /* ===============================================================
     EFEITO PRINCIPAL — COBERTURA QUE ESCORRE + PARALLAX
     Um único listener de scroll, com throttle via requestAnimationFrame,
     mantém o desempenho alto (60fps) no PC e no celular.
  =============================================================== */
  var hero     = $(".hero");
  var frosting = $(".frosting");
  var heroInner = $(".hero__inner");
  var ticking  = false;

  function aoRolar() {
    var y = window.pageYOffset || document.documentElement.scrollTop;

    // sombra/compactação da navbar
    if (nav) nav.classList.toggle("is-scrolled", y > 30);

    if (hero) {
      var alturaHero = hero.offsetHeight;
      // progresso de 0 a 1 ao longo do hero
      var prog = Math.min(1, Math.max(0, y / (alturaHero * 0.8)));

      // 1) a cobertura "derrete": estica os pingos
      if (frosting) frosting.style.setProperty("--drip", prog.toFixed(3));

      // 2) parallax leve do conteúdo do hero (sem pesar)
      if (heroInner && !reduzMovimento) {
        heroInner.style.transform = "translateY(" + (y * 0.18) + "px)";
        heroInner.style.opacity = String(Math.max(0, 1 - prog * 1.1));
      }
    }
    ticking = false;
  }

  window.addEventListener("scroll", function () {
    if (!ticking) {
      window.requestAnimationFrame(aoRolar);
      ticking = true;
    }
  }, { passive: true });

  aoRolar(); // estado inicial
})();
