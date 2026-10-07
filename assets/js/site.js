(() => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#site-nav');
  if (toggle && nav) {
    const mobile = window.matchMedia('(max-width: 1080px)');
    const close = (restoreFocus = false) => {
      const wasOpen = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
      nav.classList.remove('is-open');
      document.body.classList.remove('menu-open');
      if (wasOpen && restoreFocus) toggle.focus();
    };
    toggle.addEventListener('click', () => {
      const next = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(next));
      toggle.setAttribute('aria-label', next ? 'Close menu' : 'Open menu');
      nav.classList.toggle('is-open', next);
      document.body.classList.toggle('menu-open', next);
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => close()));
    mobile.addEventListener('change', () => close());
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close(true);
      if (e.key === 'Tab' && toggle.getAttribute('aria-expanded') === 'true') {
        const links = [...document.querySelectorAll('.site-header a, .site-header button')]
          .filter(element => element.getClientRects().length);
        const first = links[0];
        const last = links[links.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && !toggle.contains(e.target)) close();
    });
  }

  const video = document.querySelector('.footer-bg');
  const filmToggle = document.querySelector('.film-toggle');
  if (video && filmToggle) {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let userPaused = reducedMotion.matches;
    let inView = false;
    const updatePlayback = () => {
      if (inView && !document.hidden && !userPaused) {
        video.play().catch(() => {
          filmToggle.setAttribute('aria-pressed', 'true');
          filmToggle.setAttribute('aria-label', 'Play landscape video');
        });
      } else {
        video.pause();
      }
    };
    const updateControl = () => {
      filmToggle.setAttribute('aria-pressed', String(video.paused));
      filmToggle.setAttribute('aria-label', video.paused ? 'Play landscape video' : 'Pause landscape video');
    };
    // The poster remains visible while autoplay is unavailable or motion is reduced.
    video.removeAttribute('autoplay');
    video.pause();
    updateControl();
    video.addEventListener('play', updateControl);
    video.addEventListener('pause', updateControl);
    filmToggle.addEventListener('click', () => {
      userPaused = !video.paused;
      updatePlayback();
    });
    reducedMotion.addEventListener('change', () => {
      userPaused = reducedMotion.matches;
      updatePlayback();
    });
    document.addEventListener('visibilitychange', updatePlayback);
    const observer = new IntersectionObserver(entries => {
      inView = entries[0].isIntersecting;
      updatePlayback();
    }, { threshold: 0.05 });
    observer.observe(video);
  }

  document.querySelectorAll('[data-newsletter-form]').forEach(form => {
    const status = form.parentElement.querySelector('[data-newsletter-status]');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      if (!input || !input.checkValidity()) {
        if (status) status.textContent = 'Please enter a valid email address.';
        input?.focus();
        return;
      }
      const subject = encodeURIComponent('L’Âme des Matières newsletter request');
      const body = encodeURIComponent(`Please send L’Âme des Matières stories, collections and invitations to ${input.value}.`);
      if (status) status.textContent = 'Opening your email app to request newsletter updates…';
      window.location.href = `mailto:care@heritage.com?subject=${subject}&body=${body}`;
    });
  });

  const contact = document.querySelector('[data-contact-form]');
  if (contact) {
    const status = contact.querySelector('[data-contact-status]');
    contact.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!contact.checkValidity()) {
        contact.reportValidity();
        return;
      }
      const data = new FormData(contact);
      const subject = encodeURIComponent(`L’Âme des Matières enquiry: ${data.get('subject') || 'Presentation request'}`);
      const body = encodeURIComponent(
`Name: ${data.get('name')}
Email: ${data.get('email')}
Company: ${data.get('company')}
Interest: ${data.get('interest')}

Message:\n${data.get('message')}`);
      if (status) status.textContent = 'Opening your email app with your enquiry…';
      window.location.href = `mailto:care@heritage.com?subject=${subject}&body=${body}`;
    });
  }
})();
