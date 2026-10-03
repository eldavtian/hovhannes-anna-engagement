// ============================================
// SCROLL-REVEAL.JS — Fades/rises each section into view as the guest scrolls to it
// Uses IntersectionObserver: efficient, no scroll-event listeners needed.
// ============================================

document.addEventListener("DOMContentLoaded", function () {
  const sections = document.querySelectorAll(".reveal");
  if (sections.length === 0) return;

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target); // only animate once, not every scroll back and forth
        }
      });
    },
    {
      threshold: 0.15 // triggers once 15% of the section is visible
    }
  );

  sections.forEach(function (section) {
    observer.observe(section);
  });
});