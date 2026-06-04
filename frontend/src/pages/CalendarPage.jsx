/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
function CalendarPage() {
  // Controls which month the user is looking at
  const [visibleDate, setVisibleDate] = useState(new Date());
  // Controls current assignments
  const [assignments, setAssignments] = useState([]);

  const [selectedDate, setSelectedDate] = useState(null);

  // Create variables for current year and month
  const year = visibleDate.getFullYear();
  const month = visibleDate.getMonth();

  // Finds month name from visibleDate
  const monthName = visibleDate.toLocaleString("en-US", {
    month: "long",
    year: "numeric"
  });

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Contains days of the week
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Create calendar boxes out of array
  const calendarDays = [];

  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  // Fetches current assignments from /api/assignments
  async function loadAssignments() {
    const res = await fetch("/api/assignments");
    const data = await res.json();
    setAssignments(data);
  }

  useEffect(() => {
    loadAssignments();
  }, []);

  function goToPreviousMonth() {
    setVisibleDate(new Date(year, month - 1, 1));
  }

  function goToNextMonth() {
    setVisibleDate(new Date(year, month + 1, 1));
  }

  function goToToday() {
    setVisibleDate(new Date());
  }

  function formatDateKey(day) {
    const monthNumber = String(month + 1).padStart(2, "0");
    const dayNumber = String(day).padStart(2, "0");

    return `${year}-${monthNumber}-${dayNumber}`;
  }

  function getAssignmentsForDay(day) {
    const dateKey = formatDateKey(day);

    return assignments.filter((assignment) => assignment.dueDate === dateKey);
  }

  function getAssignmentClass(assignment) {
    if (assignment.completed) return "completed";
    if (assignment.status === "OVERDUE") return "overdue";
    if (assignment.status === "DUE_SOON") return "due-soon";
    return "upcoming";
  }

  // Helper function to find current day
  function isToday(day) {
    const today = new Date();

    return (
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day
    );
  }

  if (selectedDate) {
    const assignmentsForSelectedDate = assignments.filter(
      (assignment) => assignment.dueDate === selectedDate
    );

    return (
      <div className="container">
        <div id="page-header">
          <button
            type="button"
            className="card-btn"
            onClick={() => setSelectedDate(null)}
          >
            ← Back to Month
          </button>

          <h1>{selectedDate}</h1>
          <p className="subtitle">Assignments due on this day.</p>
        </div>

        <section className="day-view-card">
          {assignmentsForSelectedDate.length === 0 ? (
            <p className="empty-day-text">No assignments due this day.</p>
          ) : (
            assignmentsForSelectedDate.map((assignment) => (
              <div
                key={assignment.id}
                className={`day-assignment ${getAssignmentClass(assignment)}`}
              >
                <h3>{assignment.title}</h3>
                <p>{assignment.course}</p>
                <p>{assignment.status}</p>
              </div>
            ))
          )}
        </section>
      </div>
    );
  }

  return (
    <div className="container">
      <div id="page-header">
        <h1>Calendar</h1>
        <p className="subititle">See your assignments by due date.</p>
      </div>

      <section className="calendar-card">
        <div className="calendar-header">
          <h2 className="calendar-title">{monthName}</h2>

          <div className="calendar-nav">
            <button
              type="button"
              className="default-btn"
              onClick={goToPreviousMonth}
            >
              Previous
            </button>

            <button type="button" className="default-btn" onClick={goToToday}>
              Today
            </button>

            <button
              type="button"
              className="default-btn"
              onClick={goToNextMonth}
            >
              Next
            </button>
          </div>
        </div>

        <div className="calendar-grid">
          {weekdays.map((weekday) => (
            <div key={weekday} className="calendar-weekday">
              {weekday}
            </div>
          ))}

          {calendarDays.map((day, index) => (
            <div
              key={index}
              className={
                day === null
                  ? "calendar-day empty"
                  : isToday(day)
                    ? "calendar-day today"
                    : "calendar-day"
              }
              onClick={() => {
                if (day !== null) {
                  setSelectedDate(formatDateKey(day));
                }
              }}
            >
              {day !== null && (
                <>
                  <span className="calendar-day-number">{day}</span>

                  {getAssignmentsForDay(day).map((assignment) => (
                    <div
                      key={assignment.id}
                      className={`calendar-assignment ${getAssignmentClass(assignment)}`}
                      title={`${assignment.title} • ${assignment.course}`}
                    >
                      {assignment.title}
                    </div>
                  ))}
                </>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default CalendarPage;
