/**
 * DIKI CANDRA LESMANA — 60FPS CINEMATIC MOTION ENGINE
 * Powered by Lenis Smooth Scroll + GSAP + ScrollTrigger + Flip
 * Respects prefers-reduced-motion and uses GPU-accelerated transforms.
 */

const PROJECT_DETAILS = {
  longform_1: {
    category: 'longform',
    youtubeUrl: 'https://www.youtube.com/watch?v=Bgdf9sMLOCQ',
    tag: 'LONGFORM VIDEO • 01',
    title: 'Longform Video Production 01'
  },
  longform_2: {
    category: 'longform',
    youtubeUrl: 'https://www.youtube.com/watch?v=Bgdf9sMLOCQ',
    tag: 'LONGFORM VIDEO • 02',
    title: 'Longform Video Production 02'
  },
  longform_3: {
    category: 'longform',
    youtubeUrl: 'https://www.youtube.com/watch?v=Bgdf9sMLOCQ',
    tag: 'LONGFORM VIDEO • 03',
    title: 'Longform Video Production 03'
  },
  longform_4: {
    category: 'longform',
    youtubeUrl: 'https://www.youtube.com/watch?v=Bgdf9sMLOCQ',
    tag: 'LONGFORM VIDEO • 04',
    title: 'Longform Video Production 04'
  },
  longform_5: {
    category: 'longform',
    youtubeUrl: 'https://www.youtube.com/watch?v=Bgdf9sMLOCQ',
    tag: 'LONGFORM VIDEO • 05',
    title: 'Longform Video Production 05'
  },
  longform_6: {
    category: 'longform',
    youtubeUrl: 'https://www.youtube.com/watch?v=Bgdf9sMLOCQ',
    tag: 'LONGFORM VIDEO • 06',
    title: 'Longform Video Production 06'
  },
  shortform_1: {
    category: 'shortform',
    youtubeUrl: 'https://www.youtube.com/watch?v=Bgdf9sMLOCQ',
    tag: 'SHORTFORM VIDEO • 01',
    title: 'Shortform Video Production 01'
  },
  shortform_2: {
    category: 'shortform',
    youtubeUrl: 'https://www.youtube.com/watch?v=Bgdf9sMLOCQ',
    tag: 'SHORTFORM VIDEO • 02',
    title: 'Shortform Video Production 02'
  },
  shortform_3: {
    category: 'shortform',
    youtubeUrl: 'https://www.youtube.com/watch?v=Bgdf9sMLOCQ',
    tag: 'SHORTFORM VIDEO • 03',
    title: 'Shortform Video Production 03'
  }
};

/**
 * Mengubah berbagai format link YouTube (watch?v=, youtu.be/, shorts/, embed/)
 * menjadi informasi videoId, URL embed resmi, dan URL thumbnail resmi YouTube.
 */
function parseYouTubeUrl(rawUrl) {
  const fallbackId = 'Bgdf9sMLOCQ';
  if (!rawUrl || typeof rawUrl !== 'string') {
    return {
      videoId: fallbackId,
      embedUrl: `https://www.youtube.com/embed/${fallbackId}?rel=0&modestbranding=1`,
      autoplayEmbedUrl: `https://www.youtube.com/embed/${fallbackId}?autoplay=1&rel=0&modestbranding=1`,
      watchUrl: `https://www.youtube.com/watch?v=${fallbackId}`,
      thumbMaxUrl: `https://i.ytimg.com/vi/${fallbackId}/maxresdefault.jpg`,
      thumbHqUrl: `https://i.ytimg.com/vi/${fallbackId}/hqdefault.jpg`
    };
  }

  const trimmed = rawUrl.trim();
  let videoId = null;

  // 1. Jika input langsung berupa 11 karakter ID YouTube
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    videoId = trimmed;
  } else {
    // 2. Ekstrak dari URL (mendukung watch?v=, youtu.be/, shorts/, embed/, live/)
    const regExp = /(?:youtube\.com\/(?:watch\?.*v=|embed\/|shorts\/|live\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = trimmed.match(regExp);
    if (match && match[1]) {
      videoId = match[1];
    }
  }

  if (!videoId) {
    videoId = fallbackId;
  }

  return {
    videoId,
    embedUrl: `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`,
    autoplayEmbedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`,
    watchUrl: `https://www.youtube.com/watch?v=${videoId}`,
    thumbMaxUrl: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
    thumbHqUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
  };
}

/**
 * Memasang thumbnail resmi dari sumber video YouTube ke elemen <img> kartu.
 * Otomatis menggunakan kualitas tertinggi (maxresdefault) dan fallback ke hqdefault.
 */
function applyYouTubeThumbnailToCard(card, ytInfo) {
  if (!card || !ytInfo) return;
  const thumbImg = card.querySelector('.project-thumb-img');
  if (!thumbImg) return;

  const probe = new Image();
  probe.onload = () => {
    // YouTube mengembalikan placeholder berukuran 120x90 jika maxresdefault tidak tersedia
    if (probe.naturalWidth && probe.naturalWidth <= 120) {
      thumbImg.src = ytInfo.thumbHqUrl;
    } else {
      thumbImg.src = ytInfo.thumbMaxUrl;
    }
  };
  probe.onerror = () => {
    thumbImg.src = ytInfo.thumbHqUrl;
  };
  probe.src = ytInfo.thumbMaxUrl;
}

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGSAP = typeof window.gsap !== 'undefined';

  if (hasGSAP) {
    if (typeof window.ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }
    if (typeof window.Flip !== 'undefined') {
      gsap.registerPlugin(Flip);
    }
  }

  /* ==========================================================================
     1. SMOOTH INERTIA SCROLLING (LENIS + GSAP SCROLLTRIGGER)
     ========================================================================== */
  let lenis = null;

  if (!prefersReducedMotion && typeof window.Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.18,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5
    });

    if (hasGSAP && typeof window.ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }

    // Smooth anchor navigation via Lenis
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId && targetId.length > 1) {
          const targetEl = document.querySelector(targetId);
          if (targetEl) {
            e.preventDefault();
            lenis.scrollTo(targetEl, { offset: -20, duration: 1.35 });
          }
        }
      });
    });
  }

  /* ==========================================================================
     2. CHOREOGRAPHED HERO REVEAL (ON LOAD)
     ========================================================================== */
  if (hasGSAP && !prefersReducedMotion) {
    const heroTl = gsap.timeline({
      defaults: { ease: 'expo.out' }
    });

    // Initial states
    gsap.set('.topbar', { y: -32, autoAlpha: 0 });
    gsap.set('.hero-bg-typography span', { scale: 1.12, y: 40, autoAlpha: 0 });
    gsap.set('.portrait-container', {
      scale: 1.08,
      clipPath: 'inset(14% 8% 14% 8% round 12px)',
      autoAlpha: 0
    });
    gsap.set(['.hero-script', '.hero-name', '.hero-title', '.hero-location-badge'], {
      y: 44,
      autoAlpha: 0
    });
    gsap.set('.floating-tagline', { y: 30, autoAlpha: 0 });
    gsap.set('.stat-item', { y: 28, autoAlpha: 0 });

    heroTl
      .to('.topbar', {
        y: 0,
        autoAlpha: 1,
        duration: 1.1
      }, 0.05)
      .to('.hero-bg-typography span', {
        scale: 1,
        y: 0,
        autoAlpha: 0.92,
        duration: 1.6,
        ease: 'power4.out'
      }, 0.12)
      .to('.portrait-container', {
        scale: 1,
        clipPath: 'inset(0% 0% 0% 0% round 0px)',
        autoAlpha: 1,
        duration: 1.45,
        ease: 'expo.out',
        clearProps: 'clipPath'
      }, 0.22)
      .to(['.hero-script', '.hero-name', '.hero-title', '.hero-location-badge'], {
        y: 0,
        autoAlpha: 1,
        duration: 1.15,
        stagger: 0.11,
        ease: 'power4.out'
      }, 0.32)
      .to('.floating-tagline', {
        y: 0,
        autoAlpha: 1,
        duration: 1.05
      }, 0.55)
      .to('.stat-item', {
        y: 0,
        autoAlpha: 1,
        duration: 0.95,
        stagger: 0.1
      }, 0.65);
  }

  /* ==========================================================================
     3. SCROLL PARALLAX, NUMBER COUNTER & CONTINUOUS ROTATION
     ========================================================================== */
  if (hasGSAP && !prefersReducedMotion) {
    // Continuous subtle rotation on sparkles & stars
    gsap.to('.sparkle-circle, .red-star, .sparkle-icon', {
      rotation: 360,
      duration: 18,
      repeat: -1,
      ease: 'none'
    });

    if (typeof window.ScrollTrigger !== 'undefined') {
      // Multi-layer Hero Parallax
      gsap.to('.hero-bg-typography', {
        yPercent: 28,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6
        }
      });

      gsap.to('.hero-portrait', {
        yPercent: 9,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6
        }
      });

      gsap.to('.floating-tagline', {
        yPercent: -32,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6
        }
      });

      // Number Counter Animation (4+, 150+, 7+)
      const statNumbers = document.querySelectorAll('.stat-number');
      statNumbers.forEach((statEl) => {
        const targetVal = parseInt(statEl.getAttribute('data-target') || '0', 10);
        const counterObj = { val: 0 };

        ScrollTrigger.create({
          trigger: '.hero-stats',
          start: 'top 90%',
          once: true,
          onEnter: () => {
            gsap.to(counterObj, {
              val: targetVal,
              duration: 1.85,
              ease: 'power3.out',
              onUpdate: () => {
                statEl.textContent = `${Math.round(counterObj.val)}+`;
              }
            });
          }
        });
      });

      // Projects Section Reveal on Scroll
      gsap.from('.projects-section .section-header > *', {
        y: 24,
        autoAlpha: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: '.projects-section',
          start: 'top 82%',
          once: true
        }
      });

      gsap.from('.project-card', {
        y: 48,
        autoAlpha: 0,
        duration: 1.05,
        stagger: 0.14,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: '.projects-grid',
          start: 'top 82%',
          once: true
        }
      });

      // Contact Footer Stagger Reveal on Scroll
      const footerTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.contact-footer',
          start: 'top 84%',
          once: true
        }
      });

      footerTl
        .from('.footer-heading, .avail-footer-btn', {
          y: 36,
          autoAlpha: 0,
          duration: 1,
          stagger: 0.12,
          ease: 'expo.out'
        })
        .from('.contact-row', {
          x: -28,
          autoAlpha: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: 'expo.out'
        }, '-=0.7')
        .from('.mockup-container', {
          scale: 0.94,
          y: 30,
          autoAlpha: 0,
          duration: 1.15,
          ease: 'expo.out'
        }, '-=0.8');
    }
  }

  /* ==========================================================================
     4. INTERACTIVE PHOTO SWITCHER (CROSSFADE + BLUR/SCALE TRANSITION)
     ========================================================================== */
  const changePhotoBtn = document.getElementById('changePhotoBtn');
  const photoUploadInput = document.getElementById('photoUploadInput');
  const heroPortraitImg = document.getElementById('heroPortraitImg');
  const modeBtns = document.querySelectorAll('.photo-mode-btn');

  localStorage.removeItem('diki_custom_portrait');
  const savedPhoto = localStorage.getItem('diki_custom_portrait_v2');
  if (savedPhoto && heroPortraitImg) {
    heroPortraitImg.src = savedPhoto;
    modeBtns.forEach((b) => b.classList.remove('active'));
  }

  function transitionPortraitImage(newSrc) {
    if (!heroPortraitImg || !newSrc) return;
    if (heroPortraitImg.getAttribute('src') === newSrc) return;

    if (!hasGSAP || prefersReducedMotion) {
      heroPortraitImg.src = newSrc;
      return;
    }

    gsap.killTweensOf(heroPortraitImg);
    gsap.to(heroPortraitImg, {
      autoAlpha: 0,
      scale: 0.965,
      filter: 'blur(10px) contrast(1.06) brightness(0.96)',
      duration: 0.28,
      ease: 'power2.in',
      onComplete: () => {
        const revealNewImg = () => {
          gsap.fromTo(
            heroPortraitImg,
            {
              autoAlpha: 0,
              scale: 1.045,
              filter: 'blur(10px) contrast(1.06) brightness(0.96)'
            },
            {
              autoAlpha: 1,
              scale: 1,
              filter: 'blur(0px) contrast(1.06) brightness(0.96)',
              duration: 0.65,
              ease: 'expo.out'
            }
          );
        };

        heroPortraitImg.onload = revealNewImg;
        heroPortraitImg.src = newSrc;
        if (heroPortraitImg.complete) {
          revealNewImg();
        }
      }
    });
  }

  modeBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetSrc = btn.getAttribute('data-src');
      if (targetSrc && heroPortraitImg) {
        localStorage.removeItem('diki_custom_portrait_v2');
        modeBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        transitionPortraitImage(targetSrc);
      }
    });
  });

  if (changePhotoBtn && photoUploadInput && heroPortraitImg) {
    changePhotoBtn.addEventListener('click', () => {
      photoUploadInput.click();
    });

    photoUploadInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (ev) => {
        const resultUrl = ev.target.result;
        modeBtns.forEach((b) => b.classList.remove('active'));
        transitionPortraitImage(resultUrl);
        try {
          localStorage.setItem('diki_custom_portrait_v2', resultUrl);
        } catch (err) {
          // Ignore storage quota errors
        }
      };
      reader.readAsDataURL(file);
    });
  }

  /* ==========================================================================
     5. FLUID PROJECT FILTERING (GSAP FLIP) & YOUTUBE EMBED SYSTEM
     ========================================================================== */
  const filterTabs = document.querySelectorAll('.filter-tab');
  const projectCards = document.querySelectorAll('.project-card');
  const YT_STORAGE_KEY = 'diki_youtube_links_v1';

  // Load saved custom YouTube links from localStorage
  let savedYoutubeLinks = {};
  try {
    const rawSaved = localStorage.getItem(YT_STORAGE_KEY);
    if (rawSaved) {
      savedYoutubeLinks = JSON.parse(rawSaved) || {};
    }
  } catch (err) {
    savedYoutubeLinks = {};
  }

  function getProjectYoutubeUrl(projectId, cardEl) {
    if (savedYoutubeLinks[projectId]) {
      return savedYoutubeLinks[projectId];
    }
    if (cardEl && cardEl.getAttribute('data-youtube-url')) {
      return cardEl.getAttribute('data-youtube-url');
    }
    if (PROJECT_DETAILS[projectId] && PROJECT_DETAILS[projectId].youtubeUrl) {
      return PROJECT_DETAILS[projectId].youtubeUrl;
    }
    return 'https://www.youtube.com/watch?v=Bgdf9sMLOCQ';
  }

  function saveProjectYoutubeUrl(projectId, newUrl) {
    const parsed = parseYouTubeUrl(newUrl);
    const normalizedUrl = parsed.watchUrl;
    savedYoutubeLinks[projectId] = normalizedUrl;
    if (PROJECT_DETAILS[projectId]) {
      PROJECT_DETAILS[projectId].youtubeUrl = normalizedUrl;
    }
    try {
      localStorage.setItem(YT_STORAGE_KEY, JSON.stringify(savedYoutubeLinks));
    } catch (err) {
      // Ignore storage quota errors
    }

    // Update matching card DOM attributes, thumbnail & direct link
    const card = document.querySelector(`.project-card[data-project-id="${projectId}"]`);
    if (card) {
      card.setAttribute('data-youtube-url', normalizedUrl);
      applyYouTubeThumbnailToCard(card, parsed);
      const openLink = card.querySelector('.card-open-yt-link');
      if (openLink) {
        openLink.href = normalizedUrl;
      }
      if (card.classList.contains('is-playing')) {
        playInlineYouTube(card);
      }
    }
    return parsed;
  }

  function stopInlineYouTube(card) {
    if (!card) return;
    card.classList.remove('is-playing');
    const slot = card.querySelector('.video-embed-slot');
    if (slot) {
      slot.innerHTML = '';
    }
  }

  function playInlineYouTube(card) {
    if (!card) return;
    // Stop other playing cards first so only one plays audio at a time
    projectCards.forEach((otherCard) => {
      if (otherCard !== card) {
        stopInlineYouTube(otherCard);
      }
    });

    const projectId = card.getAttribute('data-project-id');
    const rawUrl = getProjectYoutubeUrl(projectId, card);
    const yt = parseYouTubeUrl(rawUrl);
    const slot = card.querySelector('.video-embed-slot');
    if (!slot) return;

    card.classList.add('is-playing');
    slot.innerHTML = `
      <button type="button" class="close-inline-video-btn" aria-label="Tutup video">✕ Tutup</button>
      <iframe
        src="${yt.autoplayEmbedUrl}"
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
      ></iframe>
    `;

    const closeInlineBtn = slot.querySelector('.close-inline-video-btn');
    if (closeInlineBtn) {
      closeInlineBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        stopInlineYouTube(card);
      });
    }
  }

  // Initialize card links & YouTube thumbnails from saved storage or HTML attribute on load
  projectCards.forEach((card) => {
    const projectId = card.getAttribute('data-project-id');
    const currentUrl = getProjectYoutubeUrl(projectId, card);
    const yt = parseYouTubeUrl(currentUrl);
    card.setAttribute('data-youtube-url', yt.watchUrl);
    applyYouTubeThumbnailToCard(card, yt);
    const openLink = card.querySelector('.card-open-yt-link');
    if (openLink) {
      openLink.href = yt.watchUrl;
      openLink.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }

    const editBtn = card.querySelector('.card-edit-yt-btn');
    if (editBtn) {
      editBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const existingUrl = getProjectYoutubeUrl(projectId, card);
        const inputUrl = window.prompt(
          'Masukkan link video YouTube (watch?v=, youtu.be/, shorts/, atau embed):',
          existingUrl
        );
        if (inputUrl && inputUrl.trim()) {
          saveProjectYoutubeUrl(projectId, inputUrl.trim());
        }
      });
    }

    const playBadge = card.querySelector('.yt-play-badge');
    const inlinePlayBtn = card.querySelector('.inline-play-btn');
    [playBadge, inlinePlayBtn].forEach((btn) => {
      if (btn) {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const latestUrl = getProjectYoutubeUrl(projectId, card);
          const parsedYt = parseYouTubeUrl(latestUrl);
          window.open(parsedYt.watchUrl, '_blank', 'noopener,noreferrer');
        });
      }
    });
  });

  filterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const targetFilter = tab.getAttribute('data-filter');

      filterTabs.forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      // Stop inline video on cards that will be hidden
      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        const matches = targetFilter === 'all' || category === targetFilter;
        if (!matches) {
          stopInlineYouTube(card);
        }
      });

      if (hasGSAP && !prefersReducedMotion) {
        gsap.killTweensOf(projectCards);
        projectCards.forEach((card) => {
          const category = card.getAttribute('data-category');
          const matches = targetFilter === 'all' || category === targetFilter;
          card.classList.toggle('hidden', !matches);
        });

        const visibleCards = Array.from(projectCards).filter(
          (card) => !card.classList.contains('hidden')
        );

        gsap.fromTo(
          visibleCards,
          { autoAlpha: 0, y: 18, scale: 0.96 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            stagger: 0.07,
            ease: 'expo.out',
            clearProps: 'transform',
            onComplete: () => {
              if (typeof window.ScrollTrigger !== 'undefined') {
                ScrollTrigger.refresh();
              }
            }
          }
        );
      } else {
        projectCards.forEach((card) => {
          const category = card.getAttribute('data-category');
          if (targetFilter === 'all' || category === targetFilter) {
            card.classList.remove('hidden');
          } else {
            card.classList.add('hidden');
          }
        });
      }
    });
  });

  /* ==========================================================================
     6. SMOOTH MODAL TRANSITION WITH EMBEDDED YOUTUBE PLAYER
     ========================================================================== */
  const modal = document.getElementById('projectModal');
  const modalDialog = modal ? modal.querySelector('.modal-dialog') : null;
  const modalBody = document.getElementById('modalBody');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  let isModalOpen = false;

  function openProjectModal(projectId) {
    const data = PROJECT_DETAILS[projectId];
    if (!data || !modal || !modalDialog) return;

    // Stop any inline card video so audio doesn't overlap
    projectCards.forEach((c) => stopInlineYouTube(c));

    const cardEl = document.querySelector(`.project-card[data-project-id="${projectId}"]`);
    const currentUrl = getProjectYoutubeUrl(projectId, cardEl);
    const yt = parseYouTubeUrl(currentUrl);

    modalBody.innerHTML = `
      <span class="modal-tag">${data.tag}</span>
      <h3 class="modal-title" id="modalTitle">${data.title}</h3>
      <div class="modal-video-box">
        <iframe
          id="modalYtIframe"
          src="${yt.embedUrl}"
          title="${data.title}"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen
        ></iframe>
      </div>
      <div class="modal-yt-controls">
        <div class="modal-yt-input-group">
          <input
            type="url"
            id="modalYtUrlInput"
            class="modal-yt-input"
            value="${yt.watchUrl}"
            placeholder="Paste link YouTube (watch, youtu.be, shorts, embed)..."
            aria-label="Link Video YouTube"
          />
          <button type="button" id="modalYtSaveBtn" class="modal-yt-save-btn">Update Embed</button>
        </div>
        <a
          href="${yt.watchUrl}"
          id="modalYtDirectLink"
          target="_blank"
          rel="noopener noreferrer"
          class="modal-yt-direct-link"
        >
          Buka di YouTube ↗
        </a>
      </div>
    `;

    const urlInput = document.getElementById('modalYtUrlInput');
    const saveBtn = document.getElementById('modalYtSaveBtn');
    const iframeEl = document.getElementById('modalYtIframe');
    const directLinkEl = document.getElementById('modalYtDirectLink');

    if (saveBtn && urlInput && iframeEl && directLinkEl) {
      const handleUpdateUrl = () => {
        const val = urlInput.value.trim();
        if (!val) return;
        const updated = saveProjectYoutubeUrl(projectId, val);
        iframeEl.src = updated.autoplayEmbedUrl;
        urlInput.value = updated.watchUrl;
        directLinkEl.href = updated.watchUrl;
        saveBtn.textContent = 'Tersimpan ✓';
        setTimeout(() => {
          saveBtn.textContent = 'Update Embed';
        }, 1600);
      };

      saveBtn.addEventListener('click', handleUpdateUrl);
      urlInput.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter') {
          ev.preventDefault();
          handleUpdateUrl();
        }
      });
    }

    isModalOpen = true;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (lenis) lenis.stop();

    if (hasGSAP && !prefersReducedMotion) {
      gsap.killTweensOf([modal, modalDialog]);
      gsap.fromTo(
        modal,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.32, ease: 'power2.out' }
      );
      gsap.fromTo(
        modalDialog,
        { scale: 0.88, y: 34, autoAlpha: 0 },
        {
          scale: 1,
          y: 0,
          autoAlpha: 1,
          duration: 0.58,
          ease: 'back.out(1.55)'
        }
      );
      gsap.from(modalBody.children, {
        y: 16,
        autoAlpha: 0,
        duration: 0.45,
        stagger: 0.05,
        delay: 0.1,
        ease: 'expo.out'
      });
    } else {
      modal.style.opacity = '1';
    }
  }

  function closeProjectModal() {
    if (!isModalOpen || !modal || !modalDialog) return;
    isModalOpen = false;

    const finishClose = () => {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      if (modalBody) {
        modalBody.innerHTML = ''; // Destroy iframe to stop YouTube audio on close
      }
      document.body.style.overflow = '';
      if (lenis) lenis.start();
    };

    if (hasGSAP && !prefersReducedMotion) {
      gsap.killTweensOf([modal, modalDialog]);
      gsap.to(modalDialog, {
        scale: 0.93,
        y: 20,
        autoAlpha: 0,
        duration: 0.26,
        ease: 'power2.in'
      });
      gsap.to(modal, {
        autoAlpha: 0,
        duration: 0.28,
        ease: 'power2.in',
        onComplete: finishClose
      });
    } else {
      modal.style.opacity = '0';
      finishClose();
    }
  }

  projectCards.forEach((card) => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.card-edit-yt-btn')) {
        return;
      }
      const id = card.getAttribute('data-project-id');
      const latestUrl = getProjectYoutubeUrl(id, card);
      const parsedYt = parseYouTubeUrl(latestUrl);
      window.open(parsedYt.watchUrl, '_blank', 'noopener,noreferrer');
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeProjectModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeProjectModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isModalOpen) {
      closeProjectModal();
    }
  });

  /* ==========================================================================
     7. MAGNETIC BUTTONS (.availability-pill & .avail-footer-btn)
     ========================================================================== */
  if (hasGSAP && !prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
    const magneticTargets = document.querySelectorAll('.availability-pill, .avail-footer-btn');

    magneticTargets.forEach((el) => {
      const xTo = gsap.quickTo(el, 'x', { duration: 0.55, ease: 'power3.out' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.55, ease: 'power3.out' });

      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const relX = e.clientX - (rect.left + rect.width / 2);
        const relY = e.clientY - (rect.top + rect.height / 2);
        xTo(relX * 0.28);
        yTo(relY * 0.32);
      });

      el.addEventListener('mouseleave', () => {
        xTo(0);
        yTo(0);
      });
    });
  }
});
