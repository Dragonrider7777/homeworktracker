/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";
import ClassCard from "../components/classes/ClassCard";
import ClassForm from "../components/classes/ClassForm";

function SettingsPage() {
  const [schoolClasses, setSchoolClasses] = useState([]);
  const [editingSchoolClass, setEditingSchoolClass] = useState(null);

  async function loadSchoolClasses() {
    try {
      const res = await fetch("/api/classes");

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();

      setSchoolClasses(data);
    } catch (error) {
      console.error("Failed to load school classes:", error);
    }
  }

  useEffect(() => {
    loadSchoolClasses();
  }, []);

  async function deleteSchoolClass(id) {
    await fetch(`/api/classes/${id}`, { method: "DELETE" });
    loadSchoolClasses();
    toast.error("Class deleted", {
      icon: <FaTrash />,
      className: "toast-error"
    });
  }

  return (
    <div className="container">
      <div id="page-header">
        <h1>Settings</h1>
        <p className="subtitle">Manage your classes and app preferences.</p>
      </div>

      <section className="settings-card">
        <div className="section-header">
          <h2>Your Classes</h2>
          <p>Add the classes you are currently taking.</p>
        </div>

        <ul id="list">
          {schoolClasses.length === 0 ? (
            <li className="empty-state">
              <h3>No classes yet</h3>
              <p>Add your first class below.</p>
            </li>
          ) : (
            schoolClasses.map((schoolClass) => (
              <ClassCard
                key={schoolClass.id}
                schoolClass={schoolClass}
                onDelete={deleteSchoolClass}
                onEdit={setEditingSchoolClass}
              />
            ))
          )}
        </ul>
      </section>
      <ClassForm
        onSchoolClassAdded={loadSchoolClasses}
        editingSchoolClass={editingSchoolClass}
        setEditingSchoolClass={setEditingSchoolClass}
      />
    </div>
  );
}

export default SettingsPage;
