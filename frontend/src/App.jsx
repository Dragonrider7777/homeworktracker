import { useEffect, useState } from "react";
import AssignmentCard from "./components/AssignmentCard";
import FilterBar from "./components/FilterBar";

function App() {
  const [assignments, setAssignments] = useState([]);
  const [currentFilter, setCurrentFilter] = useState("active");

  useEffect(() => {
    async function fetchAssignments() {
      const res = await fetch("/api/assignments");
      const data = await res.json();
      setAssignments(data);
    }

    fetchAssignments();
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
            <AssignmentCard key={assignment.id} assignment={assignment} />
          ))
        )}
      </ul>
    </div>
  );
}

export default App;
