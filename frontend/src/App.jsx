import { useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ScreamDetector, simulateScreamDetection } from './utils/screamDetector';
import DashboardPage from './pages/DashboardPage';
import MapPage from './pages/MapPage';
import AuthPage from './pages/AuthPage';
import RegisterPage from './pages/RegisterPage';
import UserDashboard from './pages/UserDashboard';
import { AuthProvider, useAuth } from './context/AuthContext';

function getApiUrl(pathname) {
  const customBase = import.meta.env.VITE_API_URL || '';
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`;

  if (!customBase) {
    return normalizedPath.startsWith('/api') ? normalizedPath : `/api${normalizedPath}`;
  }

  return `${customBase.replace(/\/$/, '')}${normalizedPath.startsWith('/api') ? normalizedPath : `/api${normalizedPath}`}`;
}

function AppShell() {
  const { user, logout, token, request } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [incidents, setIncidents] = useState([]);
  const [evidence, setEvidence] = useState([]);
  const [status, setStatus] = useState('Monitoring');
  const [screamScore, setScreamScore] = useState(0);

  useEffect(() => {
    if (!token) {
      return;
    }

    const loadData = async () => {
      try {
        const dashboardData = await request(getApiUrl('/dashboard'));
        setDashboard(dashboardData);
      } catch (error) {
        console.error(error);
      }

      try {
        const incidentsData = await request(getApiUrl('/incidents'));
        setIncidents(Array.isArray(incidentsData) ? incidentsData : []);
      } catch (error) {
        console.error(error);
      }

      try {
        const evidenceData = await request(getApiUrl('/evidence'));
        setEvidence(Array.isArray(evidenceData) ? evidenceData : []);
      } catch (error) {
        console.error(error);
      }
    };

    loadData();

    const detector = new ScreamDetector();
    detector.start((score) => setScreamScore(score)).then(() => setStatus('Listening for audio anomalies'));
    const cleanup = simulateScreamDetection((score) => setScreamScore(score), 8000);

    return () => {
      detector.stop();
      cleanup();
    };
  }, [request, token]);

  const submitIncident = async () => {
    try {
      const data = await request(getApiUrl('/incidents'), {
        method: 'POST',
        body: JSON.stringify({
          title: 'Manual patrol escalation',
          description: 'Operator marked an incident through the dashboard.',
          severity: 'high',
          lat: 12.9716,
          lng: 77.5946
        })
      });
      setIncidents((prev) => [data.incident, ...prev]);
      setStatus(`Incident ${data.incident.id} created`);
    } catch (error) {
      setStatus(error.message || 'Unable to create incident');
    }
  };

  const summaryCards = useMemo(() => [
    { label: 'Total incidents', value: dashboard?.totalIncidents || 0 },
    { label: 'Open cases', value: dashboard?.openCount || 0 },
    { label: 'Investigating', value: dashboard?.investigatingCount || 0 },
    { label: 'High severity', value: dashboard?.highSeverity || 0 }
  ], [dashboard]);

  if (!token) {
    return (
      <div className="shell auth-shell">
        <header className="hero">
          <div>
            <p className="eyebrow">EchoShield AI Crime Detection</p>
            <h1>Secure admin and citizen safety experience</h1>
            <p className="subtitle">Role-based access control, incident reporting, evidence handling, and AI assistance in one responsive platform.</p>
          </div>
        </header>
        <Routes>
          <Route path="/register" element={<RegisterPage onSwitch={() => window.location.assign('/')} />} />
          <Route path="*" element={<AuthPage />} />
        </Routes>
      </div>
    );
  }

  return (
    <div className="shell">
      <header className="hero">
        <div>
          <p className="eyebrow">EchoShield AI Crime Detection</p>
          <h1>{user?.role === 'admin' ? 'Admin control center' : 'Community safety workspace'}</h1>
          <p className="subtitle">Scream detection, automated recording, geofencing, and evidence collection in one secure control center.</p>
        </div>
        <div className="panel status-panel">
          <p><strong>Status:</strong> {status}</p>
          <p><strong>User:</strong> {user?.email}</p>
          <p><strong>Role:</strong> {user?.role}</p>
          <button onClick={logout}>Logout</button>
        </div>
      </header>

      <Routes>
        <Route path="/" element={user?.role === 'admin' ? (
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
        ) : (
          <UserDashboard user={user} incidents={incidents} evidence={evidence} status={status} />
        )} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/register" element={<RegisterPage onSwitch={() => window.location.assign('/')} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
