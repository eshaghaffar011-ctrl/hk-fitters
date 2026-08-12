import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProfilePage() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="page">
        <section className="section">
          <h1>My Profile</h1>
          <p>Please log in to continue.</p>
          <Link to="/login" className="btn btn-primary">Login</Link>
        </section>
      </div>
    );
  }

  return (
    <div className="page">
      <section className="section">
        <h1>My Profile</h1>
        <div className="summary-card">
          <p><strong>Email:</strong> {user.email}</p>
          <p>Saved addresses and order history will appear here soon.</p>
          <button className="btn btn-secondary" onClick={logout}>Logout</button>
        </div>
      </section>
    </div>
  );
}

export default ProfilePage;
