// ============================================
// GALLERY.JS — Pure auto-scrolling slider, no manual arrows
// ============================================

document.addEventListener("DOMContentLoaded", initGallery);

function initGallery() {
  const track = document.getElementById("gallery-track");
  const dotsContainer = document.getElementById("gallery-dots");

  if (!track || !dotsContainer) return;

  const realSlides = Array.from(track.querySelectorAll(".gallery-image"));
  const totalSlides = realSlides.length;
  if (totalSlides === 0) return;

  const firstClone = realSlides[0].cloneNode(true);
  const lastClone = realSlides[totalSlides - 1].cloneNode(true);
  track.appendChild(firstClone);
  track.insertBefore(lastClone, realSlides[0]);

  let currentIndex = 1;
  let isJumping = false;

  buildDots();
  setPosition(false);

  setInterval(function () {
    goToSlide(currentIndex + 1);
  }, 4000);

  track.addEventListener("transitionend", handleTransitionEnd);

  function goToSlide(index) {
    if (isJumping) return;
    currentIndex = index;
    setPosition(true);
    updateActiveDot();
  }

  function setPosition(animate) {
    track.style.transition = animate ? "transform 1s ease-in-out" : "none";
    track.style.transform = "translateX(-" + (currentIndex * 100) + "%)";
  }

  function handleTransitionEnd() {
    if (currentIndex === totalSlides + 1) {
      isJumping = true;
      currentIndex = 1;
      setPosition(false);
      requestAnimationFrame(function () { isJumping = false; });
    } else if (currentIndex === 0) {
      isJumping = true;
      currentIndex = totalSlides;
      setPosition(false);
      requestAnimationFrame(function () { isJumping = false; });
    }
  }

  function buildDots() {
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement("div");
      dot.className = "gallery-dot";
      dotsContainer.appendChild(dot);
    }
    updateActiveDot();
  }

  function updateActiveDot() {
    let displayIndex = currentIndex - 1;
    if (displayIndex < 0) displayIndex = totalSlides - 1;
    if (displayIndex >= totalSlides) displayIndex = 0;

    const dots = dotsContainer.querySelectorAll(".gallery-dot");
    dots.forEach(function (dot, i) {
      dot.classList.toggle("active", i === displayIndex);
    });
  }
}