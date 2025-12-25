import { useState } from "react";
import api from "../services/api";

export default function ProjectModal({ project, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: project?.name || "",
    description: project?.description || "",
    status: project?.status || "active",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (project) {
      await api.put(`/projects/${project.id}`, form);
    } else {
      await api.post("/projects", form);
    }

    onSaved();
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{project ? "Edit Project" : "Create Project"}</h2>

        <form onSubmit={handleSubmit}>
          <input
            placeholder="Project Name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          <select
            value={form.status}
            onChange={(e) =>
              setForm({ ...form, status: e.target.value })
            }
          >
            <option value="active">Active</option>
            <option value="archived">Archived</option>
            <option value="completed">Completed</option>
          </select>

          <div className="modal-actions">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button className="primary-btn" type="submit">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
