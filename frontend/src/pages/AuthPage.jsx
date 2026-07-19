function AuthPage({ onLogin }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    onLogin({ email: form.get('email'), password: form.get('password') });
  };

  return (
    <div className="panel auth-card">
      <h2>Operator sign in</h2>
      <p>Use the demo credentials for the EchoShield control center.</p>
      <form onSubmit={handleSubmit} className="login-form">
        <input name="email" defaultValue="admin@echoshield.ai" />
        <input name="password" defaultValue="demo1234" type="password" />
        <button type="submit">Sign in</button>
      </form>
    </div>
  );
}

export default AuthPage;
