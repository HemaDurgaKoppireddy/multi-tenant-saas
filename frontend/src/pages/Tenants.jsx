import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Tenants() {
  const { token } = useAuth();
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTenants = async () => {
      try {
        const res = await fetch("/api/tenants", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 403) {
          setError("Access denied");
          return;
        }

        const data = await res.json();
        setTenants(data.data.tenants);
      } catch {
        setError("Failed to load tenants");
      } finally {
        setLoading(false);
      }
    };

    loadTenants();
  }, [token]);

  if (loading) return <p>Loading tenants...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>All Tenants</h2>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Name</th>
            <th>Subdomain</th>
            <th>Status</th>
            <th>Plan</th>
            <th>Users</th>
            <th>Projects</th>
          </tr>
        </thead>
        <tbody>
          {tenants.map((t) => (
            <tr key={t.id}>
              <td>{t.name}</td>
              <td>{t.subdomain}</td>
              <td>{t.status}</td>
              <td>{t.subscriptionPlan}</td>
              <td>{t.totalUsers}</td>
              <td>{t.totalProjects}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
