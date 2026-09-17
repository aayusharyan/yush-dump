(function () {
  "use strict";

  const photos = Array.isArray(window.PHOTOS) ? window.PHOTOS : [];
  const gallery = document.querySelector("#gallery");
  const count = document.querySelector("#photo-count");
  const lightbox = document.querySelector("#lightbox");
  const lightboxImage = document.querySelector("#lightbox-image");
  const lightboxTitle = document.querySelector("#lightbox-title");
  const lightboxMeta = document.querySelector("#lightbox-meta");
  const previousButton = document.querySelector(".lightbox-previous");
  const nextButton = document.querySelector(".lightbox-next");
  const closeButton = document.querySelector(".lightbox-close");
  const menuButton = document.querySelector(".menu-toggle");
  const mobileNav = document.querySelector("#site-nav");
  let activeIndex = 0;
  let touchStartX = 0;

  const padIndex = (index) => String(index + 1).padStart(3, "0");

  function createPhotoCard(photo, index) {
    const button = document.createElement("button");
    button.className = "photo-card";
    button.type = "button";
    button.setAttribute("aria-label", `Open ${photo.title}`);

    const image = document.createElement("img");
    image.src = photo.src;
    image.alt = photo.alt;
    image.width = photo.width;
    image.height = photo.height;
    image.loading = index < 8 ? "eager" : "lazy";
    image.decoding = "async";
    if (index === 0) image.fetchPriority = "high";

    const copy = document.createElement("span");
    copy.className = "photo-card-copy";

    const title = document.createElement("span");
    title.className = "photo-card-title";
    title.textContent = photo.title;

    const itemIndex = document.createElement("span");
    itemIndex.className = "photo-card-index";
    itemIndex.textContent = padIndex(index);

    copy.append(title, itemIndex);
    button.append(image, copy);
    button.addEventListener("click", () => openLightbox(index));
    return button;
  }

  function renderGallery() {
    const fragment = document.createDocumentFragment();
    photos.forEach((photo, index) => fragment.append(createPhotoCard(photo, index)));
    gallery.replaceChildren(fragment);
    count.textContent = `${String(photos.length).padStart(3, "0")} images`;
  }

  function updateLightbox(index) {
    activeIndex = (index + photos.length) % photos.length;
    const photo = photos[activeIndex];
    lightboxImage.src = photo.src;
    lightboxImage.alt = photo.alt;
    lightboxTitle.textContent = photo.title;
    lightboxMeta.textContent = `${padIndex(activeIndex)} / ${String(photos.length).padStart(3, "0")} · ${photo.year}`;
  }

  function openLightbox(index) {
    if (!photos.length) return;
    updateLightbox(index);
    lightbox.showModal();
  }

  function closeMenu() {
    menuButton.setAttribute("aria-expanded", "false");
    mobileNav.classList.remove("is-open");
  }

  renderGallery();

  previousButton.addEventListener("click", () => updateLightbox(activeIndex - 1));
  nextButton.addEventListener("click", () => updateLightbox(activeIndex + 1));
  closeButton.addEventListener("click", () => lightbox.close());

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) lightbox.close();
  });

  lightbox.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") updateLightbox(activeIndex - 1);
    if (event.key === "ArrowRight") updateLightbox(activeIndex + 1);
  });

  lightbox.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0].clientX;
  }, { passive: true });

  lightbox.addEventListener("touchend", (event) => {
    const distance = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(distance) < 50) return;
    updateLightbox(activeIndex + (distance < 0 ? 1 : -1));
  }, { passive: true });

  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    mobileNav.classList.toggle("is-open", !isOpen);
  });

  document.querySelectorAll("[data-nav-link]").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });
})();
