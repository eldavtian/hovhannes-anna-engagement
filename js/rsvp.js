// ============================================
// RSVP.JS — Validates and submits the RSVP form
// to the Google Apps Script backend (config.js has the URL)
// ============================================

document.addEventListener("DOMContentLoaded", initRsvpForm);

function initRsvpForm() {
  const form = document.getElementById("rsvp-form");
  const submitBtn = document.getElementById("rsvp-submit");
  const messageEl = document.getElementById("rsvp-message");
  const guestGroup = document.getElementById("guest-count-group");
  const attendanceRadios = document.querySelectorAll('input[name="attendance"]');

  if (!form) return;

  // Hide the guest-count dropdown whenever "no" is selected
  attendanceRadios.forEach(function (radio) {
    radio.addEventListener("change", function () {
      guestGroup.style.display = radio.value === "no" && radio.checked ? "none" : "block";
    });
  });

  form.addEventListener("submit", handleSubmit);

  async function handleSubmit(e) {
    e.preventDefault(); // stop the browser's default page-reload submit behavior

    const name = document.getElementById("rsvp-name").value.trim();
    const attendanceInput = document.querySelector('input[name="attendance"]:checked');
    const guests = document.getElementById("rsvp-guests").value;

    if (!name || !attendanceInput) {
      showMessage("Խնդրում ենք լրացնել բոլոր դաշտերը։", "error");
      return;
    }

    const willAttend = attendanceInput.value === "yes";

    setLoading(true);
    showMessage("Ստուգում ենք...", "info");

    try {
      // STEP 1: Check if this name already submitted a response
      const isDuplicate = await checkDuplicateName(name);

      if (isDuplicate) {
        showMessage(
          "Այս անունով պատասխան արդեն ուղարկվել է։ Խնդրում ենք նշել ազգանունը կամ մեկ այլ մանրամասն, որպեսզի կարողանանք ճշգրիտ ճանաչել Ձեզ։",
          "error"
        );
        setLoading(false);
        return;
      }

      // STEP 2: Send the actual RSVP data
      await submitRsvp({
        name: name,
        willAttend: willAttend ? "Այո" : "Ոչ",
        guestCount: willAttend ? guests : 0
      });

      showMessage("Շնորհակալություն։ Ձեր պատասխանը հաջողությամբ ուղարկվեց։ 💛", "success");
      form.reset();
      guestGroup.style.display = "block";

    } catch (error) {
      console.error("RSVP submission error:", error);
      showMessage("Սխալ առաջացավ։ Խնդրում ենք փորձել կրկին։", "error");
    } finally {
      setLoading(false);
    }
  }

  // Sends a GET request with ?checkName= to ask the backend if this name exists already
  async function checkDuplicateName(name) {
    const url = APPS_SCRIPT_URL + "?checkName=" + encodeURIComponent(name);
    const response = await fetch(url);
    const data = await response.json();
    return data.exists === true;
  }

  // Sends a POST request with the RSVP data as JSON
  async function submitRsvp(data) {
    await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify(data)
      // Note: no custom headers here on purpose — see explanation below
    });
  }

  function showMessage(text, type) {
    messageEl.textContent = text;
    messageEl.className = "rsvp-message " + type;
  }

  function setLoading(isLoading) {
    submitBtn.disabled = isLoading;
    submitBtn.textContent = isLoading ? "Ուղարկվում է..." : "Ուղարկել պատասխան";
  }
}