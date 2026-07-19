import { useEffect, useMemo, useState } from 'react';
import { ScreamDetector, simulateScreamDetection } from './utils/screamDetector';

const defaultUser = {
  email: 'admin@echoshield.ai',
  role: 'admin'
};

function App() {
  const [dashboard, setDashboard] = useState(null);
  const [incidents, setIncidents] = useState([]);
  const [evidence, setEvidence] = useState([]);
  const [status, setStatus] = useState('Monitoring');
  const [screamScore, setScreamScore] = useState(0);
  const [auth, setAuth] = useState(defaultUser);

  useEffect(() => {
    fetchDashboard();
    fetchIncidents();
    fetchEvidence();

    const detector = new ScreamDetector();
    detector.start((score) => setScreamScore(score)).then(() => setStatus('Listening for audio anomalies'));
    const cleanup = simulateScreamDetection((score) => setScreamScore(score), 8000);

    return () => {
      detector.stop();
      cleanup();
    };
  }, []);

  const fetchDashboard = async () => {
    const response = await fetch('/api/dashboard');
    const data = await response.json();
    setDashboard(data);
  };

  const fetchIncidents = async () => {
    const response = await fetch('/api/incidents');
    const data = await response.json();
    setIncidents(data);
  };

  const fetchEvidence = async () => {
    const response = await fetch('/api/evidence');
    const data = await response.json();
    setEvidence(data);
  };

  const login = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: form.get('email'), password: form.get('password') })
    });
    const data = await response.json();
    if (data.user) {
      setAuth(data.user);
      setStatus(`Signed in as ${data.user.email}`);
    }
  };

  const submitIncident = async () => {
    const response = await fetch('/api/incidents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Manual patrol escalation',
        description: 'Operator marked an incident through the dashboard.',
        severity: 'high',
        lat: 12.9716,
        lng: 77.5946
      })
    });
    const data = await response.json();
    setIncidents([data.incident, ...incidents]);
    setStatus(`Incident ${data.incident.id} created`);
  };

  const summaryCards = useMemo(() => [
    { label: 'Total incidents', value: dashboard?.totalIncidents || 0 },
    { label: 'Open cases', value: dashboard?.openCount || 0 },
    { label: 'Investigating', value: dashboard?.investigatingCount || 0 },
    { label: 'High severity', value: dashboard?.highSeverity || 0 }
  ], [dashboard]);

  return (
    <div className="shell">
      <header className="hero">
        <div>
          <p className="eyebrow">EchoShield AI Crime Detection</p>
          <h1>Multimodal safety intelligence for rapid response</h1>
          <p className="subtitle">Scream detection, automated recording, geofencing, and evidence collection in one secure control center.</p>
        </div>
        <div className="panel status-panel">
          <p><strong>Status:</strong> {status}</p>
          <p><strong>User:</strong> {auth.email}</p>
          <p><strong>Role:</strong> {auth.role}</p>
        </div>
      </header>

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
          <h2>Live audio monitoring</h2>
          <p>Current scream confidence: <strong>{Math.round(screamScore)}%</strong></p>
          <button onClick={submitIncident}>Create manual incident</button>
          <form onSubmit={login} className="login-form">
            <input name="email" defaultValue="admin@echoshield.ai" />
            <input name="password" defaultValue="demo1234" type="password" />
            <button type="submit">Log in</button>
          </form>
        </div>
        <div className="panel">
          <h2>Incident feed</h2>
          <ul className="feed">
            {incidents.slice(0, 6).map((incident) => (
              <li key={incident.id}>
                <strong>{incident.title}</strong>
                <span>{incident.severity}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="grid two-col">
        <div className="panel">
          <h2>Evidence storage</h2>
          <ul className="feed">
            {evidence.map((item) => <li key={item.name}>{item.name}</li>)}
          </ul>
        </div>
        <div className="panel">
          <h2>Operational modules</h2>
          <ul className="feed">
            <li>Automatic camera recording</li>
            <li>Zoho Catalyst integration</li>
            <li>Geofencing and GPS tracking</li>
            <li>Cloud evidence storage</li>
            <li>Notification dispatch</li>
          </ul>
        </div>
      </section>
    </div>
  );
}

export default App;
