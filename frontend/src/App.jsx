import { useEffect, useMemo, useState } from 'react';
import { ScreamDetector, simulateScreamDetection } from './utils/screamDetector';
import DashboardPage from './pages/DashboardPage';
import AuthPage from './pages/AuthPage';
import MapPage from './pages/MapPage';

const defaultUser = {
  email: 'admin@echoshield.ai',
  role: 'admin'
};

function getApiUrl(pathname) {
  const customBase = import.meta.env.VITE_API_URL || '';
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`;

  if (!customBase) {
    return normalizedPath.startsWith('/api') ? normalizedPath : `/api${normalizedPath}`;
  }

  return `${customBase.replace(/\/$/, '')}${normalizedPath.startsWith('/api') ? normalizedPath : `/api${normalizedPath}`}`;
}

function App() {
  const [dashboard, setDashboard] = useState(null);
  const [incidents, setIncidents] = useState([]);
  const [evidence, setEvidence] = useState([]);
  const [status, setStatus] = useState('Monitoring');
  const [screamScore, setScreamScore] = useState(0);
  const [auth, setAuth] = useState(defaultUser);
  const [activeTab, setActiveTab] = useState('dashboard');

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
    const response = await fetch(getApiUrl('/dashboard'));
    const data = await response.json();
    setDashboard(data);
  };

  const fetchIncidents = async () => {
    const response = await fetch(getApiUrl('/incidents'));
    const data = await response.json();
    setIncidents(data);
  };

  const fetchEvidence = async () => {
    const response = await fetch(getApiUrl('/evidence'));
    const data = await response.json();
    setEvidence(data);
  };

  const login = async ({ email, password }) => {
    const response = await fetch(getApiUrl('/auth/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    if (data.user) {
      setAuth(data.user);
      setStatus(`Signed in as ${data.user.email}`);
      setActiveTab('dashboard');
    }
  };

  const submitIncident = async () => {
    const response = await fetch(getApiUrl('/incidents'), {
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
    setIncidents((prev) => [data.incident, ...prev]);
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

      <nav className="tabs">
        <button className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>Dashboard</button>
        <button className={activeTab === 'map' ? 'active' : ''} onClick={() => setActiveTab('map')}>Map</button>
        <button className={activeTab === 'auth' ? 'active' : ''} onClick={() => setActiveTab('auth')}>Auth</button>
      </nav>

      {activeTab === 'dashboard' && (
        <>
          <section className="grid cards">
            {summaryCards.map((card) => (
              <article key={card.label} className="panel card">
                <h3>{card.label}</h3>
                <p className="big-number">{card.value}</p>
              </article>
            ))}
          </section>
          <DashboardPage dashboard={dashboard} incidents={incidents} evidence={evidence} screamScore={screamScore} status={status} />
          <div className="panel action-row">
            <button onClick={submitIncident}>Create manual incident</button>
          </div>
        </>
      )}

      {activeTab === 'map' && <MapPage />}
      {activeTab === 'auth' && <AuthPage onLogin={login} />}
    </div>
  );
}

export default App;
