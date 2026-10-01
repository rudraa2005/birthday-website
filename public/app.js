(() => {
  "use strict";

  const content = window.BIRTHDAY_CONTENT;
  if (!content) return;

  const { site, timeline, traits, apology, letter, gallery, playlist } = content;
  const app = document.getElementById("app");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let activeGalleryIndex = 0;
  let lastGalleryTrigger = null;
  let lastLetterTrigger = null;

  const escapeHTML = (value = "") => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  const image = (src, alt, className = "") => `
    <div class="image-holder ${className}">
      <img src="${escapeHTML(src)}" alt="${escapeHTML(alt)}" loading="lazy" decoding="async" />
      <span class="image-placeholder">${escapeHTML(site.imageFallback)}</span>
    </div>`;

  const heroLines = (site.heroLines?.length ? site.heroLines : [site.heroTitle]).map((line, lineIndex) => `
    <span class="hero__line">${[...line].map((char, index) => {
      const delay = 160 + (lineIndex * 120) + index * 34;
      if (char === " ") return `<span class="letter space" aria-hidden="true" style="animation-delay:${delay}ms"></span>`;
      return `<span class="letter" aria-hidden="true" style="animation-delay:${delay}ms">${escapeHTML(char)}</span>`;
    }).join("")}</span>`).join("");

  const timelineHTML = timeline.map((event, index) => `
    <article class="timeline-item reveal">
      <span class="timeline-item__node" aria-hidden="true">${escapeHTML(event.icon)}</span>
      <div class="timeline-item__card">
        <p class="timeline-item__date">${escapeHTML(event.date)}</p>
        <p class="timeline-item__text">${escapeHTML(event.text)}</p>
      </div>
    </article>`).join("");

  const chapterHTML = traits.map((trait, index) => `
    <article class="chapter">
      <div class="chapter__inner">
        <div class="chapter__photo image-holder reveal">
          <img class="js-parallax" src="${escapeHTML(trait.image)}" alt="${escapeHTML(trait.alt)}" loading="lazy" decoding="async" />
          <span class="image-placeholder">${escapeHTML(site.imageFallback)}</span>
        </div>
        <div class="chapter__copy reveal">
          <span class="chapter__number">${escapeHTML(site.chapterLabel)} ${String(index + 1).padStart(2, "0")}</span>
          <h3 class="chapter__title">${escapeHTML(trait.title)}</h3>
          <p class="chapter__description">${escapeHTML(trait.description)}</p>
        </div>
      </div>
    </article>`).join("");

  const apologyHTML = apology.map((line, index) => `
    <p class="apology__line reveal" style="--delay:${index * 90}ms">${escapeHTML(line)}</p>`).join("");

  const galleryHTML = gallery.map((item, index) => {
    const rotation = [-2.7, 2.1, -1.2, 3.1, -3.4, 1.4, 2.7, -2.3, 1.6, -3][index % 10];
    return `
      <button class="polaroid reveal" type="button" data-gallery-index="${index}" style="--rotation:${rotation}deg" aria-label="${escapeHTML(item.caption)}">
        <span class="polaroid__image image-holder">
          <img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.alt)}" loading="lazy" decoding="async" />
          <span class="image-placeholder">${escapeHTML(site.imageFallback)}</span>
        </span>
        <span class="polaroid__caption">${escapeHTML(item.caption)}</span>
      </button>`;
  }).join("");

  const playlistControls = playlist.length ? `
    <div class="music-player" id="musicPlayer" aria-live="polite">
      <div class="music-player__track"><span>${escapeHTML(site.musicLabel)}</span><b id="trackTitle"></b></div>
      <button type="button" id="musicToggle" aria-label="${escapeHTML(site.mute)}" title="${escapeHTML(site.mute)}">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 10v4h4l5 4V6l-5 4H3zm12.5 2a3.5 3.5 0 0 0-2.1-3.2v6.4a3.5 3.5 0 0 0 2.1-3.2zM13.4 3.7v2.1a6.7 6.7 0 0 1 0 12.4v2.1a8.7 8.7 0 0 0 0-16.6z" /></svg>
      </button>
      <button type="button" id="nextTrack" aria-label="${escapeHTML(site.nextTrack)}" title="${escapeHTML(site.nextTrack)}">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 5v14l11-7L6 5zm12 0v14h2V5h-2z" /></svg>
      </button>
    </div>` : "";

  app.innerHTML = `
    <div class="site">
      <section class="gate" id="gate" aria-label="Opening screen">
        <div class="gate__inner" id="gateInner"></div>
      </section>

      <section class="hero" aria-labelledby="hero-title">
        <div class="hero__media image-holder">
          <img src="/public/photos/landing-page.JPG" alt="${escapeHTML(site.heroTitle)}" fetchpriority="high" />
          <span class="image-placeholder">${escapeHTML(site.imageFallback)}</span>
        </div>
        <div class="hero__content">
          <h1 id="hero-title" class="hero__title" aria-label="${escapeHTML(site.heroTitle)}">${heroLines}</h1>
        </div>
        <div class="hero__scroll" aria-hidden="true">${escapeHTML(site.scrollHint)}</div>
      </section>

      <section class="section story" aria-labelledby="story-title">
        <div class="section-heading reveal">
          <p class="eyebrow">${escapeHTML(site.storyEyebrow)}</p>
          <h2 id="story-title" class="section-heading__title">${escapeHTML(site.storyTitle)}</h2>
          <p class="section-heading__intro">${escapeHTML(site.storyIntro)}</p>
        </div>
        <div class="timeline" id="timeline">
          <div class="timeline__line" aria-hidden="true"></div>
          <div class="timeline__progress" aria-hidden="true"></div>
          ${timelineHTML}
        </div>
      </section>

      <section class="chapters" aria-labelledby="chapters-title">
        <div class="section-heading reveal">
          <p class="eyebrow">${escapeHTML(site.traitsEyebrow)}</p>
          <h2 id="chapters-title" class="section-heading__title">${escapeHTML(site.traitsTitle)}</h2>
        </div>
        ${chapterHTML}
      </section>

      <section class="apology" aria-labelledby="apology-title">
        <div class="apology__inner">
          <p class="eyebrow reveal">${escapeHTML(site.apologyEyebrow)}</p>
          <h2 id="apology-title" class="apology__title reveal">${escapeHTML(site.apologyTitle)}</h2>
          ${apologyHTML}
        </div>
      </section>

      <section class="letter-section" aria-labelledby="letter-title">
        <div class="section-heading reveal">
          <p class="eyebrow">${escapeHTML(site.letterEyebrow)}</p>
          <h2 id="letter-title" class="section-heading__title">${escapeHTML(site.letterTitle)}</h2>
        </div>
        <div class="envelope-wrap reveal">
          <button type="button" class="envelope" id="envelope" aria-expanded="false" aria-controls="letterModal">
            <span class="envelope__back" aria-hidden="true"></span>
            <span class="envelope__flap" aria-hidden="true"></span>
            <span class="envelope__front" aria-hidden="true"></span>
            <span class="envelope__seal" aria-hidden="true">♥</span>
            <span class="envelope__hint">${escapeHTML(site.envelopeHint)}</span>
          </button>
        </div>
      </section>

      <section class="section gallery" aria-labelledby="gallery-title">
        <div class="section-heading reveal">
          <p class="eyebrow">${escapeHTML(site.galleryEyebrow)}</p>
          <h2 id="gallery-title" class="section-heading__title">${escapeHTML(site.galleryTitle)}</h2>
          <p class="section-heading__intro">${escapeHTML(site.galleryIntro)}</p>
        </div>
        <div class="gallery-grid">${galleryHTML}</div>
      </section>

      <footer class="site-footer">
        <p class="site-footer__line">${escapeHTML(site.footerLine)}</p>
        <p class="site-footer__subline">${escapeHTML(site.footerSubline)}</p>
        <span class="site-footer__heart" aria-hidden="true">♥</span>
      </footer>
    </div>

    <div class="letter-modal" id="letterModal" role="dialog" aria-modal="true" aria-labelledby="letter-title" hidden>
      <article class="letter-paper" tabindex="-1">
        <button class="letter-paper__close" type="button" id="closeLetter">${escapeHTML(site.closeLetter)}</button>
        <div class="letter-paper__body">
          <p class="letter-paper__greeting">${escapeHTML(letter.greeting)}</p>
          ${letter.paragraphs.map((paragraph) => `<p>${escapeHTML(paragraph)}</p>`).join("")}
          <p class="letter-paper__signature">${escapeHTML(letter.signature)}</p>
        </div>
      </article>
    </div>

    <div class="gallery-modal" id="galleryModal" role="dialog" aria-modal="true" aria-live="polite" aria-label="${escapeHTML(site.galleryTitle)}" hidden>
      <div class="gallery-modal__panel" id="galleryPanel">
        <button class="gallery-modal__close" id="closeGallery" type="button" aria-label="${escapeHTML(site.galleryClose)}">×</button>
        <div class="gallery-modal__photo image-holder" id="galleryModalPhoto"></div>
        <div class="gallery-modal__copy">
          <p class="gallery-modal__eyebrow" id="galleryPosition"></p>
          <h3 class="gallery-modal__caption" id="galleryModalCaption"></h3>
          <p class="gallery-modal__memory" id="galleryModalMemory"></p>
          <div class="gallery-modal__navigation">
            <button class="gallery-modal__nav" id="previousGallery" type="button">${escapeHTML(site.galleryPrevious)}</button>
            <button class="gallery-modal__nav" id="nextGallery" type="button">${escapeHTML(site.galleryNext)}</button>
          </div>
        </div>
      </div>
    </div>
    ${playlistControls}
  `;

  document.title = site.pageTitle;
  document.body.classList.add("gate-active");

  function configureImageFallbacks(root = document) {
    root.querySelectorAll("img").forEach((img) => {
      const showFallback = () => img.closest(".image-holder")?.classList.add("is-missing");
      img.addEventListener("error", showFallback, { once: true });
      if (img.complete && !img.naturalWidth) showFallback();
    });
  }
  configureImageFallbacks();

  function renderGate() {
    const gateInner = document.getElementById("gateInner");
    if (site.optionalGate?.enabled) {
      gateInner.innerHTML = `
        <form class="gate__form" id="gateForm">
          <label for="gateAnswer">${escapeHTML(site.optionalGate.prompt)}</label>
          <input class="gate__input" id="gateAnswer" inputmode="numeric" autocomplete="off" aria-describedby="gateHint gateError" placeholder="${escapeHTML(site.optionalGate.hint)}" />
          <span id="gateHint" class="gate__hint">${escapeHTML(site.openingHint)}</span>
          <button class="gate__submit" type="submit">${escapeHTML(site.optionalGate.button)}</button>
          <p id="gateError" class="gate__error" role="alert"></p>
        </form>`;
      const form = document.getElementById("gateForm");
      const input = document.getElementById("gateAnswer");
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        if (input.value.trim() === String(site.optionalGate.answer)) openWorld();
        else document.getElementById("gateError").textContent = site.optionalGate.error;
      });
      input.focus();
      return;
    }

    gateInner.innerHTML = `
      <p class="gate__eyebrow">${escapeHTML(site.openingHint)}</p>
      <button class="gate__button" type="button" id="openGate">
        <span class="gate__heart" aria-hidden="true">${escapeHTML(site.openingHeart)}</span>
        <span>${escapeHTML(site.openingPrompt)}</span>
      </button>`;
    const button = document.getElementById("openGate");
    button.addEventListener("click", openWorld, { once: true });
    button.focus();
  }

  let audio;
  let musicIndex = 0;
  let musicStarted = false;

  function beginMusic() {
    if (!playlist.length || musicStarted) return;
    musicStarted = true;
    audio = new Audio();
    audio.preload = "metadata";
    audio.addEventListener("ended", () => playTrack((musicIndex + 1) % playlist.length));
    audio.addEventListener("error", () => {
      document.getElementById("musicPlayer")?.classList.remove("is-visible");
    });
    document.getElementById("musicToggle")?.addEventListener("click", toggleMusic);
    document.getElementById("nextTrack")?.addEventListener("click", () => playTrack((musicIndex + 1) % playlist.length));
    playTrack(0, true);
  }

  function playTrack(index, fadeIn = false) {
    if (!audio || !playlist.length) return;
    musicIndex = index;
    const current = playlist[musicIndex];
    document.getElementById("trackTitle").textContent = current.title;
    audio.src = current.src;
    audio.volume = fadeIn ? 0 : .36;
    audio.muted = false;
    audio.play().then(() => {
      document.getElementById("musicPlayer")?.classList.add("is-visible");
      if (fadeIn && !reducedMotion) fadeAudio(.36);
    }).catch(() => {});
    updateMusicButton();
  }

  function fadeAudio(target) {
    const step = () => {
      if (!audio || audio.volume >= target) return;
      audio.volume = Math.min(target, audio.volume + .025);
      window.setTimeout(step, 70);
    };
    step();
  }

  function toggleMusic() {
    if (!audio) return;
    audio.muted = !audio.muted;
    updateMusicButton();
  }

  function updateMusicButton() {
    const button = document.getElementById("musicToggle");
    if (!button || !audio) return;
    const label = audio.muted ? site.unmute : site.mute;
    button.setAttribute("aria-label", label);
    button.title = label;
  }

  function openWorld() {
    document.getElementById("gate").classList.add("is-leaving");
    document.body.classList.remove("gate-active");
    beginMusic();
  }

  function initRevealAnimations() {
    const revealItems = document.querySelectorAll(".reveal");
    if (reducedMotion || !("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("in-view"));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      });
    }, { threshold: .12, rootMargin: "0px 0px -35px" });
    revealItems.forEach((item) => observer.observe(item));
  }

  function initScrollDetails() {
    const timelineElement = document.getElementById("timeline");
    const parallaxItems = [...document.querySelectorAll(".js-parallax")];
    if (reducedMotion) return;
    let framePending = false;
    const update = () => {
      framePending = false;
      const viewportHeight = window.innerHeight;
      const timelineRect = timelineElement.getBoundingClientRect();
      const total = timelineRect.height + viewportHeight * .72;
      const passed = viewportHeight * .57 - timelineRect.top;
      const progress = Math.max(0, Math.min(1, passed / total));
      timelineElement.style.setProperty("--timeline-progress", progress);
      parallaxItems.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const distance = (rect.top + rect.height / 2 - viewportHeight / 2) / viewportHeight;
        item.style.setProperty("--parallax-y", `${Math.max(-7, Math.min(2, distance * -9 - 3))}%`);
      });
    };
    const requestUpdate = () => {
      if (!framePending) {
        framePending = true;
        requestAnimationFrame(update);
      }
    };
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate, { passive: true });
    update();
  }

  function initLetter() {
    const envelope = document.getElementById("envelope");
    const modal = document.getElementById("letterModal");
    const close = document.getElementById("closeLetter");
    const paper = modal.querySelector(".letter-paper");
    function openLetter() {
      lastLetterTrigger = envelope;
      envelope.classList.add("is-open");
      envelope.setAttribute("aria-expanded", "true");
      modal.hidden = false;
      requestAnimationFrame(() => modal.classList.add("is-visible"));
      window.setTimeout(() => paper.focus(), reducedMotion ? 0 : 300);
    }
    function closeLetter() {
      modal.classList.remove("is-visible");
      envelope.classList.remove("is-open");
      envelope.setAttribute("aria-expanded", "false");
      window.setTimeout(() => {
        modal.hidden = true;
        lastLetterTrigger?.focus();
      }, reducedMotion ? 0 : 330);
    }
    envelope.addEventListener("click", openLetter);
    close.addEventListener("click", closeLetter);
    modal.addEventListener("click", (event) => { if (event.target === modal) closeLetter(); });
    return closeLetter;
  }

  function initGallery() {
    const modal = document.getElementById("galleryModal");
    const photo = document.getElementById("galleryModalPhoto");
    const caption = document.getElementById("galleryModalCaption");
    const memory = document.getElementById("galleryModalMemory");
    const position = document.getElementById("galleryPosition");
    const close = document.getElementById("closeGallery");
    const panel = document.getElementById("galleryPanel");

    function showGalleryItem(index) {
      activeGalleryIndex = (index + gallery.length) % gallery.length;
      const item = gallery[activeGalleryIndex];
      photo.innerHTML = `<img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.alt)}" /><span class="image-placeholder">${escapeHTML(site.imageFallback)}</span>`;
      configureImageFallbacks(photo);
      caption.textContent = item.caption;
      memory.textContent = item.memory;
      position.textContent = `${activeGalleryIndex + 1} / ${gallery.length}`;
    }
    function openGallery(index, trigger) {
      lastGalleryTrigger = trigger;
      showGalleryItem(index);
      modal.hidden = false;
      document.body.classList.add("modal-open");
      close.focus();
    }
    function closeGallery() {
      modal.hidden = true;
      document.body.classList.remove("modal-open");
      lastGalleryTrigger?.focus();
    }
    document.querySelectorAll("[data-gallery-index]").forEach((button) => {
      button.addEventListener("click", () => openGallery(Number(button.dataset.galleryIndex), button));
    });
    document.getElementById("previousGallery").addEventListener("click", () => showGalleryItem(activeGalleryIndex - 1));
    document.getElementById("nextGallery").addEventListener("click", () => showGalleryItem(activeGalleryIndex + 1));
    close.addEventListener("click", closeGallery);
    modal.addEventListener("click", (event) => { if (event.target === modal) closeGallery(); });
    let swipeStart = 0;
    panel.addEventListener("touchstart", (event) => { swipeStart = event.changedTouches[0].screenX; }, { passive: true });
    panel.addEventListener("touchend", (event) => {
      const change = event.changedTouches[0].screenX - swipeStart;
      if (Math.abs(change) > 45) showGalleryItem(activeGalleryIndex + (change < 0 ? 1 : -1));
    }, { passive: true });
    return closeGallery;
  }

  function createPetals() {
    if (reducedMotion) return;
    const holder = document.getElementById("petals");
    const count = window.innerWidth < 680 ? 8 : 13;
    for (let index = 0; index < count; index += 1) {
      const petal = document.createElement("span");
      petal.className = "petal";
      petal.style.setProperty("--left", `${(index * 17 + 7) % 100}%`);
      petal.style.setProperty("--top", `${(index * 29 + 9) % 96}`);
      petal.style.setProperty("--size", `${5 + (index % 4) * 1.7}px`);
      petal.style.setProperty("--opacity", `${.12 + (index % 4) * .04}`);
      petal.style.setProperty("--duration", `${6 + (index % 5) * 1.2}s`);
      petal.style.setProperty("--delay", `${index * -.8}s`);
      petal.style.setProperty("--drift", `${-11 + (index % 5) * 6}px`);
      holder.appendChild(petal);
    }
  }

  configureImageFallbacks();
  renderGate();
  initRevealAnimations();
  initScrollDetails();
  const foldLetter = initLetter();
  const hideGallery = initGallery();
  createPetals();
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (!document.getElementById("galleryModal").hidden) hideGallery();
    if (!document.getElementById("letterModal").hidden) foldLetter();
  });
})();
