function UserDashboard({ user, incidents, evidence, status }) {
  const quickActions = [
    { title: 'Report Crime', description: 'Submit an incident report instantly.' },
    { title: 'Upload Media', description: 'Attach photos or videos for evidence.' },
    { title: 'Emergency SOS', description: 'Alert nearby support and emergency contacts.' },
    { title: 'Nearby Stations', description: 'View police station information nearby.' }
  ];

  return (
    <div className="dashboard-stack">
      <section className="panel">
        <h2>Welcome, {user?.name || user?.email || 'user'}</h2>
        <p>{status}</p>
      </section>
      <section className="grid cards">
        {quickActions.map((item) => (
          <article key={item.title} className="panel card">
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
        ))}
      </section>
      <section className="grid two-col">
        <div className="panel">
          <h2>My reports</h2>
          <ul className="feed">
            {incidents.slice(0, 3).map((incident) => (
              <li key={incident.id}><strong>{incident.title}</strong><span>{incident.severity}</span></li>
            ))}
          </ul>
        </div>
        <div className="panel">
          <h2>AI Crime Assistant</h2>
          <p>Ask for guidance, generate a safety plan, and summarize evidence.</p>
          <p>Evidence items stored: {evidence.length}</p>
        </div>
      </section>
    </div>
  );
}

export default UserDashboard;
