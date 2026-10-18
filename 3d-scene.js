/* ===================================================================
   RAJVANSH 3D HERO WEBGL SCENE (POWERED BY THREE.JS)
   =================================================================== */

(function() {
  'use strict';

  const container = document.querySelector('.hero-3d-canvas-wrap');
  const canvas = document.getElementById('webgl-hero-canvas');
  if (!container || !canvas || typeof THREE === 'undefined') return;

  // 1. Scene, Camera, Renderer
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x070e1c, 0.025);

  const width = container.clientWidth || 600;
  const height = container.clientHeight || 520;

  const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
  camera.position.set(0, 0, 16);

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // 2. Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0x00e5ff, 1.8);
  dirLight.position.set(10, 15, 10);
  scene.add(dirLight);

  const pointLightGold = new THREE.PointLight(0xffbe2e, 2.5, 30);
  pointLightGold.position.set(-8, -5, 8);
  scene.add(pointLightGold);

  const pointLightPurple = new THREE.PointLight(0x9d4edd, 2, 25);
  pointLightPurple.position.set(8, 10, -5);
  scene.add(pointLightPurple);

  // Group that holds the entire interactive universe
  const worldGroup = new THREE.Group();
  scene.add(worldGroup);

  // Interactive objects array for Raycaster
  const interactiveObjects = [];

  // -----------------------------------------------------------------
  // A. CENTRAL HOLOGRAPHIC GLOBE OF KNOWLEDGE
  // -----------------------------------------------------------------
  const globeGroup = new THREE.Group();

  // Wireframe globe
  const sphereGeo = new THREE.SphereGeometry(3.6, 28, 28);
  const sphereMat = new THREE.MeshStandardMaterial({
    color: 0x1e4f9c,
    wireframe: true,
    transparent: true,
    opacity: 0.35,
    roughness: 0.2,
    metalness: 0.8
  });
  const globeMesh = new THREE.Mesh(sphereGeo, sphereMat);
  globeGroup.add(globeMesh);

  // Glowing inner core
  const coreGeo = new THREE.SphereGeometry(2.2, 20, 20);
  const coreMat = new THREE.MeshBasicMaterial({
    color: 0x00e5ff,
    transparent: true,
    opacity: 0.2,
    wireframe: false
  });
  const coreMesh = new THREE.Mesh(coreGeo, coreMat);
  globeGroup.add(coreMesh);

  // Orbiting Rings
  const ringGeo1 = new THREE.TorusGeometry(4.8, 0.04, 16, 100);
  const ringMat1 = new THREE.MeshBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.8 });
  const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
  ring1.rotation.x = Math.PI / 3;
  globeGroup.add(ring1);

  const ringGeo2 = new THREE.TorusGeometry(5.4, 0.03, 16, 100);
  const ringMat2 = new THREE.MeshBasicMaterial({ color: 0xffbe2e, transparent: true, opacity: 0.65 });
  const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
  ring2.rotation.x = -Math.PI / 4;
  ring2.rotation.y = Math.PI / 6;
  globeGroup.add(ring2);

  // Globe achievement beacons (glowing nodes on surface)
  const beaconGeo = new THREE.SphereGeometry(0.14, 12, 12);
  const beaconMat = new THREE.MeshBasicMaterial({ color: 0xffbe2e });
  for (let i = 0; i < 8; i++) {
    const beacon = new THREE.Mesh(beaconGeo, beaconMat);
    const phi = Math.acos(-1 + (2 * i) / 8);
    const theta = Math.sqrt(8 * Math.PI) * phi;
    beacon.position.setFromSphericalCoords(3.6, phi, theta);
    globeGroup.add(beacon);
  }

  globeMesh.userData = { name: "Globe of Knowledge", tip: "Global Vision & Lifelong Learning" };
  interactiveObjects.push(globeMesh);
  worldGroup.add(globeGroup);

  // -----------------------------------------------------------------
  // B. 3D GRADUATION CAP (ACADEMIC EXCELLENCE)
  // -----------------------------------------------------------------
  const capGroup = new THREE.Group();
  capGroup.position.set(-5.5, 3.2, 2);

  // Mortarboard flat top (square)
  const topGeo = new THREE.BoxGeometry(2.0, 0.08, 2.0);
  const capMat = new THREE.MeshStandardMaterial({
    color: 0x14223d,
    roughness: 0.3,
    metalness: 0.4
  });
  const capTop = new THREE.Mesh(topGeo, capMat);
  capTop.rotation.y = Math.PI / 4;
  capGroup.add(capTop);

  // Cap skull base
  const skullGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.5, 24);
  const skullMesh = new THREE.Mesh(skullGeo, capMat);
  skullMesh.position.y = -0.28;
  capGroup.add(skullMesh);

  // Tassel button & cord
  const btnGeo = new THREE.SphereGeometry(0.1, 12, 12);
  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xffbe2e,
    metalness: 0.9,
    roughness: 0.1
  });
  const tasselBtn = new THREE.Mesh(btnGeo, goldMat);
  tasselBtn.position.y = 0.08;
  capGroup.add(tasselBtn);

  // Hanging Tassel
  const tasselGeo = new THREE.ConeGeometry(0.12, 0.6, 12);
  const tasselMesh = new THREE.Mesh(tasselGeo, goldMat);
  tasselMesh.position.set(0.9, -0.4, 0.9);
  tasselMesh.rotation.z = Math.PI;
  capGroup.add(tasselMesh);

  capTop.userData = { name: "Graduation Cap", tip: "Academic Success & Future Leadership" };
  interactiveObjects.push(capTop);
  worldGroup.add(capGroup);

  // -----------------------------------------------------------------
  // C. 3D ATOM MODEL (SCIENCE & INNOVATION)
  // -----------------------------------------------------------------
  const atomGroup = new THREE.Group();
  atomGroup.position.set(5.5, 3.4, 1.5);

  // Nucleus
  const nucGeo = new THREE.SphereGeometry(0.5, 20, 20);
  const nucMat = new THREE.MeshStandardMaterial({
    color: 0x00e5ff,
    emissive: 0x00a3cc,
    emissiveIntensity: 0.5,
    metalness: 0.8
  });
  const nucleus = new THREE.Mesh(nucGeo, nucMat);
  atomGroup.add(nucleus);

  // 3 Orbiting Electron Rings
  const electronRings = [];
  const electrons = [];
  const electronGeo = new THREE.SphereGeometry(0.12, 12, 12);
  const electronMat = new THREE.MeshBasicMaterial({ color: 0xffbe2e });

  for (let i = 0; i < 3; i++) {
    const ringGeo = new THREE.TorusGeometry(1.6, 0.03, 16, 60);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      transparent: true,
      opacity: 0.5
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = (Math.PI / 3) * i;
    ring.rotation.y = (Math.PI / 4) * i;
    atomGroup.add(ring);
    electronRings.push(ring);

    const electron = new THREE.Mesh(electronGeo, electronMat);
    atomGroup.add(electron);
    electrons.push({ mesh: electron, angle: (i * Math.PI * 2) / 3, speed: 0.04 + i * 0.015 });
  }

  nucleus.userData = { name: "Science & AI Atom", tip: "STEM Laboratories & Practical Research" };
  interactiveObjects.push(nucleus);
  worldGroup.add(atomGroup);

  // -----------------------------------------------------------------
  // D. 3D OPEN BOOK (WISDOM & READING)
  // -----------------------------------------------------------------
  const bookGroup = new THREE.Group();
  bookGroup.position.set(-5.2, -3.2, 2.5);

  // Left page
  const pageGeoL = new THREE.BoxGeometry(1.1, 0.04, 1.5);
  const pageMat = new THREE.MeshStandardMaterial({
    color: 0xf4f7fc,
    roughness: 0.3
  });
  const pageL = new THREE.Mesh(pageGeoL, pageMat);
  pageL.position.set(-0.55, 0, 0);
  pageL.rotation.z = 0.2;
  bookGroup.add(pageL);

  // Right page
  const pageR = new THREE.Mesh(pageGeoL, pageMat);
  pageR.position.set(0.55, 0, 0);
  pageR.rotation.z = -0.2;
  bookGroup.add(pageR);

  // Book spine & cover
  const spineGeo = new THREE.CylinderGeometry(0.12, 0.12, 1.54, 16, 1, false, 0, Math.PI);
  const spineMat = new THREE.MeshStandardMaterial({ color: 0x1e4f9c });
  const spine = new THREE.Mesh(spineGeo, spineMat);
  spine.position.set(0, -0.06, 0);
  spine.rotation.x = Math.PI / 2;
  bookGroup.add(spine);

  pageL.userData = { name: "Open Book", tip: "Reading, Language & Creative Arts" };
  interactiveObjects.push(pageL);
  worldGroup.add(bookGroup);

  // -----------------------------------------------------------------
  // E. 3D GOLDEN TROPHY STAR (HONOR & VICTORY)
  // -----------------------------------------------------------------
  const starGroup = new THREE.Group();
  starGroup.position.set(5.3, -3.0, 2);

  const starGeo = new THREE.OctahedronGeometry(0.85, 0);
  const starMat = new THREE.MeshStandardMaterial({
    color: 0xffbe2e,
    metalness: 0.9,
    roughness: 0.15,
    emissive: 0xff8800,
    emissiveIntensity: 0.2
  });
  const starMesh = new THREE.Mesh(starGeo, starMat);
  starGroup.add(starMesh);

  // Star orbital ring
  const starRingGeo = new THREE.TorusGeometry(1.3, 0.03, 16, 50);
  const starRingMat = new THREE.MeshBasicMaterial({ color: 0xffbe2e, transparent: true, opacity: 0.6 });
  const starRing = new THREE.Mesh(starRingGeo, starRingMat);
  starRing.rotation.x = Math.PI / 2.5;
  starGroup.add(starRing);

  starMesh.userData = { name: "Golden Star Trophy", tip: "Sports, Leadership & Character" };
  interactiveObjects.push(starMesh);
  worldGroup.add(starGroup);

  // -----------------------------------------------------------------
  // F. FLOATING 3D PARTICLES / STARDUST
  // -----------------------------------------------------------------
  const particleCount = 600;
  const particleGeo = new THREE.BufferGeometry();
  const particlePos = new Float32Array(particleCount * 3);
  const particleScales = new Float32Array(particleCount);

  for (let i = 0; i < particleCount * 3; i += 3) {
    particlePos[i] = (Math.random() - 0.5) * 36;
    particlePos[i + 1] = (Math.random() - 0.5) * 24;
    particlePos[i + 2] = (Math.random() - 0.5) * 24;
    particleScales[i / 3] = Math.random();
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0x00e5ff,
    size: 0.12,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending
  });
  const particleSystem = new THREE.Points(particleGeo, particleMat);
  scene.add(particleSystem);

  // -----------------------------------------------------------------
  // INTERACTIVITY: MOUSE PARALLAX, DRAG ORBIT, RAYCASTING
  // -----------------------------------------------------------------
  let mouseX = 0, mouseY = 0;
  let targetRotationX = 0, targetRotationY = 0;
  let isDragging = false;
  let previousMouseX = 0, previousMouseY = 0;
  let speedMultiplier = 1;
  const raycaster = new THREE.Raycaster();
  const mouseVec = new THREE.Vector2(-999, -999);
  const hintEl = document.querySelector('.canvas-hint');

  // Mouse Move on Container
  container.addEventListener('mousemove', function(e) {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    mouseVec.x = (x / rect.width) * 2 - 1;
    mouseVec.y = -(y / rect.height) * 2 + 1;

    if (!isDragging) {
      mouseX = mouseVec.x * 0.45;
      mouseY = mouseVec.y * 0.45;
    } else {
      const deltaX = e.clientX - previousMouseX;
      const deltaY = e.clientY - previousMouseY;
      worldGroup.rotation.y += deltaX * 0.008;
      worldGroup.rotation.x += deltaY * 0.008;
      previousMouseX = e.clientX;
      previousMouseY = e.clientY;
    }
  });

  // Mouse Down / Up for Drag Rotation
  container.addEventListener('mousedown', function(e) {
    isDragging = true;
    previousMouseX = e.clientX;
    previousMouseY = e.clientY;
  });

  window.addEventListener('mouseup', function() {
    isDragging = false;
  });

  // Touch Support for mobile
  container.addEventListener('touchstart', function(e) {
    if (e.touches.length === 1) {
      isDragging = true;
      previousMouseX = e.touches[0].clientX;
      previousMouseY = e.touches[0].clientY;
    }
  }, { passive: true });

  container.addEventListener('touchmove', function(e) {
    if (isDragging && e.touches.length === 1) {
      const deltaX = e.touches[0].clientX - previousMouseX;
      const deltaY = e.touches[0].clientY - previousMouseY;
      worldGroup.rotation.y += deltaX * 0.01;
      worldGroup.rotation.x += deltaY * 0.01;
      previousMouseX = e.touches[0].clientX;
      previousMouseY = e.touches[0].clientY;
    }
  }, { passive: true });

  window.addEventListener('touchend', function() {
    isDragging = false;
  });

  // Click on Canvas: Particle Shockwave + Sound
  canvas.addEventListener('click', function(e) {
    // Sound FX if audio enabled
    if (window.RajvanshAudio) {
      window.RajvanshAudio.playChime(520, 'sine', 0.15);
    }

    // Shockwave animation on particle system
    gsap.to(particleSystem.scale, {
      x: 1.25,
      y: 1.25,
      z: 1.25,
      duration: 0.35,
      yoyo: true,
      repeat: 1,
      ease: "power2.out"
    });
  });

  // Controls UI Buttons
  const resetBtn = document.getElementById('btn-reset-3d');
  if (resetBtn) {
    resetBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      gsap.to(worldGroup.rotation, { x: 0, y: 0, z: 0, duration: 1.2, ease: "power2.out" });
      if (window.RajvanshAudio) window.RajvanshAudio.playPop();
    });
  }

  const speedBtn = document.getElementById('btn-speed-3d');
  if (speedBtn) {
    speedBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      speedMultiplier = speedMultiplier === 1 ? 2.5 : 1;
      speedBtn.textContent = speedMultiplier === 1 ? '⚡ 1x' : '🚀 2.5x';
      if (window.RajvanshAudio) window.RajvanshAudio.playPop();
    });
  }

  const themeBtn = document.getElementById('btn-color-3d');
  let currentThemeIndex = 0;
  const themeColors = [
    { name: "Cyan", globe: 0x00e5ff, star: 0xffbe2e, particles: 0x00e5ff },
    { name: "Gold", globe: 0xffbe2e, star: 0xff4500, particles: 0xffbe2e },
    { name: "Emerald", globe: 0x00ffb2, star: 0x00e5ff, particles: 0x00ffb2 }
  ];

  if (themeBtn) {
    themeBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      currentThemeIndex = (currentThemeIndex + 1) % themeColors.length;
      const theme = themeColors[currentThemeIndex];
      ringMat1.color.setHex(theme.globe);
      coreMat.color.setHex(theme.globe);
      particleMat.color.setHex(theme.particles);
      starMat.color.setHex(theme.star);
      if (window.RajvanshAudio) window.RajvanshAudio.playChime(640, 'triangle', 0.2);
    });
  }

  // -----------------------------------------------------------------
  // ANIMATION LOOP (60FPS)
  // -----------------------------------------------------------------
  let clock = new THREE.Clock();
  let hoveredObject = null;

  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime() * speedMultiplier;

    // Smooth camera inertia & parallax
    if (!isDragging) {
      camera.position.x += (mouseX * 5 - camera.position.x) * 0.05;
      camera.position.y += (-mouseY * 4 - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      worldGroup.rotation.y += 0.002 * speedMultiplier;
    }

    // Globe rotations
    globeMesh.rotation.y = elapsedTime * 0.15;
    globeMesh.rotation.x = Math.sin(elapsedTime * 0.1) * 0.1;
    ring1.rotation.z = elapsedTime * 0.2;
    ring2.rotation.z = -elapsedTime * 0.18;

    // Cap floating
    capGroup.position.y = 3.2 + Math.sin(elapsedTime * 1.5) * 0.25;
    capGroup.rotation.y = Math.sin(elapsedTime * 0.8) * 0.2;
    tasselMesh.rotation.z = Math.PI + Math.sin(elapsedTime * 2.5) * 0.15;

    // Atom orbital animations
    atomGroup.position.y = 3.4 + Math.cos(elapsedTime * 1.3) * 0.2;
    atomGroup.rotation.y = elapsedTime * 0.5;
    electrons.forEach((item, idx) => {
      item.angle += item.speed * speedMultiplier;
      const r = 1.6;
      item.mesh.position.set(
        Math.cos(item.angle) * r,
        Math.sin(item.angle) * Math.sin(idx * 1.2) * r,
        Math.sin(item.angle) * Math.cos(idx * 1.2) * r
      );
    });

    // Book floating & subtle opening
    bookGroup.position.y = -3.2 + Math.sin(elapsedTime * 1.4) * 0.2;
    bookGroup.rotation.y = Math.sin(elapsedTime * 0.6) * 0.3;
    pageL.rotation.z = 0.2 + Math.sin(elapsedTime * 1.2) * 0.05;
    pageR.rotation.z = -0.2 - Math.sin(elapsedTime * 1.2) * 0.05;

    // Star rotating
    starGroup.position.y = -3.0 + Math.cos(elapsedTime * 1.6) * 0.22;
    starMesh.rotation.y = elapsedTime * 0.8;
    starMesh.rotation.x = elapsedTime * 0.4;
    starRing.rotation.z = -elapsedTime * 0.5;

    // Stardust slowly floating
    particleSystem.rotation.y = elapsedTime * 0.03;
    particleSystem.rotation.x = Math.sin(elapsedTime * 0.02) * 0.05;

    // Raycaster detection on mouse hover
    raycaster.setFromCamera(mouseVec, camera);
    const intersects = raycaster.intersectObjects(interactiveObjects);

    if (intersects.length > 0) {
      const hit = intersects[0].object;
      if (hoveredObject !== hit) {
        hoveredObject = hit;
        canvas.style.cursor = 'pointer';
        if (hintEl && hit.userData && hit.userData.name) {
          hintEl.innerHTML = `✨ <strong>${hit.userData.name}:</strong> ${hit.userData.tip}`;
          hintEl.style.borderColor = 'var(--accent-cyan)';
          hintEl.style.color = '#fff';
        }
        if (window.RajvanshAudio) window.RajvanshAudio.playHover();
      }
    } else {
      if (hoveredObject) {
        hoveredObject = null;
        canvas.style.cursor = isDragging ? 'grabbing' : 'grab';
        if (hintEl) {
          hintEl.innerHTML = `✨ Drag to rotate • Click for shockwave`;
          hintEl.style.borderColor = 'var(--border-glass)';
          hintEl.style.color = 'var(--text-muted)';
        }
      }
    }

    renderer.render(scene, camera);
  }

  animate();

  // Resize Listener
  window.addEventListener('resize', function() {
    const newW = container.clientWidth;
    const newH = container.clientHeight;
    camera.aspect = newW / newH;
    camera.updateProjectionMatrix();
    renderer.setSize(newW, newH);
  });

})();
