/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";

function ClassForm({
  onSchoolClassAdded,
  editingSchoolClass,
  setEditingSchoolClass
}) {
  const [formData, setFormData] = useState({
    name: "",
    teacherName: ""
  });

  async function handleSubmit(e) {
    e.preventDefault();

    const schoolClass = {
      name: formData.name,
      teacherName: formData.teacherName
    };

    const url = editingSchoolClass
      ? `/api/classes/${editingSchoolClass.id}`
      : "/api/classes";

    const method = editingSchoolClass ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(schoolClass)
    });

    if (response.ok) {
      setFormData({
        name: "",
        teacherName: ""
      });
      setEditingSchoolClass(null);

      onSchoolClassAdded();
    } else {
      console.error("Failed to save class:", await response.text());
    }
  }

  useEffect(() => {
    if (editingSchoolClass) {
      setFormData({
        name: editingSchoolClass.name || "",
        teacherName: editingSchoolClass.teacherName || ""
      });
    }
  }, [editingSchoolClass]);

  function handleInputChange(e) {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  }

  return (
    <form id="form-container" onSubmit={handleSubmit}>
      <div className="section-header">
        <h2>{editingSchoolClass ? "Edit Class" : "Add Class"}</h2>
        <p>
          {editingSchoolClass
            ? "Update the details for this class."
            : "Add a class you are enrolled in."}
        </p>
      </div>
      <label>Class</label>
      <input
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        placeholder="Class"
        required
      />
      <label>Teacher</label>
      <input
        name="teacherName"
        value={formData.teacherName}
        onChange={handleInputChange}
        placeholder="Teacher"
        required
      />
      <div className="form-actions">
        <button className="primary-btn" type="submit">
          {editingSchoolClass ? "Save Changes" : "Add"}
        </button>
      </div>
    </form>
  );
}

export default ClassForm;
