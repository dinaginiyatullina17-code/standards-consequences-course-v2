(function () {
  "use strict";

  const extensions = [".webp", ".png", ".jpg", ".jpeg"];

  function loadVisual(slot) {
    const base = slot.getAttribute("data-visual-image");
    if (!base) return;
    let index = 0;

    function tryNext() {
      if (index >= extensions.length) return;
      const img = new Image();
      img.alt = slot.getAttribute("data-alt") || "";
      img.onload = function () {
        slot.replaceChildren(img);
        slot.classList.add("has-image");
      };
      img.onerror = function () {
        index += 1;
        tryNext();
      };
      img.src = base + extensions[index];
    }

    tryNext();
  }

  document.querySelectorAll("[data-visual-image]").forEach(loadVisual);
})();

(function () {
  "use strict";
  const carousel = document.querySelector(".kf-carousel");
  if (!carousel) return;
  const slides = [...carousel.querySelectorAll(".chain-infographic")];
  const previous = carousel.querySelector(".kf-carousel__prev");
  const next = carousel.querySelector(".kf-carousel__next");
  const status = carousel.querySelector(".kf-carousel__status");
  let current = 0;

  function show(index) {
    current = Math.max(0, Math.min(index, slides.length - 1));
    slides.forEach((slide, position) => {
      slide.hidden = position !== current;
      slide.classList.toggle("is-current", position === current);
    });
    status.textContent = `${current + 1} из ${slides.length}`;
    previous.disabled = current === 0;
    next.disabled = current === slides.length - 1;
  }

  previous.addEventListener("click", () => show(current - 1));
  next.addEventListener("click", () => show(current + 1));
  carousel.addEventListener("keydown", event => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      show(current + (event.key === "ArrowRight" ? 1 : -1));
    }
  });
  show(0);
})();
