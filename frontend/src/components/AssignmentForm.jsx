import { useState } from "react";

function AssignmentForm({ onAssignmentAdded, showToast }) {
  const [title, setTitle] = useState("");
  const [course, setCourse] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [source, setSource] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    const assignment = {
      title,
      course,
      dueDate: dueDate || null,
      source: source || "MANUAL"
    };

    const response = await fetch("/api/assignments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(assignment)
    });

    if (response.ok) {
      setTitle("");
      setCourse("");
      setDueDate("");
      setSource("");

      onAssignmentAdded();
      if (typeof showToast === "function") {
        showToast("Assignment added", "success");
      }
    } else {
      alert("Failed to add assignment. Please try again.");
    }
  }

  return (
    <form id="add-assignment" onSubmit={handleSubmit}>
      <div className="section-header">
        <h2>Add Assignment</h2>
        <p>Create a new task with an optional due date and source.</p>
      </div>
      <label>Title</label>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        required
      />
      <label>Course</label>
      <input
        value={course}
        onChange={(e) => setCourse(e.target.value)}
        placeholder="Course"
        required
      />
      <label>Due Date</label>
      <input
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        placeholder="Due Date"
        type="date"
      />
      <label>Source</label>
      <input
        value={source}
        onChange={(e) => setSource(e.target.value)}
        placeholder="Source"
        required
      />
      <div className="form-actions">
        <button className="primary-btn" type="submit">
          Add
        </button>
      </div>
    </form>
  );
}

export default AssignmentForm;
