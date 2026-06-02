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

  // Handle form submission for both adding and editing assignments
  async function handleSubmit(e) {
    // Prevent default form submission behavior
    e.preventDefault();

    // Construct the assignment object to send to the backend
    const assignment = {
      title: formData.title,
      course: formData.course,
      dueDate: formData.dueDate || null,
      source: formData.source || "MANUAL"
    };

    /* Determine the API endpoint and HTTP method based on whether we're editing or adding
        - If editing, we send a PUT request to /api/assignments/:id
        - If adding, we send a POST request to /api/assignments

    Since the backend API is designed to handle both creation and updates, we can use the same form for both actions. The presence of an editingAssignment prop indicates whether we're in edit mode or add mode, allowing us to adjust our API call accordingly.
    */
    const url = editingAssignment
      ? `/api/assignments/${editingAssignment.id}`
      : "/api/assignments";

    // Use PUT for editing and POST for adding
    const method = editingAssignment ? "PUT" : "POST";

    // Make the API call to save the assignment
    const response = await fetch(url, {
      method, // Set the appropriate headers and body for the request
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(assignment)
    });

    // Handle the response from the backend
    if (response.ok) {
      setFormData({
        title: "",
        course: "",
        dueDate: "",
        source: ""
      });
      setEditingAssignment(null); // Clear the editing state after saving

      onAssignmentAdded(); // Notify the parent component to refresh the assignment list
    } else {
      // Log an error if the save operation failed
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
