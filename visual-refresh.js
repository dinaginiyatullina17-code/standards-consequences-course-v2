(function () {
  "use strict";

  const extensions = [".webp", ".png", ".jpg", ".jpeg"];
  document.querySelectorAll("[data-visual-image]").forEach(slot => {
    const base = slot.getAttribute("data-visual-image");
    if (!base) return;
    let index = 0;
    function tryNext() {
      if (index >= extensions.length) return;
      const img = new Image();
      img.alt = slot.getAttribute("data-alt") || "";
      img.onload = () => {
        slot.replaceChildren(img);
        slot.classList.add("has-image");
      };
      img.onerror = () => { index += 1; tryNext(); };
      img.src = base + extensions[index];
    }
    tryNext();
  });

  document.querySelectorAll(".chain-carousel").forEach(carousel => {
    const slides = [...carousel.querySelectorAll(".chain-infographic")];
    const previous = carousel.querySelector(".chain-carousel__prev");
    const next = carousel.querySelector(".chain-carousel__next");
    const status = carousel.querySelector(".chain-carousel__status");
    let current = 0;
    if (slides.length === 1) carousel.querySelector(".chain-carousel__nav").hidden = true;

    slides.forEach(slide => {
      const trigger = slide.querySelector(".chain-toggle");
      const panel = slide.querySelector(".chain-panel");
      if (!trigger.querySelector(".chain-kf")) {
        const category = document.createElement("span");
        category.className = "chain-kf";
        category.textContent = slide.classList.contains("chain-infographic--quality")
          ? "Качество продукта"
          : "Безопасность сотрудников";
        trigger.querySelector(".chain-infographic__head").append(category);
      }
      trigger.removeAttribute("onclick");
      trigger.setAttribute("aria-expanded", "true");
      trigger.setAttribute("tabindex", "-1");
      trigger.classList.add("open");
      panel.classList.add("open");
    });

    function markViewed() {
      const slide = slides[current];
      if (!slide || !slide.getClientRects().length) return;
      const bounds = slide.getBoundingClientRect();
      if (bounds.bottom < 0 || bounds.top > innerHeight) return;
      const trigger = slide.querySelector(".chain-toggle");
      if (trigger.dataset.revealId && typeof recordReveal === "function" &&
          !trigger.classList.contains("was-read")) recordReveal(trigger);
    }

    function show(index) {
      current = Math.max(0, Math.min(index, slides.length - 1));
      slides.forEach((slide, position) => {
        slide.hidden = position !== current;
        slide.classList.toggle("is-current", position === current);
      });
      status.textContent = `${current + 1} из ${slides.length}`;
      previous.disabled = current === 0;
      next.disabled = current === slides.length - 1;
      markViewed();
      requestAnimationFrame(markViewed);
    }

    previous.addEventListener("click", () => { markViewed(); show(current - 1); });
    next.addEventListener("click", () => { markViewed(); show(current + 1); });
    carousel.addEventListener("keydown", event => {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        markViewed();
        show(current + (event.key === "ArrowRight" ? 1 : -1));
      }
    });
    const observer = new IntersectionObserver(markViewed, { threshold: 0.1 });
    observer.observe(carousel);
    addEventListener("scroll", markViewed, { passive: true });
    show(0);
  });
})();
