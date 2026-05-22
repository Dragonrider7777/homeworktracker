import { useEffect, useState } from "react";
import AssignmentCard from "./components/AssignmentCard";
import AssignmentForm from "./components/AssignmentForm";
import FilterBar from "./components/FilterBar";
import Toast from "./components/Toast";

function App() {
  const [assignments, setAssignments] = useState([]);
  const [currentFilter, setCurrentFilter] = useState("active");
  const [toasts, setToasts] = useState([]);

  function showToast(message, type = "success", duration = 3000) {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, duration);
  }

  async function loadAssignments() {
    const res = await fetch("/api/assignments");
    const data = await res.json();
    setAssignments(data);
  }

  useEffect(() => {
    async function initializeAssignments() {
      const res = await fetch("/api/assignments");
      const data = await res.json();
      setAssignments(data);
    }

    initializeAssignments();
  }, []);

  function matchesFilter(assignment) {
    switch (currentFilter) {
      case "all":
        return true;
      case "active":
        return !assignment.completed;
      case "completed":
        return assignment.completed;
      case "overdue":
        return assignment.status === "OVERDUE";
      case "due-soon":
        return assignment.status === "DUE_SOON";
      default:
        return true;
    }
  }

  const filteredAssignments = assignments.filter(matchesFilter);

  async function markDone(id) {
    await fetch(`/api/assignments/${id}/done`, { method: "PATCH" });
    loadAssignments();
    showToast("Assignment marked as done!", "success");
  }

  async function markTodo(id) {
    await fetch(`/api/assignments/${id}/todo`, { method: "PATCH" });
    loadAssignments();
  }

  async function deleteAssignment(id) {
    await fetch(`/api/assignments/${id}`, { method: "DELETE" });
    loadAssignments();
    showToast("Assignment deleted", "warning");
  }

  return (
    <div className="container">
      <div id="page-header">
        <h1>Homework Assignment Tracker</h1>
        <p className="subtitle">
          Track what is due, what is urgent, and what is finished.
        </p>
      </div>

      <FilterBar
        currentFilter={currentFilter}
        setCurrentFilter={setCurrentFilter}
      />

      <ul id="list">
        {filteredAssignments.length === 0 ? (
          <li>No assignments found.</li>
        ) : (
          filteredAssignments.map((assignment) => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              onMarkDone={markDone}
              onMarkTodo={markTodo}
              onDelete={deleteAssignment}
            />
          ))
        )}
      </ul>
      <AssignmentForm
        onAssignmentAdded={loadAssignments}
        showToast={showToast}
      />

      <div id="toast-container">
        {toasts.map((t) => (
          <Toast key={t.id} message={t.message} type={t.type} />
        ))}
      </div>
    </div>
  );
}

export default App;
