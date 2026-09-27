// ============================================
// CALENDAR.JS — Builds the October 2026 calendar grid
// and highlights the 31st with a pulsing heart.
// ============================================

document.addEventListener("DOMContentLoaded", initCalendar);

function initCalendar() {
  const grid = document.getElementById("calendar-grid");
  if (!grid) return;

  const YEAR = 2026;
  const MONTH = 9; // October (0-indexed: Jan=0 ... Oct=9)
  const HIGHLIGHT_DAY = 31;

  const weekdayLabels = ["Երկ", "Երք", "Չրք", "Հնգ", "Ուրբ", "Շբթ", "Կիր"];

  renderWeekdayHeaders();
  renderDayCells();

  // Prints the row of weekday abbreviations at the top of the grid
  function renderWeekdayHeaders() {
    weekdayLabels.forEach(function (label) {
      const el = document.createElement("div");
      el.className = "calendar-weekday";
      el.textContent = label;
      grid.appendChild(el);
    });
  }

  // Builds all day cells, including empty filler cells before day 1
  function renderDayCells() {
    const firstDay = new Date(YEAR, MONTH, 1);
    const totalDays = new Date(YEAR, MONTH + 1, 0).getDate(); // last day of the month

    // JS getDay(): 0=Sunday ... 6=Saturday. We want the grid to start on Monday,
    // so we convert Sunday(0) to be treated as the 7th column instead of the 1st.
    let startOffset = firstDay.getDay();
    startOffset = startOffset === 0 ? 6 : startOffset - 1;

    // Empty filler cells so day 1 lines up under the correct weekday
    for (let i = 0; i < startOffset; i++) {
      const filler = document.createElement("div");
      filler.className = "calendar-day empty";
      grid.appendChild(filler);
    }

    // Actual day cells
    for (let day = 1; day <= totalDays; day++) {
      const cell = document.createElement("div");
      cell.className = "calendar-day";

      if (day === HIGHLIGHT_DAY) {
        cell.classList.add("highlight");
        cell.innerHTML =
          '<svg class="heart-outline" viewBox="0 0 32 29" xmlns="http://www.w3.org/2000/svg">' +
          '<path d="M16 27S2 18.3 2 9.6C2 4.9 5.7 2 9.6 2c2.6 0 5 1.4 6.4 3.8C17.4 3.4 19.8 2 22.4 2 26.3 2 30 4.9 30 9.6 30 18.3 16 27 16 27Z" ' +
          'fill="none" stroke="black" stroke-width="1.6"/>' +
          '</svg>' +
          '<span class="heart-number">' + day + '</span>';
      } else {
        cell.textContent = day;
      }

      grid.appendChild(cell);
    }
  }
}