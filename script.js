document.addEventListener('DOMContentLoaded', () => {

  /* ============ Preloader ============ */
  const preloader = document.getElementById('preloader');
  document.body.classList.add('no-scroll');
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
      document.body.classList.remove('no-scroll');
    }, 500);
  });
  // fallback in case load already fired
  setTimeout(() => {
    preloader.classList.add('hidden');
    document.body.classList.remove('no-scroll');
  }, 2500);

  /* ============ Custom cursor ============ */
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
  const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  if (!isTouch) {
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX; mouseY = e.clientY;
      cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%,-50%)`;
    });
    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%,-50%)`;
      requestAnimationFrame(animateRing);
    };
    animateRing();

    document.querySelectorAll('a, button, .project-card, .featured-project').forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('active'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('active'));
    });
  } else {
    cursorDot.style.display = 'none';
    cursorRing.style.display = 'none';
  }

  /* ============ Navbar ============ */
  const navbar = document.getElementById('navbar');
  const navLinks = document.getElementById('navLinks');
  const navToggle = document.getElementById('navToggle');

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navToggle.classList.toggle('active');
    document.body.classList.toggle('menu-open');
  });
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('active');
    document.body.classList.remove('menu-open');
  }));

  /* ============ Language switch ============ */
  const langSwitch = document.getElementById('langSwitch');
  const htmlEl = document.documentElement;

  const setLang = (lang) => {
    document.querySelectorAll('[data-fa][data-en]').forEach(el => {
      el.textContent = lang === 'fa' ? el.dataset.fa : el.dataset.en;
    });
    htmlEl.lang = lang === 'fa' ? 'fa' : 'en';
    htmlEl.dir = lang === 'fa' ? 'rtl' : 'ltr';
    document.body.classList.toggle('lang-fa', lang === 'fa');
    document.body.classList.toggle('lang-en', lang === 'en');
    localStorage.setItem('ra-lang', lang);
    startTyping(lang);
  };

  langSwitch.addEventListener('click', () => {
    const current = localStorage.getItem('ra-lang') || 'fa';
    setLang(current === 'fa' ? 'en' : 'fa');
  });

  /* ============ Typing animation ============ */
  const typedTextEl = document.getElementById('typedText');
  const phrasesFa = ['طراح وب', 'توسعه‌دهنده فرانت‌اند', 'توسعه‌دهنده وب', 'برنامه‌نویس', 'Frontend Engineer'];
  const phrasesEn = ['Web Designer', 'Frontend Developer', 'Web Developer', 'Programmer', 'Frontend Engineer'];

  let typingTimeout = null;
  let typingToken = 0;

  function startTyping(lang) {
    typingToken++;
    const myToken = typingToken;
    clearTimeout(typingTimeout);
    const phrases = lang === 'fa' ? phrasesFa : phrasesEn;
    let phraseIndex = 0, charIndex = 0, deleting = false;

    function tick() {
      if (myToken !== typingToken) return; // stopped, a newer cycle took over
      const current = phrases[phraseIndex];
      if (!deleting) {
        charIndex++;
        typedTextEl.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          typingTimeout = setTimeout(tick, 1600);
          return;
        }
        typingTimeout = setTimeout(tick, 85);
      } else {
        charIndex--;
        typedTextEl.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          typingTimeout = setTimeout(tick, 400);
          return;
        }
        typingTimeout = setTimeout(tick, 40);
      }
    }
    tick();
  }

  const savedLang = localStorage.getItem('ra-lang') || 'fa';
  setLang(savedLang);

  /* ============ Scroll reveal ============ */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('[data-animate]').forEach(el => revealObserver.observe(el));

  /* ============ Skill bars ============ */
  document.querySelectorAll('.skill-bar').forEach(bar => {
    const value = bar.dataset.value;
    const track = document.createElement('div');
    track.className = 'skill-track';
    const fill = document.createElement('div');
    fill.className = 'skill-fill';
    fill.style.width = '0%';
    track.appendChild(fill);
    bar.appendChild(track);
    bar.dataset.targetWidth = value + '%';
  });

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target.querySelector('.skill-fill');
        fill.style.width = entry.target.dataset.targetWidth;
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('.skill-bar').forEach(bar => skillObserver.observe(bar));

  /* ============ 3D tilt + parallax on portrait ============ */
  document.querySelectorAll('.portrait-frame').forEach(frame => {
    const img = frame.querySelector('.portrait-img');
    if (isTouch) return;
    frame.addEventListener('mousemove', (e) => {
      const rect = frame.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const rotateX = (-y * 12).toFixed(2);
      const rotateY = (x * 12).toFixed(2);
      img.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
    });
    frame.addEventListener('mouseleave', () => {
      img.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
    });
  });

  /* ============ Register service worker (PWA) ============ */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    });
  }

});
