import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaCheck, FaTrash, FaUndo } from "react-icons/fa";
import AssignmentCard from "./components/AssignmentCard";
import AssignmentForm from "./components/AssignmentForm";
import EmptyState from "./components/EmptyState";
import FilterBar from "./components/FilterBar";
import Sidebar from "./components/Sidebar";

function App() {
  const [assignments, setAssignments] = useState([]);
  const [currentFilter, setCurrentFilter] = useState("active");
  const [editingAssignment, setEditingAssignment] = useState(null);

  const loadAssignments = useCallback(async () => {
    try {
      const res = await fetch("/api/assignments");
      const data = await res.json();
      setAssignments(data);
    } catch (e) {
      if (e.name === "AbortError") return;
      console.error("Failed to load assignments:", e);
    }
  }, []);

  useEffect(() => {
    // call stable loadAssignments; include it in deps to satisfy lint rules
    // This effect intentionally calls setState via `loadAssignments` on mount
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAssignments();
  }, [loadAssignments]);

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
    toast("Assignment completed", {
      icon: <FaCheck />,
      className: "toast-success"
    });
  }

  async function markTodo(id) {
    await fetch(`/api/assignments/${id}/todo`, { method: "PATCH" });
    loadAssignments();
    toast("Assignment restored", {
      icon: <FaUndo />,
      className: "toast-warning"
    });
  }

  async function deleteAssignment(id) {
    await fetch(`/api/assignments/${id}`, { method: "DELETE" });
    loadAssignments();
    toast.error("Assignment deleted", {
      icon: <FaTrash />,
      className: "toast-error"
    });
  }

  return (
    <>
      <Sidebar />

      <main className="app-main">
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
              <EmptyState filter={currentFilter} />
            ) : (
              filteredAssignments.map((assignment) => (
                <AssignmentCard
                  key={assignment.id}
                  assignment={assignment}
                  onMarkDone={markDone}
                  onMarkTodo={markTodo}
                  onDelete={deleteAssignment}
                  onEdit={setEditingAssignment}
                />
              ))
            )}
          </ul>
          <AssignmentForm
            onAssignmentAdded={loadAssignments}
            editingAssignment={editingAssignment}
            setEditingAssignment={setEditingAssignment}
          />
        </div>
      </main>
    </>
  );
}

export default App;
