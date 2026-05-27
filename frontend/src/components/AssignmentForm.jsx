/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";

function AssignmentForm({
  onAssignmentAdded,
  editingAssignment,
  setEditingAssignment
}) {
  const [formData, setFormData] = useState({
    title: "",
    course: "",
    dueDate: "",
    source: ""
  });

  async function handleSubmit(e) {
    e.preventDefault();

    const assignment = {
      title: formData.title,
      course: formData.course,
      dueDate: formData.dueDate || null,
      source: formData.source || "MANUAL"
    };

    const url = editingAssignment
      ? `/api/assignments/${editingAssignment.id}`
      : "/api/assignments";

    const method = editingAssignment ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(assignment)
    });

    if (response.ok) {
      setFormData({
        title: "",
        course: "",
        dueDate: "",
        source: ""
      });
      setEditingAssignment(null);

      onAssignmentAdded();
    } else {
      console.error("Failed to save assignment:", await response.text());
    }
  }

  useEffect(() => {
    if (editingAssignment) {
      setFormData({
        title: editingAssignment.title || "",
        course: editingAssignment.course || "",
        dueDate: editingAssignment.dueDate || "",
        source: editingAssignment.source || ""
      });
    }
  }, [editingAssignment]);

  function handleInputChange(e) {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  }

  return (
    <form id="add-assignment" onSubmit={handleSubmit}>
      <div className="section-header">
        <h2>Add Assignment</h2>
        <p>Create a new task with an optional due date and source.</p>
      </div>
      <label>Title</label>
      <input
        name="title"
        value={formData.title}
        onChange={handleInputChange}
        placeholder="Title"
        required
      />
      <label>Course</label>
      <input
        name="course"
        value={formData.course}
        onChange={handleInputChange}
        placeholder="Course"
        required
      />
      <label>Due Date</label>
      <input
        name="dueDate"
        value={formData.dueDate}
        onChange={handleInputChange}
        placeholder="Due Date"
        type="date"
      />
      <label>Source</label>
      <input
        name="source"
        value={formData.source}
        onChange={handleInputChange}
        placeholder="Source"
      />
      <div className="form-actions">
        <button className="primary-btn" type="submit">
          {editingAssignment ? "Save Changes" : "Add"}
        </button>
      </div>
    </form>
  );
}

export default AssignmentForm;
