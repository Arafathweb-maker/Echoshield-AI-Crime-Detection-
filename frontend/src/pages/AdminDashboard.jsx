function AdminDashboard({ dashboard, incidents, evidence, status, onCreateIncident }) {
  const summaryCards = [
    { label: 'Total incidents', value: dashboard?.totalIncidents || 0 },
    { label: 'Open cases', value: dashboard?.openCount || 0 },
    { label: 'Investigating', value: dashboard?.investigatingCount || 0 },
    { label: 'High severity', value: dashboard?.highSeverity || 0 }
  ];

  return (
    <div className="dashboard-stack">
      <section className="grid cards">
        {summaryCards.map((card) => (
          <article key={card.label} className="panel card">
            <h3>{card.label}</h3>
            <p className="big-number">{card.value}</p>
          </article>
        ))}
      </section>

      <section className="grid two-col">
        <div className="panel">
          <h2>Crime reports</h2>
          <ul className="feed">
            {incidents.slice(0, 5).map((incident) => (
              <li key={incident.id}><strong>{incident.title}</strong><span>{incident.severity}</span></li>
            ))}
          </ul>
        </div>
        <div className="panel">
          <h2>Users</h2>
          <p>Admin can review system users and manage access.</p>
          <p>Evidence items stored: {evidence.length}</p>
        </div>
      </section>

      <section className="grid two-col">
        <div className="panel">
          <h2>Analytics</h2>
          <p>Monitor incident trends, response rates, and evidence volume.</p>
        </div>
        <div className="panel">
          <h2>System settings</h2>
          <p>Manage notification channels, geofence rules, and evidence workflows.</p>
          <button onClick={onCreateIncident}>Create sample incident</button>
        </div>
      </section>

      <section className="panel">
        <h2>Current status</h2>
        <p>{status}</p>
      </section>
    </div>
  );
}

export default AdminDashboard;
