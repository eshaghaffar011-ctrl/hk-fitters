import { useState } from 'react';

function AuthForm({ type, onSubmit }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password.trim()) {
      setError('Please enter both your email and password.');
      setSuccess('');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      setSuccess('');
      return;
    }

    const didSubmit = onSubmit(trimmedEmail, password);
    if (didSubmit === false) {
      setError('Unable to continue with the current account details.');
      setSuccess('');
      return;
    }

    setError('');
    setSuccess(type === 'login' ? 'Login successful.' : 'Account created successfully.');
  };

  return (
    <form className="auth-card" onSubmit={handleSubmit} noValidate>
      <h2>{type === 'login' ? 'Login' : 'Register'}</h2>
      {error && <p style={{ color: '#b80c0c', marginBottom: '12px' }}>{error}</p>}
      {success && <p style={{ color: '#0d7b4f', marginBottom: '12px' }}>{success}</p>}
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button className="btn btn-primary full" type="submit">
        {type === 'login' ? 'Sign In' : 'Create Account'}
      </button>
    </form>
  );
}

export default AuthForm;
