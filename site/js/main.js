/* =============================================================
   Clínica Analice Sousa — interações
   GSAP + ScrollTrigger para animações, Lenis para scroll suave.
   ============================================================= */

(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  const header = document.querySelector('[data-header]');

  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  const headerOffset = () => (header ? header.offsetHeight : 0);

  /* ---------- Scroll suave (Lenis) ---------- */

  let lenis = null;

  if (!reduceMotion && typeof window.Lenis !== 'undefined') {
    lenis = new window.Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    if (hasGsap) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (time) => {
        lenis.raf(time);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);
    }
  }

  const scrollToTarget = (target) => {
    if (lenis) {
      lenis.scrollTo(target, { offset: target === 0 ? 0 : -headerOffset() + 1 });
    } else {
      const top = target === 0 ? 0 : target.getBoundingClientRect().top + window.scrollY - headerOffset();
      window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
    }
  };

  /* ---------- Menu mobile ---------- */

  const menuToggle = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-menu]');

  const setMenu = (open) => {
    if (!menuToggle || !menu) return;
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.querySelector('.visually-hidden').textContent = open ? 'Fechar menu' : 'Abrir menu';
    menu.hidden = !open;
    document.body.style.overflow = open ? 'hidden' : '';
    if (lenis) open ? lenis.stop() : lenis.start();

    if (open && hasGsap && !reduceMotion) {
      gsap.fromTo(menu.querySelectorAll('a'),
        { y: 16, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.05, ease: 'power3.out' });
    }
  };

  if (menuToggle && menu) {
    menu.setAttribute('data-lenis-prevent', '');
    menuToggle.addEventListener('click', () => {
      setMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        menuToggle.focus();
      }
    });
    window.matchMedia('(min-width: 961px)').addEventListener('change', (e) => {
      if (e.matches) setMenu(false);
    });
  }

  /* ---------- Links âncora ---------- */

  document.querySelectorAll('a[data-scroll-to]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      const target = id === '#topo' ? 0 : document.querySelector(id);
      if (target === null) return;
      e.preventDefault();
      setMenu(false);
      scrollToTarget(target);
      history.replaceState(null, '', id);
    });
  });

  /* ---------- Cabeçalho fixo: estado "rolado", barra de progresso e botão flutuante ---------- */

  const waFloat = document.querySelector('[data-wa-float]');
  const progress = document.querySelector('[data-scroll-progress]');
  const hero = document.querySelector('.hero');

  const onScroll = () => {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    header?.classList.toggle('is-scrolled', y > 8);
    if (progress) progress.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
    if (waFloat && hero) waFloat.classList.toggle('is-visible', y > hero.offsetHeight * 0.8);
  };

  if (lenis) lenis.on('scroll', onScroll);
  else window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Link ativo na navegação ---------- */

  const navLinks = [...document.querySelectorAll('.nav a')];
  if ('IntersectionObserver' in window && navLinks.length) {
    const byId = new Map(navLinks.map((a) => [a.getAttribute('href').slice(1), a]));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const link = byId.get(entry.target.id);
        if (link) link.classList.toggle('is-active', entry.isIntersecting);
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    byId.forEach((_, id) => {
      const section = document.getElementById(id);
      if (section) io.observe(section);
    });
  }

  /* ---------- FAQ (um item aberto por vez) ---------- */

  const faq = document.querySelector('[data-faq]');
  if (faq) {
    const triggers = [...faq.querySelectorAll('.faq__trigger')];

    const toggle = (trigger, open) => {
      const panel = document.getElementById(trigger.getAttribute('aria-controls'));
      if (!panel) return;
      trigger.setAttribute('aria-expanded', String(open));

      if (!hasGsap || reduceMotion) {
        panel.hidden = !open;
        return;
      }

      gsap.killTweensOf(panel);
      if (open) {
        panel.hidden = false;
        gsap.fromTo(panel, { height: 0, opacity: 0 }, {
          height: 'auto', opacity: 1, duration: 0.5, ease: 'power3.out',
          onComplete: () => { gsap.set(panel, { clearProps: 'height' }); ScrollTrigger.refresh(); },
        });
      } else {
        gsap.to(panel, {
          height: 0, opacity: 0, duration: 0.4, ease: 'power3.inOut',
          onComplete: () => { panel.hidden = true; gsap.set(panel, { clearProps: 'height,opacity' }); ScrollTrigger.refresh(); },
        });
      }
    };

    triggers.forEach((trigger) => {
      trigger.addEventListener('click', () => {
        const willOpen = trigger.getAttribute('aria-expanded') !== 'true';
        triggers.forEach((t) => {
          if (t !== trigger && t.getAttribute('aria-expanded') === 'true') toggle(t, false);
        });
        toggle(trigger, willOpen);
      });
    });

    // Primeiro item começa aberto, como na referência
    if (triggers[0]) {
      triggers[0].setAttribute('aria-expanded', 'true');
      document.getElementById(triggers[0].getAttribute('aria-controls')).hidden = false;
    }
  }

  /* ---------- Odômetro: monta as colunas de dígitos ---------- */

  const buildOdometer = (el) => {
    const value = el.dataset.odometer;
    el.textContent = '';
    el.setAttribute('aria-hidden', 'true');
    const label = document.createElement('span');
    label.className = 'visually-hidden';
    label.textContent = value;
    el.after(label);

    return [...value].map((char, i) => {
      const col = document.createElement('span');
      col.className = 'odometer__col';
      const strip = document.createElement('span');
      strip.className = 'odometer__strip';
      // Mais voltas nas primeiras colunas, para que todas "subam" antes de parar
      const cycles = Math.max(1, 3 - i);
      const digits = [];
      for (let c = 0; c < cycles; c++) for (let d = 0; d <= 9; d++) digits.push(d);
      for (let d = 0; d <= Number(char); d++) digits.push(d);
      digits.forEach((d) => {
        const s = document.createElement('span');
        s.textContent = d;
        strip.append(s);
      });
      col.append(strip);
      el.append(col);
      return { strip, steps: digits.length };
    });
  };

  /* ---------- Animações ---------- */

  const showHidden = () => {
    document.querySelectorAll('[data-hero-item], [data-hero-img], .hero__title, .seal, .hero__tag').forEach((el) => {
      el.style.visibility = 'visible';
    });
  };

  if (!hasGsap || reduceMotion) {
    showHidden();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Divide um título em linhas (sem plugin), preservando destaques (<em class>) e o texto para leitores de tela
  const splitLines = (el) => {
    const tokens = [];
    let prevEndsWithSpace = true;
    el.childNodes.forEach((node) => {
      const cls = node.nodeType === 1 ? node.className : '';
      const text = node.textContent;
      if (!text) return;
      const parts = text.split(/(\s+)/).filter((p) => p !== '');
      parts.forEach((part, idx) => {
        if (/^\s+$/.test(part)) return;
        // palavra colada à anterior (ex.: pontuação logo após um <em>)
        const joinPrev = idx === 0 && tokens.length > 0 && !prevEndsWithSpace;
        tokens.push({ text: part, cls, joinPrev });
      });
      prevEndsWithSpace = /\s$/.test(text);
    });

    el.setAttribute('aria-label', el.textContent.trim().replace(/\s+/g, ' '));
    el.textContent = '';

    const makeWord = (t) => {
      const span = document.createElement('span');
      span.textContent = t.text;
      if (t.cls) span.className = t.cls;
      return span;
    };

    const measured = tokens.map((t) => {
      const span = makeWord(t);
      span.style.display = 'inline-block';
      if (!t.joinPrev && el.childNodes.length) el.append(' ');
      el.append(span);
      return span;
    });

    const lines = [];
    let currentTop = null;
    measured.forEach((span, i) => {
      if (span.offsetTop !== currentTop && !tokens[i].joinPrev) {
        lines.push([]);
        currentTop = span.offsetTop;
      }
      lines[lines.length - 1].push(tokens[i]);
    });

    el.textContent = '';
    return lines.map((line) => {
      const outer = document.createElement('span');
      outer.className = 'split-line';
      outer.setAttribute('aria-hidden', 'true');
      const inner = document.createElement('span');
      inner.className = 'split-line__inner';
      line.forEach((t, i) => {
        if (i > 0 && !t.joinPrev) inner.append(' ');
        inner.append(makeWord(t));
      });
      outer.append(inner);
      el.append(outer);
      return inner;
    });
  };

  const init = () => {
    const mm = gsap.matchMedia();

    /* ----- Hero: cortina dourada revela a foto ----- */
    const heroTitle = document.querySelector('.hero__title');
    const heroLines = heroTitle ? splitLines(heroTitle) : [];
    const curtain = document.querySelector('[data-hero-curtain]');
    const imgWrap = document.querySelector('[data-hero-img]');
    const heroImg = imgWrap?.querySelector('img');
    const seal = document.querySelector('[data-seal]');
    const tag = document.querySelector('[data-hero-tag]');

    gsap.set([heroTitle, imgWrap, seal, tag, ...document.querySelectorAll('[data-hero-item]')], { visibility: 'visible' });

    const intro = gsap.timeline({ defaults: { ease: 'power4.out' } });
    intro
      .from(header, { yPercent: -100, duration: 0.9, clearProps: 'transform' }, 0)
      // 1. faixa dourada cobre a área da foto
      .fromTo(curtain, { scaleX: 0, transformOrigin: 'left center' }, { scaleX: 1, duration: 0.7, ease: 'expo.inOut' }, 0.05)
      // 2. a foto aparece por baixo e a faixa sai pela direita
      .fromTo(imgWrap, { clipPath: 'inset(0% 0% 0% 100%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'expo.inOut' }, 0.7)
      .set(curtain, { transformOrigin: 'right center' }, 0.75)
      .to(curtain, { scaleX: 0, duration: 1, ease: 'expo.inOut' }, 0.75)
      .fromTo(heroImg, { scale: 1.4 }, { scale: 1.1, duration: 2.2, ease: 'expo.out' }, 0.75)
      // 3. texto
      .from('.hero .eyebrow', { y: 16, autoAlpha: 0, duration: 0.8 }, 0.3)
      .from(heroLines, { yPercent: 110, duration: 1.1, stagger: 0.12 }, 0.4)
      .from('.hero__lead', { y: 24, autoAlpha: 0, duration: 0.9 }, 0.8)
      .from('.hero__actions', { y: 24, autoAlpha: 0, duration: 0.9 }, 0.95)
      .from('.hero__proof li', { y: 20, autoAlpha: 0, duration: 0.8, stagger: 0.08 }, 1.1)
      // 4. selo e etiqueta
      .from(seal, { scale: 0, rotate: -120, autoAlpha: 0, duration: 1.2, ease: 'back.out(1.6)' }, 1.4)
      .from(tag, { y: 30, autoAlpha: 0, duration: 0.9 }, 1.55);

    // Selo gira sempre; acelera com a velocidade da rolagem
    const sealRing = document.querySelector('[data-seal-ring]');
    const sealSpin = gsap.to(sealRing, { rotate: 360, duration: 18, ease: 'none', repeat: -1, transformOrigin: '50% 50%' });

    // Parallax leve da foto do hero ao rolar
    gsap.to(heroImg, {
      yPercent: 8, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    });

    /* ----- Brilho contínuo nos textos dourados ----- */
    gsap.to('.text-gold, .text-gold-dark', {
      backgroundPosition: '200% 0', duration: 6, ease: 'none', repeat: -1,
    });

    /* ----- Faixa de valores (marquee) ----- */
    const track = document.querySelector('[data-marquee-track]');
    let marquee;
    if (track) {
      [...track.children].forEach((child) => track.append(child.cloneNode(true)));
      marquee = gsap.to(track, { xPercent: -50, duration: 38, ease: 'none', repeat: -1 });
    }

    // Velocidade da rolagem influencia marquee e selo
    let direction = 1;
    ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 300, 5);
        if (self.direction !== direction) direction = self.direction;
        if (marquee) gsap.to(marquee, { timeScale: boost * direction, duration: 0.3, overwrite: true });
        gsap.to(sealSpin, { timeScale: boost, duration: 0.3, overwrite: true });
      },
    });
    ScrollTrigger.addEventListener('scrollEnd', () => {
      if (marquee) gsap.to(marquee, { timeScale: direction, duration: 1 });
      gsap.to(sealSpin, { timeScale: 1, duration: 1 });
    });

    /* ----- Títulos divididos em linhas fora do hero ----- */
    document.querySelectorAll('[data-split]:not(.hero__title)').forEach((el) => {
      const lines = splitLines(el);
      gsap.from(lines, {
        yPercent: 110, duration: 1.1, stagger: 0.08, ease: 'power4.out',
        scrollTrigger: { trigger: el, start: 'top 85%' },
      });
    });

    /* ----- Reveals ----- */
    gsap.utils.toArray('[data-reveal]').forEach((el) => {
      gsap.from(el, {
        y: 40, autoAlpha: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%' },
      });
    });

    gsap.utils.toArray('[data-reveal-group]').forEach((group) => {
      gsap.from(group.children, {
        y: 36, autoAlpha: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: group, start: 'top 85%' },
      });
    });

    gsap.utils.toArray('[data-reveal-media]').forEach((el) => {
      gsap.from(el, {
        clipPath: 'inset(100% 0% 0% 0% round 18px)', duration: 1.4, ease: 'expo.inOut',
        scrollTrigger: { trigger: el, start: 'top 85%' },
        onComplete: () => gsap.set(el, { clearProps: 'clipPath' }),
      });
    });

    gsap.utils.toArray('[data-parallax]').forEach((img) => {
      // data-zoom mantém o recorte aproximado definido no CSS (a transform do GSAP substitui a do CSS)
      const scale = Number(img.dataset.zoom || 1);
      gsap.fromTo(img, { yPercent: -6, scale }, {
        yPercent: 6, scale, ease: 'none',
        scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    });

    /* ----- Indicadores: números rolando para cima até o valor final ----- */
    gsap.utils.toArray('[data-odometer]').forEach((el, index) => {
      const cols = buildOdometer(el);
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 88%' } });
      cols.forEach(({ strip, steps }, i) => {
        tl.fromTo(strip, { yPercent: 0 }, {
          yPercent: -((steps - 1) / steps) * 100,
          duration: 1.8 + i * 0.35,
          ease: 'power3.inOut',
        }, (index % 4) * 0.12 + i * 0.08);
      });
    });

    /* ----- Método AS® ----- */
    const methodMark = document.querySelector('[data-method-mark]');
    if (methodMark) {
      gsap.fromTo(methodMark, { rotate: -14, scale: 0.8 }, {
        rotate: 8, scale: 1.05, ease: 'none',
        scrollTrigger: { trigger: '.method', start: 'top bottom', end: 'bottom top', scrub: true },
      });
    }
    // Pilares: texto sobe e a letra monumental entra desfocada, depois acompanha a rolagem
    gsap.utils.toArray('[data-pillar]').forEach((pillar, i) => {
      const letter = pillar.querySelector('.pillar__letter');
      gsap.timeline({ scrollTrigger: { trigger: pillar, start: 'top 80%' } })
        .from(letter, { autoAlpha: 0, scale: 1.25, filter: 'blur(12px)', duration: 1.6, ease: 'expo.out', delay: i * 0.15 })
        .from(pillar.querySelector('.pillar__body').children, { y: 30, autoAlpha: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out' }, '-=1.2');
      gsap.to(letter, {
        xPercent: i ? -8 : 8, ease: 'none',
        scrollTrigger: { trigger: pillar, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    });
    gsap.from('.pillars__amp', {
      scale: 0, rotate: -90, duration: 1.2, ease: 'back.out(1.7)',
      scrollTrigger: { trigger: '.pillars', start: 'top 70%' },
    });

    // Princípios: a linha dourada é desenhada e acende cada nó ao passar por ele
    const tenets = gsap.utils.toArray('[data-tenet]');
    const tenetsLine = document.querySelector('[data-tenets-line]');
    gsap.from(tenets, {
      y: 40, autoAlpha: 0, duration: 1, stagger: 0.12, ease: 'power3.out',
      scrollTrigger: { trigger: '[data-tenets]', start: 'top 80%' },
    });
    mm.add('(min-width: 1181px)', () => {
      gsap.fromTo(tenetsLine, { '--draw': 0 }, {
        '--draw': 1, ease: 'none',
        scrollTrigger: {
          trigger: '[data-tenets]', start: 'top 75%', end: 'bottom 55%', scrub: 0.6,
          onUpdate: (self) => tenets.forEach((t, i) => t.classList.toggle('is-on', self.progress >= i / tenets.length + 0.02)),
        },
      });
      return () => tenets.forEach((t) => t.classList.remove('is-on'));
    });
    mm.add('(max-width: 1180px)', () => {
      tenets.forEach((t) => ScrollTrigger.create({ trigger: t, start: 'top 75%', toggleClass: 'is-on' }));
    });

    /* ----- "Você se reconhece?": cada frase acende conforme chega ao centro da tela ----- */
    const counter = document.querySelector('[data-recognize-counter]');
    let counterTl;
    let counterLabel = counter ? counter.textContent : '';
    const setCounter = (label) => {
      if (!counter || counterLabel === label) return;
      counterLabel = label;
      counterTl?.kill();
      counterTl = gsap.timeline()
        .to(counter, { yPercent: -30, autoAlpha: 0, duration: 0.25, ease: 'power2.in' })
        .add(() => { counter.textContent = label; })
        .fromTo(counter, { yPercent: 30, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.45, ease: 'power3.out' });
    };
    gsap.utils.toArray('[data-recognize]').forEach((item, i, all) => {
      const label = item.querySelector('.recognize__num').textContent.trim();
      ScrollTrigger.create({
        trigger: item, start: 'top 55%', end: 'bottom 55%',
        onEnter: () => setCounter(label),
        onEnterBack: () => setCounter(label),
        onLeaveBack: () => { if (i === 0) setCounter(label); else setCounter(all[i - 1].querySelector('.recognize__num').textContent.trim()); },
      });
      const st = { trigger: item, start: 'top 82%', end: 'top 48%', scrub: 0.5 };
      gsap.fromTo(item.querySelector('.recognize__text'), { opacity: 0.16, x: -24 }, { opacity: 1, x: 0, ease: 'none', scrollTrigger: st });
      gsap.fromTo(item.querySelectorAll('.recognize__num, .recognize__icon'), { opacity: 0 }, { opacity: 1, ease: 'none', scrollTrigger: st });
      gsap.fromTo(item, { '--lit': 0 }, { '--lit': 1, ease: 'none', scrollTrigger: { ...st, start: 'top 70%', end: 'top 40%' } });
    });

    /* ----- Seringa desenhada ao rolar ----- */
    const syringe = document.querySelector('[data-syringe]');
    if (syringe) {
      const paths = syringe.querySelectorAll('path');
      gsap.set(paths, { strokeDasharray: 1, strokeDashoffset: 1 });
      gsap.timeline({ scrollTrigger: { trigger: syringe, start: 'top 85%', end: 'bottom 35%', scrub: 0.8 } })
        .to(paths[0], { strokeDashoffset: 0, ease: 'none' })
        .to(paths[1], { strokeDashoffset: 0, ease: 'none' }, '-=0.3')
        .to(paths[2], { strokeDashoffset: 0, ease: 'none' });
    }

    /* ----- Filetes das listas do protocolo ----- */
    gsap.utils.toArray('[data-rule]').forEach((rule) => {
      gsap.from(rule, {
        scaleX: 0, duration: 1.2, ease: 'expo.out',
        scrollTrigger: { trigger: rule, start: 'top 88%' },
      });
    });

    /* ----- Quem atende: moldura desliza e selo aparece ----- */
    gsap.from('.about__frame', {
      x: -28, y: -28, autoAlpha: 0, duration: 1.4, ease: 'expo.out',
      scrollTrigger: { trigger: '.about__media', start: 'top 75%' },
    });
    gsap.from('.about__badge', {
      x: 40, autoAlpha: 0, duration: 1, ease: 'power3.out', delay: 0.4,
      scrollTrigger: { trigger: '.about__media', start: 'top 70%' },
    });

    /* ----- Etapas: linha dourada acompanha o scroll e o número acende ----- */
    gsap.utils.toArray('.step').forEach((step) => {
      gsap.to(step, {
        '--progress': 1, ease: 'none',
        scrollTrigger: {
          trigger: step, start: 'top 80%', end: 'bottom 55%', scrub: 0.6,
          onToggle: (self) => step.classList.toggle('is-active', self.isActive || self.progress === 1),
          onLeave: () => step.classList.add('is-active'),
          onLeaveBack: () => step.classList.remove('is-active'),
        },
      });
      gsap.from(step.children, {
        y: 28, autoAlpha: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out',
        scrollTrigger: { trigger: step, start: 'top 85%' },
      });
    });

    const stepsMark = document.querySelector('[data-steps-mark]');
    if (stepsMark) {
      gsap.fromTo(stepsMark, { rotate: -8, yPercent: -40 }, {
        rotate: 6, yPercent: -60, ease: 'none',
        scrollTrigger: { trigger: '.steps', start: 'top bottom', end: 'bottom top', scrub: true },
      });
    }

    /* ----- Depoimentos: balões surgem como mensagens ----- */
    gsap.from('[data-chat]', {
      y: 50, scale: 0.92, autoAlpha: 0, transformOrigin: '0% 100%',
      duration: 0.9, stagger: 0.18, ease: 'back.out(1.4)',
      scrollTrigger: { trigger: '.testimonials', start: 'top 80%' },
    });

    /* ----- Chamada ----- */
    const ctaMark = document.querySelector('[data-cta-mark]');
    if (ctaMark) {
      gsap.fromTo(ctaMark, { rotate: -20, scale: 0.85 }, {
        rotate: 10, scale: 1.1, ease: 'none',
        scrollTrigger: { trigger: '.cta-band', start: 'top bottom', end: 'bottom top', scrub: true },
      });
    }

    /* ----- Mapa entra deslizando (só em telas largas) ----- */
    mm.add('(min-width: 961px)', () => {
      gsap.from('.contact__map', {
        clipPath: 'inset(0% 0% 0% 100%)', duration: 1.4, ease: 'expo.inOut',
        scrollTrigger: { trigger: '.contact', start: 'top 75%' },
      });
    });

    ScrollTrigger.refresh();
  };

  // Espera as fontes para medir as linhas corretamente
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(init);
  } else {
    window.addEventListener('load', init);
  }
})();
