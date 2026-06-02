function AssignmentCard({
  assignment,
  onMarkDone,
  onMarkTodo,
  onDelete,
  onEdit
}) {
  function getStateClass() {
    if (assignment.completed) return "completed";
    if (assignment.status === "OVERDUE") return "overdue";
    if (assignment.status === "DUE_SOON") return "due-soon";
    if (assignment.status === "NO_DUE_DATE") return "no-date";
    return "upcoming";
  }

  function formatStatus(status) {
    if (status === "DUE_SOON") return "Due Soon";
    if (status === "NO_DUE_DATE") return "No Due Date";
    return status.charAt(0) + status.slice(1).toLowerCase();
  }

  function formatDate(date) {
    if (!date) return "No date";

    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  }

  const stateClass = getStateClass();

  return (
    <li className={`assignment-card ${stateClass}`}>
      <div className="assignment-content">
        <div className="assignment-title assignment-strikethrough">
          {assignment.title}
        </div>

        <div className="assignment-details">
          {assignment.course} • Due: {formatDate(assignment.dueDate)}
        </div>

        <span className={`status-badge ${stateClass}`}>
          {formatStatus(assignment.status)}
        </span>
      </div>

      <div className="assignment-actions">
        <button
          className="card-btn"
          onClick={() =>
            assignment.completed
              ? onMarkTodo(assignment.id)
              : onMarkDone(assignment.id)
          }
        >
          {assignment.completed ? "Undo" : "Done"}
        </button>

        <button className="card-btn" onClick={() => onEdit(assignment)}>
          Edit
        </button>

        <button
          className="card-btn delete-btn"
          onClick={() => onDelete(assignment.id)}
        >
          Delete
        </button>
      </div>
    </li>
  );
}

export default AssignmentCard;
