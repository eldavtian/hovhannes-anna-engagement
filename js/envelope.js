// ============================================
// ENVELOPE.JS — Handles the envelope click → opening → invitation reveal
// ============================================

document.addEventListener("DOMContentLoaded", initEnvelope);

function initEnvelope() {
  const envelope = document.getElementById("envelope");
  const envelopeScreen = document.getElementById("envelope-screen");
  const invitationScreen = document.getElementById("invitation-screen");
  const flap = document.querySelector(".envelope-flap");

  let alreadyOpened = false; // prevents double-clicks from breaking the sequence

  envelope.addEventListener("click", function () {
    if (alreadyOpened) return;
    alreadyOpened = true;
    playOpeningSequence();
  });

  function playOpeningSequence() {
    // Step A: flap swings open
    flap.classList.add("open");

    // Step B: after the flap finishes opening, fade the whole envelope screen out
    setTimeout(function () {
      envelopeScreen.classList.add("closing");
    }, 900);

    // Step C: once the envelope screen has faded out, remove it and reveal the invitation
    setTimeout(function () {
      envelopeScreen.classList.add("hidden");
      invitationScreen.classList.remove("hidden");
      invitationScreen.classList.add("revealed");

      // Scroll to top so the guest starts at the beginning of the invitation
      window.scrollTo({ top: 0, behavior: "instant" });
    }, 2100); // 900ms (flap) + 1200ms (screen fade) = 2100ms total
  }
}