function DashboardPage({ dashboard, incidents, evidence, screamScore, status }) {
  const cards = [
    { label: 'Total incidents', value: dashboard?.totalIncidents || 0 },
    { label: 'Open cases', value: dashboard?.openCount || 0 },
    { label: 'Investigating', value: dashboard?.investigatingCount || 0 },
    { label: 'High severity', value: dashboard?.highSeverity || 0 }
  ];

  return (
    <>
      <section className="grid cards">
        {cards.map((card) => (
          <article key={card.label} className="panel card">
            <h3>{card.label}</h3>
            <p className="big-number">{card.value}</p>
          </article>
        ))}
      </section>

      <section className="grid two-col">
        <div className="panel">
          <h2>Live audio monitoring</h2>
          <p>Current scream confidence: <strong>{Math.round(screamScore)}%</strong></p>
          <p>Current status: <strong>{status}</strong></p>
        </div>
        <div className="panel">
          <h2>Recent incidents</h2>
          <ul className="feed">
            {incidents.slice(0, 5).map((incident) => (
              <li key={incident.id}><strong>{incident.title}</strong><span>{incident.severity}</span></li>
            ))}
          </ul>
        </div>
      </section>

      <section className="panel">
        <h2>Evidence vault</h2>
        <p>{evidence.length} evidence item(s) stored in the secure evidence repository.</p>
      </section>
    </>
  );
}

export default DashboardPage;
