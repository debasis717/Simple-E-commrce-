/* ============================================================
   LUXORA – MAIN JAVASCRIPT
   All interactions: preloader, cursor, navbar, hero slider,
   counter animation, portfolio filter, testimonial slider,
   scroll animations (AOS), contact form, scroll-to-top
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* =====================
     PRELOADER
  ===================== */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
      document.body.style.overflow = '';
    }, 1200);
  });
  document.body.style.overflow = 'hidden';


  /* =====================
     CUSTOM CURSOR
  ===================== */
  const dot = document.getElementById('cursor-dot');
  const outline = document.getElementById('cursor-outline');
  let mouseX = 0, mouseY = 0;
  let outlineX = 0, outlineY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
  });

  // Smooth outline following
  function animateOutline() {
    outlineX += (mouseX - outlineX) * 0.1;
    outlineY += (mouseY - outlineY) * 0.1;
    outline.style.left = outlineX + 'px';
    outline.style.top = outlineY + 'px';
    requestAnimationFrame(animateOutline);
  }
  animateOutline();

  // Cursor states
  const hoverTargets = document.querySelectorAll('a, button, .portfolio-item, .team-card, .service-card, .feature-card');
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.style.transform = 'translate(-50%, -50%) scale(1.8)';
      outline.style.transform = 'translate(-50%, -50%) scale(1.4)';
      outline.style.opacity = '0.3';
    });
    el.addEventListener('mouseleave', () => {
      dot.style.transform = 'translate(-50%, -50%) scale(1)';
      outline.style.transform = 'translate(-50%, -50%) scale(1)';
      outline.style.opacity = '0.7';
    });
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    outline.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity = '1';
    outline.style.opacity = '0.7';
  });


  /* =====================
     NAVBAR
  ===================== */
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveLink();
  });

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navMenu.classList.toggle('open');
    document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Active link on scroll
  function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 100;
      if (window.scrollY >= top) current = section.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) link.classList.add('active');
    });
  }


  /* =====================
     SEARCH OVERLAY
  ===================== */
  const searchToggle = document.getElementById('searchToggle');
  const searchOverlay = document.getElementById('searchOverlay');
  const searchClose = document.getElementById('searchClose');

  searchToggle.addEventListener('click', () => {
    searchOverlay.classList.add('active');
    setTimeout(() => searchOverlay.querySelector('.search-input').focus(), 300);
  });
  searchClose.addEventListener('click', () => searchOverlay.classList.remove('active'));
  searchOverlay.addEventListener('click', (e) => {
    if (e.target === searchOverlay) searchOverlay.classList.remove('active');
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') searchOverlay.classList.remove('active');
  });


  /* =====================
     HERO SLIDER
  ===================== */
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.dot');
  const heroPrev = document.getElementById('heroPrev');
  const heroNext = document.getElementById('heroNext');
  let currentSlide = 0;
  let slideInterval;

  function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    // Reset animations on leaving slide
    slides[currentSlide].querySelectorAll('.animate-up').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(40px)';
    });

    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');

    dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
  }

  function nextSlide() { goToSlide(currentSlide + 1); }
  function prevSlide() { goToSlide(currentSlide - 1); }

  function startAutoSlide() {
    slideInterval = setInterval(nextSlide, 5500);
  }
  function resetAutoSlide() {
    clearInterval(slideInterval);
    startAutoSlide();
  }

  heroNext.addEventListener('click', () => { nextSlide(); resetAutoSlide(); });
  heroPrev.addEventListener('click', () => { prevSlide(); resetAutoSlide(); });
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goToSlide(i); resetAutoSlide(); });
  });

  startAutoSlide();


  /* =====================
     AOS (Scroll Animations)
  ===================== */
  const aosElements = document.querySelectorAll('[data-aos]');

  const aosObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseInt(el.getAttribute('data-aos-delay') || '0');
        setTimeout(() => {
          el.classList.add('aos-visible');
        }, delay);
        aosObserver.unobserve(el);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  aosElements.forEach(el => aosObserver.observe(el));


  /* =====================
     COUNTER ANIMATION
  ===================== */
  const counters = document.querySelectorAll('.stat-num');
  let countersStarted = false;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersStarted) {
        countersStarted = true;
        counters.forEach(counter => {
          const target = parseInt(counter.getAttribute('data-count'));
          const duration = 2200;
          const step = target / (duration / 16);
          let current = 0;
          const timer = setInterval(() => {
            current += step;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            counter.textContent = Math.floor(current);
          }, 16);
        });
      }
    });
  }, { threshold: 0.4 });

  const statsSection = document.querySelector('.stats-section');
  if (statsSection) counterObserver.observe(statsSection);


  /* =====================
     PORTFOLIO FILTER
  ===================== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      portfolioItems.forEach(item => {
        if (filter === 'all' || item.getAttribute('data-category') === filter) {
          item.classList.remove('hidden');
          item.style.animation = 'none';
          // Trigger reflow
          void item.offsetWidth;
          item.style.animation = 'fadeInItem 0.4s ease forwards';
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  // Inject keyframe for filter animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInItem {
      from { opacity: 0; transform: scale(0.9); }
      to { opacity: 1; transform: scale(1); }
    }
  `;
  document.head.appendChild(style);


  /* =====================
     TESTIMONIAL SLIDER
  ===================== */
  const tTrack = document.getElementById('testimonialTrack');
  const tPrev = document.getElementById('tPrev');
  const tNext = document.getElementById('tNext');
  const tDots = document.querySelectorAll('.t-dot');
  const tSlides = document.querySelectorAll('.testimonial-slide');
  let tCurrent = 0;

  function goToTestimonial(index) {
    tCurrent = (index + tSlides.length) % tSlides.length;
    tTrack.style.transform = `translateX(-${tCurrent * 100}%)`;
    tDots.forEach((d, i) => d.classList.toggle('active', i === tCurrent));
  }

  tPrev.addEventListener('click', () => goToTestimonial(tCurrent - 1));
  tNext.addEventListener('click', () => goToTestimonial(tCurrent + 1));
  tDots.forEach((dot, i) => dot.addEventListener('click', () => goToTestimonial(i)));

  // Auto-advance testimonials
  setInterval(() => goToTestimonial(tCurrent + 1), 7000);

  // Touch/swipe support
  let tStartX = 0;
  if (tTrack) {
    tTrack.addEventListener('touchstart', e => { tStartX = e.touches[0].clientX; });
    tTrack.addEventListener('touchend', e => {
      const diff = tStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        goToTestimonial(diff > 0 ? tCurrent + 1 : tCurrent - 1);
      }
    });
  }


  /* =====================
     HERO SWIPE SUPPORT
  ===================== */
  let heroStartX = 0;
  const heroSlider = document.getElementById('heroSlider');
  heroSlider.addEventListener('touchstart', e => { heroStartX = e.touches[0].clientX; });
  heroSlider.addEventListener('touchend', e => {
    const diff = heroStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 60) {
      diff > 0 ? nextSlide() : prevSlide();
      resetAutoSlide();
    }
  });


  /* =====================
     CONTACT FORM
  ===================== */
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btnText = submitBtn.querySelector('.btn-text');
      const btnLoader = submitBtn.querySelector('.btn-loader');

      btnText.classList.add('hidden');
      btnLoader.classList.remove('hidden');
      submitBtn.disabled = true;

      // Simulate form submission
      setTimeout(() => {
        btnText.classList.remove('hidden');
        btnLoader.classList.add('hidden');
        submitBtn.disabled = false;
        formSuccess.classList.remove('hidden');
        contactForm.reset();
        setTimeout(() => formSuccess.classList.add('hidden'), 5000);
      }, 1800);
    });
  }


  /* =====================
     NEWSLETTER FORM
  ===================== */
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input');
      const btn = newsletterForm.querySelector('button');
      btn.textContent = '✓';
      btn.style.background = '#4caf50';
      input.value = '';
      setTimeout(() => {
        btn.textContent = '→';
        btn.style.background = '';
      }, 3000);
    });
  }


  /* =====================
     SCROLL TO TOP
  ===================== */
  const scrollTopBtn = document.getElementById('scrollTop');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* =====================
     PARALLAX FOR STATS BG
  ===================== */
  const statsBg = document.querySelector('.stats-bg');
  if (statsBg) {
    window.addEventListener('scroll', () => {
      const section = statsBg.parentElement;
      const rect = section.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const offset = (rect.top / window.innerHeight) * 60;
        statsBg.style.transform = `translateY(${offset}px)`;
      }
    });
  }


  /* =====================
     SMOOTH REVEAL FOR HERO
     (small parallax on scroll)
  ===================== */
  window.addEventListener('scroll', () => {
    const heroContent = document.querySelector('#hero .hero-content');
    if (heroContent && window.scrollY < window.innerHeight) {
      heroContent.style.transform = `translateY(${window.scrollY * 0.3}px)`;
      heroContent.style.opacity = 1 - (window.scrollY / (window.innerHeight * 0.6));
    }
  });


  /* =====================
     CURSOR: hide on touch devices
  ===================== */
  if ('ontouchstart' in window) {
    dot.style.display = 'none';
    outline.style.display = 'none';
    document.body.style.cursor = 'auto';
    document.querySelectorAll('button, a').forEach(el => el.style.cursor = 'pointer');
  }

});
