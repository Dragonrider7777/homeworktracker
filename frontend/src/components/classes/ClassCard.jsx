function ClassCard({ schoolClass, onDelete, onEdit }) {
  return (
    <li className="class-card">
      <div className="class-content">
        <div className="class-name">{schoolClass.name}</div>
        <div className="class-teacher">{schoolClass.teacherName}</div>
      </div>

      <div className="class-actions">
        <button
          type="button"
          className="card-btn"
          onClick={() => onEdit(schoolClass)}
        >
          Edit
        </button>

        <button
          type="button"
          className="card-btn delete-btn"
          onClick={() => onDelete(schoolClass.id)}
        >
          Delete
        </button>
      </div>
    </li>
  );
}

export default ClassCard;
