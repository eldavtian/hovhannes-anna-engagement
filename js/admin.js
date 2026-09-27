// ============================================
// ADMIN.JS — Login, fetch all RSVP records, render/search/sort/filter table
// ============================================

document.addEventListener("DOMContentLoaded", initAdmin);

let allRecords = []; // holds every record fetched from the sheet
let currentFilter = "all";

function initAdmin() {
  const loginForm = document.getElementById("login-form");
  const loginScreen = document.getElementById("login-screen");
  const dashboardScreen = document.getElementById("dashboard-screen");
  const loginError = document.getElementById("login-error");
  const logoutBtn = document.getElementById("logout-btn");
  const searchInput = document.getElementById("search-input");
  const filterButtons = document.querySelectorAll(".filter-btn");

  // --- LOGIN ---
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const entered = document.getElementById("login-password").value;

    if (entered === ADMIN_PASSWORD) {
      loginScreen.classList.add("hidden");
      dashboardScreen.classList.remove("hidden");
      loadRecords();
    } else {
      loginError.textContent = "Սխալ գաղտնաբառ։";
    }
  });

  // --- LOGOUT: just re-show the login screen, no server session to clear ---
  logoutBtn.addEventListener("click", function () {
    dashboardScreen.classList.add("hidden");
    loginScreen.classList.remove("hidden");
    document.getElementById("login-password").value = "";
  });

  // --- SEARCH: re-render on every keystroke ---
  searchInput.addEventListener("input", function () {
    renderTable();
  });

  // --- FILTER BUTTONS ---
  filterButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterButtons.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      currentFilter = btn.dataset.filter;
      renderTable();
    });
  });

  // --- Fetch all records from the Apps Script backend ---
  async function loadRecords() {
    try {
      const response = await fetch(APPS_SCRIPT_URL);
      const data = await response.json();
      allRecords = data.records || [];
      renderTable();
    } catch (error) {
      console.error("Failed to load RSVP records:", error);
    }
  }

  // --- Applies search + filter + sort, then draws the table rows ---
  function renderTable() {
    const tbody = document.getElementById("rsvp-table-body");
    const emptyMsg = document.getElementById("table-empty-message");
    const searchTerm = searchInput.value.trim().toLowerCase();

    let filtered = allRecords.filter(function (r) {
      return String(r.Name).toLowerCase().includes(searchTerm);
    });

    if (currentFilter === "coming") {
      filtered = filtered.filter(function (r) { return r.WillAttend === "Այո"; });
    } else if (currentFilter === "not-coming") {
      filtered = filtered.filter(function (r) { return r.WillAttend === "Ոչ"; });
    } else if (currentFilter === "newest") {
      filtered = filtered.slice().sort(function (a, b) {
        return new Date(b.Timestamp) - new Date(a.Timestamp);
      });
    } else if (currentFilter === "oldest") {
      filtered = filtered.slice().sort(function (a, b) {
        return new Date(a.Timestamp) - new Date(b.Timestamp);
      });
    }

    tbody.innerHTML = "";

    filtered.forEach(function (r) {
      const row = document.createElement("tr");

      const badgeClass = r.WillAttend === "Այո" ? "yes" : "no";
      const dateDisplay = r.Timestamp ? new Date(r.Timestamp).toLocaleDateString("hy-AM") : "-";

      row.innerHTML =
        "<td>" + escapeHtml(r.Name) + "</td>" +
        "<td><span class='badge " + badgeClass + "'>" + escapeHtml(r.WillAttend) + "</span></td>" +
        "<td>" + escapeHtml(String(r.GuestCount || 0)) + "</td>" +
        "<td>" + dateDisplay + "</td>";

      tbody.appendChild(row);
    });

    emptyMsg.classList.toggle("hidden", filtered.length > 0);
    updateStats();
  }

  // --- Updates the small stats bar (total / coming / total guest count) ---
  function updateStats() {
    const total = allRecords.length;
    const coming = allRecords.filter(function (r) { return r.WillAttend === "Այո"; });
    const totalGuests = coming.reduce(function (sum, r) { return sum + Number(r.GuestCount || 0); }, 0);

    document.getElementById("stat-total").textContent = "Ընդամենը՝ " + total;
    document.getElementById("stat-coming").textContent = "Գալիս են՝ " + coming.length;
    document.getElementById("stat-guests").textContent = "Հյուրերի քանակ՝ " + totalGuests;
  }

  // --- Prevents any submitted name from accidentally breaking the table via HTML injection ---
  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }
}