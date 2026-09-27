// ============================================
// MUSIC.JS — Controls background music + vinyl icon
// ============================================

document.addEventListener("DOMContentLoaded", function () {
  const audio = document.getElementById("bg-music");
  const vinylBtn = document.getElementById("vinyl-button");

  if (!audio || !vinylBtn) return;

  vinylBtn.addEventListener("click", function () {
    if (audio.paused) {
      audio.play();
      vinylBtn.classList.add("playing");
    } else {
      audio.pause();
      vinylBtn.classList.remove("playing");
    }
  });

  window.startBackgroundMusic = function () {
    const playPromise = audio.play();

    if (playPromise !== undefined) {
      playPromise
        .then(function () {
          vinylBtn.classList.add("playing"); // only marked playing on real success
        })
        .catch(function (err) {
          console.log("Music failed to start:", err); // now you'll see the REAL reason in console
        });
    }
  };
});