import { useState } from "react";

function AssignmentForm({ onAssignmentAdded }) {
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
    } else {
      alert("Failed to add assignment. Please try again.");
    }
  }

  return (
    <form id="assignment-form" onSubmit={handleSubmit}>
      <h2>Add Assignment</h2>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        required
      ></input>
      <input
        value={course}
        onChange={(e) => setCourse(e.target.value)}
        placeholder="Course"
        required
      ></input>
      <input
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        placeholder="Due Date"
        type="date"
      ></input>
      <input
        value={source}
        onChange={(e) => setSource(e.target.value)}
        placeholder="Source"
        required
      ></input>
      <button type="submit">Add</button>
    </form>
  );
}

export default AssignmentForm;
