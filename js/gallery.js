// ============================================
// GALLERY.JS — Simple slider with arrows + dots
// Automatically adapts to however many .gallery-image elements exist.
// ============================================

document.addEventListener("DOMContentLoaded", initGallery);

function initGallery() {
  const track = document.getElementById("gallery-track");
  const prevBtn = document.getElementById("gallery-prev");
  const nextBtn = document.getElementById("gallery-next");
  const dotsContainer = document.getElementById("gallery-dots");

  if (!track || !prevBtn || !nextBtn || !dotsContainer) return;

  const images = track.querySelectorAll(".gallery-image");
  const totalSlides = images.length;
  let currentIndex = 0;

  buildDots();
  goToSlide(0);

  prevBtn.addEventListener("click", function () {
    goToSlide(currentIndex - 1);
  });

  nextBtn.addEventListener("click", function () {
    goToSlide(currentIndex + 1);
  });

  // Creates one dot per image, and lets clicking a dot jump straight to that slide
  function buildDots() {
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement("button");
      dot.className = "gallery-dot";
      dot.setAttribute("aria-label", "Նկար " + (i + 1));
      dot.addEventListener("click", function () {
        goToSlide(i);
      });
      dotsContainer.appendChild(dot);
    }
  }

  // Moves the track to show the given slide index, wrapping around at both ends
  function goToSlide(index) {
    // Wrap around: if going past the last slide, loop to the first (and vice versa)
    if (index < 0) index = totalSlides - 1;
    if (index >= totalSlides) index = 0;

    currentIndex = index;
    track.style.transform = "translateX(-" + (currentIndex * 100) + "%)";
    updateActiveDot();
  }

  // Highlights the dot matching the currently visible slide
  function updateActiveDot() {
    const dots = dotsContainer.querySelectorAll(".gallery-dot");
    dots.forEach(function (dot, i) {
      dot.classList.toggle("active", i === currentIndex);
    });
  }
}