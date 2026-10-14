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
