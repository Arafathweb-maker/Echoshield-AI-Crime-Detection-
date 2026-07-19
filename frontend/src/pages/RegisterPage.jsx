import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function RegisterPage({ onSwitch }) {
  const { register } = useAuth();
  const [form, setForm] = useState({ email: '', password: '', name: '', role: 'user' });
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await register(form);
      setMessage('Account created successfully.');
      onSwitch?.('login');
    } catch (error) {
      setMessage(error.message || 'Registration failed');
    }
  };

  return (
    <div className="panel auth-card">
      <h2>Create an account</h2>
      <p>Register as a regular user to report incidents and receive support.</p>
      <form onSubmit={handleSubmit} className="login-form auth-stack">
        <input name="name" placeholder="Full name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
        <input name="email" placeholder="Email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
        <input name="password" placeholder="Password" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
        <select name="role" value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Register</button>
      </form>
      <p className="helper-text">Already have an account? <button type="button" className="link-button" onClick={() => onSwitch?.('login')}>Sign in</button></p>
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default RegisterPage;
