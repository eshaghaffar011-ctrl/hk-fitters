import { fireEvent, render, screen } from '@testing-library/react';
import { AuthProvider, useAuth } from './context/AuthContext';

function AuthStateTester() {
  const { user, login, logout } = useAuth();

  return (
    <div>
      <p>{user ? `Logged in as ${user.email}` : 'Logged out'}</p>
      <button type="button" onClick={() => login('customer@example.com', 'secret123')}>
        Login
      </button>
      <button type="button" onClick={logout}>Logout</button>
    </div>
  );
}

test('persists the user session and supports logout', () => {
  localStorage.clear();

  render(
    <AuthProvider>
      <AuthStateTester />
    </AuthProvider>
  );

  fireEvent.click(screen.getByRole('button', { name: /login/i }));

  expect(screen.getByText(/logged in as customer@example.com/i)).toBeInTheDocument();
  expect(JSON.parse(localStorage.getItem('hkfitters_user'))).toEqual({ email: 'customer@example.com' });

  fireEvent.click(screen.getByRole('button', { name: /logout/i }));

  expect(screen.getByText(/logged out/i)).toBeInTheDocument();
  expect(localStorage.getItem('hkfitters_user')).toBeNull();
});
