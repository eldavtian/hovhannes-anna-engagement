// ============================================
// COUNTDOWN.JS — Live countdown to ENGAGEMENT_DATE (set in config.js)
// Updates every minute: shows Days, Hours, Minutes remaining.
// ============================================

document.addEventListener("DOMContentLoaded", initCountdown);

function initCountdown() {
  const daysEl = document.getElementById("countdown-days");
  const hoursEl = document.getElementById("countdown-hours");
  const minutesEl = document.getElementById("countdown-minutes");

  // Guard: if these elements don't exist on the page, stop here (avoids console errors)
  if (!daysEl || !hoursEl || !minutesEl) return;

  updateCountdown(); // run once immediately so numbers aren't blank for the first minute
  setInterval(updateCountdown, 1000 * 30); // then refresh every 30 seconds

  function updateCountdown() {
    const now = new Date();
    const diffMs = ENGAGEMENT_DATE - now; // ENGAGEMENT_DATE comes from config.js

    if (diffMs <= 0) {
      // The date has already arrived/passed
      daysEl.textContent = "00";
      hoursEl.textContent = "00";
      minutesEl.textContent = "00";
      return;
    }

    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    const days = Math.floor(totalMinutes / (60 * 24));
    const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
    const minutes = totalMinutes % 60;

    daysEl.textContent = padNumber(days);
    hoursEl.textContent = padNumber(hours);
    minutesEl.textContent = padNumber(minutes);
  }

  // Turns 5 into "05" for a cleaner two-digit look
  function padNumber(num) {
    return num.toString().padStart(2, "0");
  }
}