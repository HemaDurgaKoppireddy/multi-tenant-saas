import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import "../styles/dashboard.css";

export default function Dashboard() {
  const { user } = useAuth();

  const [projects, setProjects] = useState([]);
  const [myTasks, setMyTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        // 1️⃣ Get projects
        const projectRes = await api.get("/projects");
        const projectList = projectRes.data.data.projects || [];
        setProjects(projectList);

        // 2️⃣ Get tasks assigned to current user (from each project)
        const taskPromises = projectList.map((project) =>
          api.get(
            `/projects/${project.id}/tasks?assignedTo=${user.id}`
          )
        );

        const taskResponses = await Promise.all(taskPromises);

        const tasks = taskResponses.flatMap(
          (res) => res.data.data.tasks || []
        );

        setMyTasks(tasks);
      } catch (err) {
        console.error("Dashboard load failed:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      loadDashboard();
    }
  }, [user]);

  if (loading) {
    return <div className="page-loading">Loading dashboard...</div>;
  }

  const completedTasks = myTasks.filter(
    (t) => t.status === "completed"
  ).length;

  const pendingTasks = myTasks.filter(
    (t) => t.status !== "completed"
  ).length;

  return (
    <>
      <div className="dashboard-wrapper">
        <div className="dashboard-container">
          {/* HEADER */}
          <div className="dashboard-header">
            <h1>Dashboard</h1>
            <p className="subtitle">
              Welcome back, {user.fullName}
            </p>
          </div>

          {/* STATISTICS */}
          <div className="stats-grid">
            <div className="stat-card">
              <h3>{projects.length}</h3>
              <span>Total Projects</span>
            </div>

            <div className="stat-card">
              <h3>{myTasks.length}</h3>
              <span>Total Tasks</span>
            </div>

            <div className="stat-card success">
              <h3>{completedTasks}</h3>
              <span>Completed Tasks</span>
            </div>

            <div className="stat-card warning">
              <h3>{pendingTasks}</h3>
              <span>Pending Tasks</span>
            </div>
          </div>

          {/* RECENT PROJECTS */}
          <div className="section">
            <h2>Recent Projects</h2>

            <div className="project-grid">
              {projects.slice(0, 5).map((project) => (
                <div
                  key={project.id}
                  className="project-card clickable"
                  onClick={() =>
                    window.location.href = `/projects/${project.id}`
                  }
                >
                  <h3>{project.name}</h3>
                  <span className={`status ${project.status}`}>
                    {project.status}
                  </span>
                  <p className="tasks">
                    {project.taskCount || 0} Tasks
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* MY TASKS */}
          <div className="section">
            <h2>My Tasks</h2>

            {myTasks.length === 0 ? (
              <div className="empty-state">
                No tasks assigned to you
              </div>
            ) : (
              <table className="task-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Project</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {myTasks.map((task) => (
                    <tr key={task.id}>
                      <td>{task.title}</td>
                      <td>{task.projectName || "—"}</td>
                      <td className={`priority ${task.priority}`}>
                        {task.priority}
                      </td>
                      <td>{task.status}</td>
                      <td>
                        {task.dueDate
                          ? new Date(task.dueDate).toLocaleDateString()
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
