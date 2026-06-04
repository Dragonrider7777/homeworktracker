/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";

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
  const [classes, setClasses] = useState([]);
  const classOptions = classes.map((schoolClass) => ({
    value: schoolClass.name,
    label: schoolClass.name
  }));

  const selectedClass =
    classOptions.find((option) => option.value === formData.course) || null;

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

  // Fetch classes from api to use in dropdown
  async function loadClasses() {
    try {
      const res = await fetch("/api/classes");

      if (!res.ok) {
        throw new Error(`Server error ${res.status}`);
      }
      const data = await res.json();

      setClasses(data);
    } catch (error) {
      console.error("Failed to load school classes:", error);
    }
  }

  useEffect(() => {
    loadClasses();
  }, []);

  return (
    <form id="form-container" onSubmit={handleSubmit}>
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
      <Select
        options={classOptions}
        value={selectedClass}
        onChange={(selectedOption) =>
          setFormData({
            ...formData,
            course: selectedOption ? selectedOption.value : ""
          })
        }
        placeholder="Select a class"
        isClearable
        isSearchable={false}
        className="class-select"
        classNamePrefix="class-select"
      />
      <label>Due Date</label>
      <DatePicker
        selected={formData.dueDate ? new Date(formData.dueDate) : null}
        onChange={(date) =>
          setFormData({
            ...formData,
            dueDate: date ? date.toISOString().split("T")[0] : ""
          })
        }
        onKeyDown={(e) => {
          e.preventDefault();
        }}
        dateFormat="MMM d, yyyy"
        placeholderText="Select due date"
        className="custom-datepicker"
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
