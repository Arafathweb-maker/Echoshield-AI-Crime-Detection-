import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function AuthPage() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: 'admin@echoshield.ai', password: 'demo1234', role: 'admin' });
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await login({ email: form.email, password: form.password, role: form.role });
      setMessage('Signed in successfully');
    } catch (error) {
      setMessage(error.message || 'Login failed');
    }
  };

  return (
    <div className="panel auth-card">
      <h2>Secure sign in</h2>
      <p>Access the EchoShield control center as an Admin or a regular User.</p>
      <form onSubmit={handleSubmit} className="login-form auth-stack">
        <input name="email" placeholder="Email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
        <input name="password" placeholder="Password" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
        <select name="role" value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
        <button type="submit">Login</button>
      </form>
      <p className="helper-text">Need an account? <a href="/register">Register</a></p>
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default AuthPage;
