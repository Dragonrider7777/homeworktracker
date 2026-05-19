let selectedDate = null; // Currently selected date in the calendar

// Month currently being displayed in the calendar (default to current month)
let visibleMonth = new Date();

// Toggle calendar popup when date picker button is clicked
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("date-picker-btn").addEventListener("click", () => {
    const popup = document.getElementById("calendar-popup");

    popup.classList.toggle("hidden");

    renderCalendar();
  });
});

// Render the calendar for the currently visible month
function renderCalendar() {
  const popup = document.getElementById("calendar-popup");

  const month = visibleMonth.getMonth();
  const year = visibleMonth.getFullYear();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const monthName = visibleMonth.toLocaleString("en-US", {
    month: "long",
    year: "numeric"
  });

  // Build calendar header with month name and navigation buttons
  let html = `
    <div class = "calendar-header">
      <button type="button" onclick="changeMonth(-1)"><</button>
      <strong>${monthName}</strong>
      <button type="button" onclick="changeMonth(1)">></button>
    </div>

    <div class="calendar-grid">
      ${["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => `<div class="calendar-day-name">${day}</div>`).join("")}
  `;

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDay.getDay(); i++) {
    html += `<div></div>`;
  }

  // Add cells for each day of the month
  for (let day = 1; day <= lastDay.getDate(); day++) {
    const date = new Date(year, month, day);
    const value = formatDateValue(date);

    const todayClass = value === formatDateValue(new Date()) ? "today" : "";
    const selectedClass = value === selectedDate ? "selected" : "";

    // Each day is a button that can be clicked to select the date
    html += `
      <button
        type="button"
        class="calendar-day ${todayClass} ${selectedClass}"
        data-date="${value}"
      >
        ${day}
      </button>
    `;
  }

  // Close calendar grid
  html += `</div>`;

  // Update calendar popup content
  popup.innerHTML = html;

  document.querySelectorAll(".calendar-day").forEach((button) => {
    button.addEventListener("click", () => {
      selectDate(button.dataset.date);
    });
  });
}

// Change the visible month in the calendar
window.changeMonth = function (amount) {
  visibleMonth.setMonth(visibleMonth.getMonth() + amount);
  renderCalendar();
};

// Handle date selection from the calendar
function selectDate(value) {
  selectedDate = value;
  document.getElementById("dueDate").value = value;
  document.getElementById("calendar-popup").classList.add("hidden");
}

// Format a Date object as YYYY-MM-DD for input value
function formatDateValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
