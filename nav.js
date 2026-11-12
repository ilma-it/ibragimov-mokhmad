// ==========================================================================
// Theme Management (Light / Dark Theme) - Runs immediately to prevent FOUC
// ==========================================================================
(function initThemeImmediately() {
  const savedTheme = localStorage.getItem('site-theme');
  if (savedTheme === 'light') {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
  } else if (savedTheme === 'dark') {
    document.documentElement.classList.remove('light');
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
  }
})();

function getCurrentTheme() {
  return document.documentElement.classList.contains('light') ? 'light' : 'dark';
}

function setTheme(theme) {
  // Add smooth transition class to root during theme switch
  document.documentElement.classList.add('theme-transitioning');

  if (theme === 'light') {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
    localStorage.setItem('site-theme', 'light');
  } else {
    document.documentElement.classList.remove('light');
    document.documentElement.classList.add('dark');
    localStorage.setItem('site-theme', 'dark');
  }
  updateThemeToggleButtons();
  window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));

  // Tactile animation pulse on toggle buttons
  document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
    btn.classList.remove('theme-btn-pulse');
    void btn.offsetWidth; // force reflow
    btn.classList.add('theme-btn-pulse');
  });

  // Remove theme-transitioning class after animation completes
  setTimeout(() => {
    document.documentElement.classList.remove('theme-transitioning');
  }, 600);
}

function toggleTheme() {
  const current = getCurrentTheme();
  setTheme(current === 'light' ? 'dark' : 'light');
}

function updateThemeToggleButtons() {
  const isLight = getCurrentTheme() === 'light';
  document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
    btn.setAttribute('title', isLight ? 'Включить тёмную тему' : 'Включить светлую тему');
    btn.setAttribute('aria-label', isLight ? 'Включить тёмную тему' : 'Включить светлую тему');
  });
}

function setupThemeButtons() {
  const desktopNav = document.querySelector('header nav');
  if (desktopNav && !desktopNav.querySelector('.theme-toggle-btn')) {
    const btn = createThemeToggleButton();
    desktopNav.appendChild(btn);
  }

  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenu && !mobileMenu.querySelector('.mobile-theme-row')) {
    const mobileRow = document.createElement('div');
    mobileRow.className = 'mobile-theme-row pt-4 mt-2 border-t border-white/10 flex items-center justify-between';
    mobileRow.innerHTML = `
      <span class="text-sm font-['Montserrat'] font-medium text-on-surface-variant">Тема оформления</span>
    `;
    const btn = createThemeToggleButton();
    mobileRow.appendChild(btn);
    mobileMenu.appendChild(mobileRow);
  }

  document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
    btn.onclick = (e) => {
      e.preventDefault();
      toggleTheme();
    };
  });

  updateThemeToggleButtons();
}

function createThemeToggleButton() {
  const btn = document.createElement('button');
  btn.className = 'theme-toggle-btn ml-2';
  btn.setAttribute('type', 'button');
  btn.innerHTML = `
    <span class="material-symbols-outlined theme-icon-dark text-xl">light_mode</span>
    <span class="material-symbols-outlined theme-icon-light text-xl">dark_mode</span>
  `;
  return btn;
}

// Shared Navigation & UI logic
document.addEventListener('DOMContentLoaded', () => {
  // Theme button setup
  setupThemeButtons();

  // 1. Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // 2. Remove Contact Buttons and Modal (Clean UI)
  document.querySelectorAll('.contact-trigger').forEach(btn => btn.remove());
  const contactModal = document.getElementById('contact-modal');
  if (contactModal) contactModal.remove();

  // 3. Author Inscription on Hero Card ("Ибрагимов Мохмад")
  injectAuthorHeroBadge();


  // 4. Scroll animations observer
  const fadeElements = document.querySelectorAll('.fade-in-up');
  if (fadeElements.length > 0) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    fadeElements.forEach(el => observer.observe(el));
    
    // Auto-reveal elements already visible in viewport
    setTimeout(() => {
      fadeElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
          el.classList.add('is-visible');
        }
      });
    }, 150);
  }

  // 4. Secret Photos Easter Egg (клик по иконке листика)
  initSecretPhotosEasterEgg();
});

function initSecretPhotosEasterEgg() {
  const secretPhotos = [
    {
      url: encodeURI("секретные фото/Extreme_close_up_macrophotography_202608141647.jpeg"),
      title: "Экстремальный макро-план",
      subtitle: "Высокодетализированная съемка структурных элементов каркаса"
    },
    {
      url: encodeURI("секретные фото/Macro_camera_angle_of_scene_202608141647.jpeg"),
      title: "Инженерный ракурс остекления",
      subtitle: "Конструктивные узлы светопрозрачной кровли и климат-контроля"
    },
    {
      url: encodeURI("секретные фото/Macro_camera_zoom_on_detail_202608141646.jpeg"),
      title: "Фокусировка на микроклимате",
      subtitle: "Сенсорные датчики влажности и капельная подача раствора"
    },
    {
      url: encodeURI("секретные фото/Macro_photography_of_image_detail_202608141647 (5).jpeg"),
      title: "Прецизионная детализация узлов",
      subtitle: "Точные соединения несущих стоек и энергоэффективные профили"
    },
    {
      url: encodeURI("секретные фото/Macro_photography_revealing_imag…_202608141646.jpeg"),
      title: "Внутренняя экосистема теплицы",
      subtitle: "Рабочая зона ухода, многоярусные лотки культур и освещение"
    },
    {
      url: encodeURI("секретные фото/Macro_shot_revealing_image_detail_202608141646.jpeg"),
      title: "Прорастание микрозелени и корни",
      subtitle: "Капельное увлажнение, капли росы и здоровая корневая среда"
    },
    {
      url: encodeURI("секретные фото/Side_profile_view_of_subject_202608141649.jpeg"),
      title: "Боковой архитектурный профиль",
      subtitle: "Панорамный фасад умной теплицы с центральной климатической башней"
    }
  ];

  // Shuffled playlist deck: each photo appears in random order without repeating until all 7 are shown
  let playlist = [];
  let currentStep = 0;
  let autoCloseTimer = null;
  let countdownInterval = null;

  function getNextShuffledPhoto() {
    if (playlist.length === 0) {
      // Create indexes [0, 1, 2, 3]
      const indexes = secretPhotos.map((_, i) => i);
      // Fisher-Yates shuffle
      for (let i = indexes.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indexes[i], indexes[j]] = [indexes[j], indexes[i]];
      }
      playlist = indexes;
      currentStep = 0;
    }

    currentStep++;
    const photoIndex = playlist.shift();
    return {
      photo: secretPhotos[photoIndex],
      step: currentStep,
      total: secretPhotos.length
    };
  }

  // Find all leaf icons in headers
  const leafTriggers = document.querySelectorAll('.leaf-icon-btn, .leaf-trigger, header a .material-symbols-outlined');
  
  leafTriggers.forEach(el => {
    const triggerContainer = el.closest('div') || el;
    triggerContainer.classList.add('cursor-pointer');
    
    triggerContainer.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      triggerEasterEgg();
    });
  });

  function triggerEasterEgg() {
    // 1. Pick next shuffled photo from deck
    const currentItem = getNextShuffledPhoto();
    const photo = currentItem.photo;

    // 2. Play spinning animation on all leaf icons
    document.querySelectorAll('header .material-symbols-outlined').forEach(icon => {
      if (icon.textContent.trim() === 'eco') {
        icon.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
        icon.style.transform = 'rotate(360deg) scale(1.35)';
        setTimeout(() => { icon.style.transform = ''; }, 600);
      }
    });

    // 3. Ensure modal container exists
    let modal = document.getElementById('secret-easter-egg-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'secret-easter-egg-modal';
      modal.className = 'fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-[#06151c]/80 backdrop-blur-md opacity-0 transition-opacity duration-300 pointer-events-none';
      modal.innerHTML = `
        <div id="secret-card" class="relative bg-[#0e1d25]/95 border-2 border-primary/50 rounded-3xl p-5 md:p-6 shadow-[0_0_60px_rgba(172,206,197,0.4)] backdrop-blur-2xl max-w-lg w-full transform transition-all duration-300">
          
          <!-- Top Header Bar (Badge + Counter + Close Button) -->
          <div class="flex items-center justify-between mb-3.5">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span class="font-['Montserrat'] font-bold text-xs uppercase tracking-wider text-primary">🌿 Дополнительные фото</span>
            </div>
            <div class="flex items-center gap-2">
              <span id="secret-counter-badge" class="px-2.5 py-1 rounded-full bg-primary/15 border border-primary/30 text-[11px] font-['Montserrat'] font-semibold text-primary"></span>
              <button id="close-secret-modal" class="w-8 h-8 rounded-full bg-white/10 hover:bg-primary/20 text-white hover:text-primary flex items-center justify-center transition-all border border-white/10 shadow-lg" title="Закрыть">
                <span class="material-symbols-outlined text-base">close</span>
              </button>
            </div>
          </div>

          <!-- Image Container with Glow -->
          <div class="relative overflow-hidden rounded-2xl border border-white/15 bg-black/50 shadow-2xl group">
            <img id="secret-img" src="" alt="Секретное фото" class="w-full h-auto max-h-[58vh] object-cover rounded-2xl transform transition-transform duration-700 group-hover:scale-105" />
            <div class="absolute inset-0 bg-gradient-to-t from-[#06151c]/80 via-transparent to-transparent opacity-60 pointer-events-none"></div>
          </div>

          <!-- Captions -->
          <div class="mt-4 flex flex-col gap-1">
            <div id="secret-title" class="font-['Montserrat'] font-bold text-base md:text-lg text-white"></div>
            <div id="secret-subtitle" class="text-xs text-on-surface-variant font-medium"></div>
          </div>

          <!-- Progress Bar (Shrinks over 4s) -->
          <div class="mt-4 w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
            <div id="secret-bar" class="bg-gradient-to-r from-emerald-400 via-primary to-[#a6cfc3] h-full w-full rounded-full"></div>
          </div>
          
          <!-- Footer info -->
          <div class="mt-2 flex justify-end items-center text-[11px] text-on-surface-variant/80">
            <span id="secret-countdown" class="text-primary font-semibold">Закроется через 4 сек...</span>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      // Event handlers for closing
      const closeBtn = modal.querySelector('#close-secret-modal');
      closeBtn.addEventListener('click', closeSecretModal);
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeSecretModal();
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeSecretModal();
      });
    }

    // Populate data
    const img = modal.querySelector('#secret-img');
    const title = modal.querySelector('#secret-title');
    const subtitle = modal.querySelector('#secret-subtitle');
    const card = modal.querySelector('#secret-card');
    const bar = modal.querySelector('#secret-bar');
    const countdown = modal.querySelector('#secret-countdown');
    const counterBadge = modal.querySelector('#secret-counter-badge');

    img.src = photo.url;
    title.textContent = photo.title;
    subtitle.textContent = photo.subtitle;
    if (counterBadge) {
      counterBadge.textContent = `${currentItem.step} из ${currentItem.total}`;
    }

    // Reset previous timers
    if (autoCloseTimer) clearTimeout(autoCloseTimer);
    if (countdownInterval) clearInterval(countdownInterval);

    // Show modal with animation
    modal.classList.remove('pointer-events-none');
    modal.classList.remove('opacity-0');
    modal.classList.add('opacity-100');

    // Trigger pop-in CSS animation
    card.classList.remove('secret-modal-card');
    void card.offsetWidth; // Force reflow
    card.classList.add('secret-modal-card');

    // Smooth linear progress bar
    bar.style.transition = 'none';
    bar.style.width = '100%';
    void bar.offsetWidth; // Force reflow
    bar.style.transition = 'width 4s linear';
    bar.style.width = '0%';

    // Countdown text updates
    let remainingSeconds = 4;
    countdown.textContent = `Закроется через ${remainingSeconds} сек...`;
    countdownInterval = setInterval(() => {
      remainingSeconds--;
      if (remainingSeconds > 0) {
        countdown.textContent = `Закроется через ${remainingSeconds} сек...`;
      } else {
        clearInterval(countdownInterval);
      }
    }, 1000);

    // Auto-close after 4 seconds
    autoCloseTimer = setTimeout(() => {
      closeSecretModal();
    }, 4000);
  }

  function closeSecretModal() {
    const modal = document.getElementById('secret-easter-egg-modal');
    if (!modal) return;
    if (autoCloseTimer) clearTimeout(autoCloseTimer);
    if (countdownInterval) clearInterval(countdownInterval);
    modal.classList.remove('opacity-100');
    modal.classList.add('opacity-0');
    modal.classList.add('pointer-events-none');
  }
}

// 5. Inject Author Inscription Badge on Hero Card ("Ибрагимов Мохмад")
function injectAuthorHeroBadge() {
  const heroCard = document.querySelector('.glass-panel');
  if (!heroCard) return;
  const heroTitle = heroCard.querySelector('h1');
  if (heroTitle && !document.getElementById('author-hero-badge')) {
    const container = document.createElement('div');
    container.className = 'author-hero-container';
    container.innerHTML = `
      <div id="author-hero-badge" class="author-hero-badge">
        <span class="author-hero-dot"></span>
        <span class="author-hero-text">Ибрагимов Мохмад</span>
      </div>
    `;
    heroCard.insertBefore(container, heroTitle);
  }
}

// Also invoke immediately in case script executes after DOM is already populated
if (document.readyState === 'interactive' || document.readyState === 'complete') {
  injectAuthorHeroBadge();
}


