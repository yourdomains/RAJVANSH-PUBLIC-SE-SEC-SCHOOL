/* ===================================================================
   RAJVANSH 3D INTERACTIONS & WEB AUDIO ENGINE
   =================================================================== */

(function() {
  'use strict';

  // -----------------------------------------------------------------
  // 1. PROCEDURAL WEB AUDIO SYNTHESIZER
  // -----------------------------------------------------------------
  let audioCtx = null;
  let audioEnabled = true;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  window.RajvanshAudio = {
    isEnabled: () => audioEnabled,
    toggle: function() {
      audioEnabled = !audioEnabled;
      const soundBtn = document.getElementById('sound-toggle-btn');
      if (soundBtn) {
        soundBtn.innerHTML = audioEnabled ? '🔊 Sound: On' : '🔇 Sound: Off';
      }
      if (audioEnabled) {
        initAudio();
        this.playPop(500);
      }
      return audioEnabled;
    },
    playHover: function() {
      if (!audioEnabled) return;
      initAudio();
      if (!audioCtx) return;
      try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(380, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(520, audioCtx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.08);
      } catch (e) {}
    },
    playPop: function(freq = 440) {
      if (!audioEnabled) return;
      initAudio();
      if (!audioCtx) return;
      try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.5, audioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
      } catch (e) {}
    },
    playChime: function(freq = 580, type = 'sine', duration = 0.25) {
      if (!audioEnabled) return;
      initAudio();
      if (!audioCtx) return;
      try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.09, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
      } catch (e) {}
    },
    playSuccess: function() {
      if (!audioEnabled) return;
      initAudio();
      const notes = [440, 554.37, 659.25, 880];
      notes.forEach((n, idx) => {
        setTimeout(() => this.playChime(n, 'triangle', 0.35), idx * 90);
      });
    }
  };

  // Sound toggle button in topbar
  const soundBtn = document.getElementById('sound-toggle-btn');
  if (soundBtn) {
    soundBtn.addEventListener('click', () => window.RajvanshAudio.toggle());
  }

  // -----------------------------------------------------------------
  // 2. THEME SWITCHER (COSMIC / GOLDEN / EMERALD)
  // -----------------------------------------------------------------
  const themeBtn = document.getElementById('theme-toggle-btn');
  const themes = ['default', 'golden', 'emerald'];
  let curThemeIndex = 0;

  if (themeBtn) {
    themeBtn.addEventListener('click', function() {
      curThemeIndex = (curThemeIndex + 1) % themes.length;
      const theme = themes[curThemeIndex];
      if (theme === 'default') {
        document.documentElement.removeAttribute('data-theme');
        themeBtn.innerHTML = '🎨 Theme: Cosmic';
      } else if (theme === 'golden') {
        document.documentElement.setAttribute('data-theme', 'golden');
        themeBtn.innerHTML = '🎨 Theme: Golden';
      } else {
        document.documentElement.setAttribute('data-theme', 'emerald');
        themeBtn.innerHTML = '🎨 Theme: Emerald';
      }
      window.RajvanshAudio.playPop(520);
    });
  }

  // -----------------------------------------------------------------
  // 3. CUSTOM 3D CURSOR ENGINE
  // -----------------------------------------------------------------
  const cursor = document.querySelector('.custom-cursor');
  const follower = document.querySelector('.custom-cursor-follower');

  if (cursor && follower) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let followerX = mouseX;
    let followerY = mouseY;

    window.addEventListener('mousemove', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    });

    function renderCursorFollower() {
      followerX += (mouseX - followerX) * 0.15;
      followerY += (mouseY - followerY) * 0.15;
      follower.style.transform = `translate(${followerX}px, ${followerY}px)`;
      requestAnimationFrame(renderCursorFollower);
    }
    renderCursorFollower();

    // Hover scale effects
    const interactiveTargets = document.querySelectorAll('a, button, .tilt-card, .cube-face, .campus-hotspot, .gallery-3d-item');
    interactiveTargets.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.transform = `translate(${mouseX}px, ${mouseY}px) scale(2.2)`;
        follower.style.width = '60px';
        follower.style.height = '60px';
        follower.style.borderColor = 'var(--accent-gold)';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.transform = `translate(${mouseX}px, ${mouseY}px) scale(1)`;
        follower.style.width = '40px';
        follower.style.height = '40px';
        follower.style.borderColor = 'var(--accent-cyan)';
      });
    });
  }

  // -----------------------------------------------------------------
  // 4. 3D CARD TILT WITH DYNAMIC GLARE
  // -----------------------------------------------------------------
  const tiltCards = document.querySelectorAll('.tilt-card');
  tiltCards.forEach(card => {
    let glare = card.querySelector('.card-glare');
    if (!glare) {
      glare = document.createElement('div');
      glare.className = 'card-glare';
      card.appendChild(glare);
    }

    card.addEventListener('mousemove', function(e) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -12;
      const rotateY = ((x - centerX) / centerX) * 12;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;

      // Move glare
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;
      glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.22) 0%, transparent 60%)`;
      glare.style.opacity = '1';
    });

    card.addEventListener('mouseleave', function() {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      glare.style.opacity = '0';
    });
  });

  // -----------------------------------------------------------------
  // 5. INTERACTIVE 3D PHOTO CUBE SHOWCASE
  // -----------------------------------------------------------------
  const cube = document.getElementById('cube3d');
  if (cube) {
    let rotX = -15;
    let rotY = 25;
    let isCubeDragging = false;
    let startX = 0, startY = 0;
    let autoSpin = true;
    let autoSpinInterval = null;

    function applyCubeRotation() {
      cube.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    }

    // Auto-spin function
    function startAutoSpin() {
      if (autoSpinInterval) clearInterval(autoSpinInterval);
      autoSpinInterval = setInterval(() => {
        if (autoSpin && !isCubeDragging) {
          rotY = (rotY + 0.6) % 360;
          applyCubeRotation();
        }
      }, 30);
    }
    startAutoSpin();

    // Dragging Cube with mouse
    cube.addEventListener('mousedown', function(e) {
      isCubeDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      cube.style.transition = 'none';
    });

    window.addEventListener('mousemove', function(e) {
      if (!isCubeDragging) return;
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      rotY += deltaX * 0.5;
      rotX -= deltaY * 0.5;
      startX = e.clientX;
      startY = e.clientY;
      applyCubeRotation();
    });

    window.addEventListener('mouseup', function() {
      if (isCubeDragging) {
        isCubeDragging = false;
        cube.style.transition = 'transform 0.6s cubic-bezier(0.2, 0.8, 0.3, 1)';
      }
    });

    // Touch support for Cube
    cube.addEventListener('touchstart', function(e) {
      if (e.touches.length === 1) {
        isCubeDragging = true;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        cube.style.transition = 'none';
      }
    }, { passive: true });

    cube.addEventListener('touchmove', function(e) {
      if (!isCubeDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - startX;
      const deltaY = e.touches[0].clientY - startY;
      rotY += deltaX * 0.5;
      rotX -= deltaY * 0.5;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      applyCubeRotation();
    }, { passive: true });

    cube.addEventListener('touchend', function() {
      isCubeDragging = false;
      cube.style.transition = 'transform 0.6s cubic-bezier(0.2, 0.8, 0.3, 1)';
    });

    // Face Switcher Buttons
    const faceRotations = {
      'front':  { x: 0,   y: 0 },
      'back':   { x: 0,   y: 180 },
      'right':  { x: 0,   y: -90 },
      'left':   { x: 0,   y: 90 },
      'top':    { x: -90, y: 0 },
      'bottom': { x: 90,  y: 0 }
    };

    const pills = document.querySelectorAll('.cube-pill');
    pills.forEach(pill => {
      pill.addEventListener('click', function() {
        const face = this.getAttribute('data-face');
        if (faceRotations[face]) {
          autoSpin = false;
          rotX = faceRotations[face].x;
          rotY = faceRotations[face].y;
          cube.style.transition = 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
          applyCubeRotation();

          pills.forEach(p => p.classList.remove('active'));
          this.classList.add('active');
          window.RajvanshAudio.playPop(480);
        }
      });
    });

    // Auto-spin toggle button
    const autoSpinBtn = document.getElementById('cube-toggle-spin');
    if (autoSpinBtn) {
      autoSpinBtn.addEventListener('click', function() {
        autoSpin = !autoSpin;
        this.innerHTML = autoSpin ? '⏸ Pause' : '▶ Auto-Spin';
        window.RajvanshAudio.playPop(440);
      });
    }

    // Step Left / Right Buttons
    const stepL = document.getElementById('cube-prev');
    const stepR = document.getElementById('cube-next');
    if (stepL) {
      stepL.addEventListener('click', () => {
        autoSpin = false;
        rotY -= 90;
        cube.style.transition = 'transform 0.7s ease';
        applyCubeRotation();
        window.RajvanshAudio.playHover();
      });
    }
    if (stepR) {
      stepR.addEventListener('click', () => {
        autoSpin = false;
        rotY += 90;
        cube.style.transition = 'transform 0.7s ease';
        applyCubeRotation();
        window.RajvanshAudio.playHover();
      });
    }

    // Click Cube Face -> Open Lightbox
    const cubeFaces = document.querySelectorAll('.cube-face');
    cubeFaces.forEach(f => {
      f.addEventListener('click', function(e) {
        if (!isCubeDragging) {
          const img = this.querySelector('img');
          const title = this.querySelector('strong')?.innerText || 'Rajvansh Campus';
          if (img) openLightbox(img.src, title);
        }
      });
    });
  }

  // -----------------------------------------------------------------
  // 6. INTERACTIVE CAMPUS EXPLORER (HOTSPOTS)
  // -----------------------------------------------------------------
  const hotspots = document.querySelectorAll('.campus-hotspot');
  const zoneTitle = document.getElementById('zone-title');
  const zoneDesc = document.getElementById('zone-desc');
  const zoneTags = document.getElementById('zone-tags');
  const campusBg = document.querySelector('.campus-bg-img');

  const zoneData = {
    '1': {
      title: '🔬 Science & Robotics Innovation Lab',
      desc: 'Equipped with digital microscopes, IoT sensors, chemistry workbenches and AI learning stations where theory meets live experiments.',
      tags: ['Physics', 'Chemistry', 'Robotics', 'Hands-on Experiments'],
      bg: 'assets/science-lab.jpg'
    },
    '2': {
      title: '💻 Computer Learning & Digital Media Hub',
      desc: 'High-speed coding laboratory featuring interactive smartboards, creative media workstations and future-ready computer curricula.',
      tags: ['Coding & Python', 'Cyber Safety', 'Smart Class', 'Digital Literacy'],
      bg: 'assets/computer-learning.jpg'
    },
    '3': {
      title: '📖 Smart Classrooms & Central Library',
      desc: 'Ergonomic, sunlit classrooms designed for collaborative discussions, extensive fiction and encyclopedic book collections.',
      tags: ['Collaborative Class', 'Extensive Books', 'Interactive Screens'],
      bg: 'assets/reading-session.jpg'
    },
    '4': {
      title: '🎭 Cultural Arts & Dance Pavilion',
      desc: 'Spacious wooden-floor studio dedicated to classical dance, contemporary theatre, rhythmic expression and vocal music.',
      tags: ['Kathak & Folk', 'Music Studio', 'Public Speaking', 'Drama'],
      bg: 'assets/dance-session.jpg'
    },
    '5': {
      title: '⚽ Athletic Grounds & Yoga Sanctuary',
      desc: 'Open green sports arena for football, cricket, track events, and peaceful morning yoga sessions fostering strength and calmness.',
      tags: ['Yoga & Mindfulness', 'Athletics', 'Team Sports', 'Fitness Track'],
      bg: 'assets/yoga-classes.jpg'
    }
  };

  hotspots.forEach(spot => {
    spot.addEventListener('click', function() {
      const id = this.getAttribute('data-zone');
      const data = zoneData[id];
      if (!data) return;

      hotspots.forEach(s => s.classList.remove('active'));
      this.classList.add('active');

      if (zoneTitle) zoneTitle.innerHTML = data.title;
      if (zoneDesc) zoneDesc.innerHTML = data.desc;
      if (zoneTags) {
        zoneTags.innerHTML = data.tags.map(t => `<span class="zone-tag">${t}</span>`).join('');
      }
      if (campusBg && data.bg) {
        campusBg.style.opacity = '0.4';
        setTimeout(() => {
          campusBg.src = data.bg;
          campusBg.style.opacity = '1';
        }, 200);
      }

      window.RajvanshAudio.playPop(520);
    });
  });

  // -----------------------------------------------------------------
  // 7. 3D PHOTO GALLERY FILTERS & LIGHTBOX
  // -----------------------------------------------------------------
  const filterBtns = document.querySelectorAll('.gal-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-3d-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const filter = this.getAttribute('data-filter');
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      galleryItems.forEach(item => {
        const cat = item.getAttribute('data-cat');
        if (filter === 'all' || cat === filter) {
          item.style.display = 'block';
          item.style.animation = 'popIn 0.4s ease';
        } else {
          item.style.display = 'none';
        }
      });
      window.RajvanshAudio.playHover();
    });
  });

  // Lightbox Modal
  const modal = document.getElementById('lightbox-modal');
  const modalImg = document.getElementById('lightbox-img');
  const modalCaption = document.getElementById('lightbox-caption');
  const modalClose = document.getElementById('lightbox-close');

  function openLightbox(src, caption) {
    if (!modal || !modalImg) return;
    modalImg.src = src;
    if (modalCaption) modalCaption.textContent = caption || 'Rajvansh School Life';
    modal.classList.add('active');
    window.RajvanshAudio.playPop(600);
  }

  function closeLightbox() {
    if (!modal) return;
    modal.classList.remove('active');
  }

  if (modalClose) modalClose.addEventListener('click', closeLightbox);
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) closeLightbox();
    });
  }

  galleryItems.forEach(item => {
    item.addEventListener('click', function() {
      const img = this.querySelector('img');
      const title = this.querySelector('strong')?.innerText || 'School Activity';
      if (img) openLightbox(img.src, title);
    });
  });

  window.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeLightbox();
    }
  });

  // -----------------------------------------------------------------
  // 8. ADMISSION / ENQUIRY FORM WITH CONFETTI CELEBRATION
  // -----------------------------------------------------------------
  const enquiryForm = document.getElementById('enquiry-form');
  const successOverlay = document.getElementById('form-success-overlay');
  const resetFormBtn = document.getElementById('reset-form-btn');

  if (enquiryForm) {
    enquiryForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const name = document.getElementById('enq-name')?.value || 'Student';
      const studentNameEl = document.getElementById('success-name');
      if (studentNameEl) studentNameEl.textContent = name;

      // Confetti burst
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#00e5ff', '#ffbe2e', '#1e4f9c', '#ffffff', '#00ff88']
        });
      }

      window.RajvanshAudio.playSuccess();

      if (successOverlay) {
        successOverlay.classList.add('active');
      }
    });
  }

  if (resetFormBtn && successOverlay && enquiryForm) {
    resetFormBtn.addEventListener('click', function() {
      successOverlay.classList.remove('active');
      enquiryForm.reset();
      window.RajvanshAudio.playPop(440);
    });
  }

  // -----------------------------------------------------------------
  // 9. MOBILE MENU & HEADER SCROLL & BACK TO TOP
  // -----------------------------------------------------------------
  const menuToggle = document.querySelector('.menu-toggle');
  const navlinks = document.getElementById('navlinks');
  if (menuToggle && navlinks) {
    menuToggle.addEventListener('click', function() {
      navlinks.classList.toggle('open');
      const expanded = navlinks.classList.contains('open');
      menuToggle.setAttribute('aria-expanded', expanded);
      window.RajvanshAudio.playPop();
    });
  }

  // Close nav on click
  document.querySelectorAll('.navlinks a').forEach(a => {
    a.addEventListener('click', () => {
      if (navlinks) navlinks.classList.remove('open');
      if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
    });
  });

  const header = document.querySelector('header');
  const backToTop = document.getElementById('back-to-top');

  window.addEventListener('scroll', function() {
    if (header) {
      if (window.scrollY > 40) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    }
    if (backToTop) {
      if (window.scrollY > 400) backToTop.classList.add('visible');
      else backToTop.classList.remove('visible');
    }
  });

  if (backToTop) {
    backToTop.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.RajvanshAudio.playPop(550);
    });
  }

  // Set Year in footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
