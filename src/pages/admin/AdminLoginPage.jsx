import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ADMIN_KEY = 'hkfitters_admin';

function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!password.trim()) {
      setError('Please enter the admin password.');
      return;
    }

    if (password === 'admin123') {
      localStorage.setItem(ADMIN_KEY, 'true');
      setError('');
      navigate('/admin/dashboard');
      return;
    }

    setError('Invalid admin password.');
  };

  return (
    <div className="page">
      <section className="section auth-page">
        <form className="auth-card" onSubmit={handleSubmit} noValidate>
          <h2>Admin Login</h2>
          {error && <p style={{ color: '#b80c0c', marginBottom: '12px' }}>{error}</p>}
          <input type="password" placeholder="Admin Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button className="btn btn-primary full" type="submit">Enter Dashboard</button>
        </form>
      </section>
    </div>
  );
}

export default AdminLoginPage;
