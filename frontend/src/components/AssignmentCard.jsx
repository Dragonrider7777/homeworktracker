function AssignmentCard({ assignment }) {
  return (
    <li>
      <div>
        <h2>{assignment.title}</h2>
        <p>
          {assignment.course} • Due: {assignment.dueDate || "No date"}
        </p>
        <p>{assignment.status}</p>
      </div>
    </li>
  );
}

export default AssignmentCard;
