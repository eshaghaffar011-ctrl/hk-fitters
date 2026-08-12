import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/auth/AuthForm';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  return (
    <div className="page">
      <section className="section auth-page">
        <AuthForm
          type="login"
          onSubmit={(email, password) => {
            const isLoggedIn = login(email, password);
            if (isLoggedIn) {
              navigate('/profile');
            }
            return isLoggedIn;
          }}
        />
      </section>
    </div>
  );
}

export default LoginPage;
