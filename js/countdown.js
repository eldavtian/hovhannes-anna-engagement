// ============================================
// COUNTDOWN.JS — Live countdown with a flip-calendar page-turn effect,
// updating every second (Days / Hours / Minutes / Seconds).
// ============================================

document.addEventListener("DOMContentLoaded", initCountdown);

function initCountdown() {
  const units = {
    days: createFlipUnit("flip-days"),
    hours: createFlipUnit("flip-hours"),
    minutes: createFlipUnit("flip-minutes"),
    seconds: createFlipUnit("flip-seconds")
  };

  if (!units.days) return; // guard: elements not found

  updateCountdown();
  setInterval(updateCountdown, 1000);

  function updateCountdown() {
    const now = new Date();
    const diffMs = ENGAGEMENT_DATE - now;

    let days = 0, hours = 0, minutes = 0, seconds = 0;

    if (diffMs > 0) {
      const totalSeconds = Math.floor(diffMs / 1000);
      days = Math.floor(totalSeconds / (3600 * 24));
      hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
      minutes = Math.floor((totalSeconds % 3600) / 60);
      seconds = totalSeconds % 60;
    }

    setUnitValue(units.days, padNumber(days));
    setUnitValue(units.hours, padNumber(hours));
    setUnitValue(units.minutes, padNumber(minutes));
    setUnitValue(units.seconds, padNumber(seconds));
  }

  // Gathers the card + its front/back face elements for one flip unit
  function createFlipUnit(id) {
    const card = document.getElementById(id);
    if (!card) return null;

    return {
      card: card,
      front: card.querySelector(".flip-card-front span"),
      back: card.querySelector(".flip-card-back span"),
      currentValue: card.querySelector(".flip-card-front span").textContent
    };
  }

  // If the value actually changed, play the flip animation; otherwise do nothing
  function setUnitValue(unit, newValue) {
    if (unit.currentValue === newValue) return; // no change, no flip needed

    unit.back.textContent = newValue;      // load new value into the back face first
    unit.card.classList.add("flipping");   // trigger the CSS flip transition

    // After the flip animation finishes, snap the front to the new value
    // and reset instantly (no transition) so it's ready to flip again next time
    setTimeout(function () {
      unit.card.classList.remove("flipping");
      unit.card.classList.add("no-transition");
      unit.front.textContent = newValue;
      unit.back.textContent = newValue;

      // Force the browser to apply the "no transition" state before removing it,
      // otherwise the reset itself would visibly animate backward
      requestAnimationFrame(function () {
        unit.card.classList.remove("no-transition");
      });

      unit.currentValue = newValue;
    }, 600); // matches the 0.6s transition duration in CSS
  }

  function padNumber(num) {
    return num.toString().padStart(2, "0");
  }
}