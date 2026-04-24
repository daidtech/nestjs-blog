import { render, screen, waitFor } from '@testing-library/react';
import AuthProvider from '../AuthProvider';
import { AuthContext } from '@/lib/auth';

jest.mock('@/lib/api', () => ({ apiFetch: jest.fn() }));

const { apiFetch } = jest.requireMock('@/lib/api');

describe('AuthProvider', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    window.localStorage.clear();
  });

  it('loads stored token and verifies profile on mount', async () => {
    window.localStorage.setItem('token', 'token');
    window.localStorage.setItem('user', JSON.stringify({ id: 1, username: 'test', role: 'USER' }));
    (apiFetch as jest.Mock).mockResolvedValue({ id: 1, username: 'test', role: 'USER' });

    function Consumer() {
      return (
        <AuthContext.Consumer>
          {(value) => <div>{value.user?.username ?? 'no-user'}</div>}
        </AuthContext.Consumer>
      );
    }

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    );

    await waitFor(() => expect(screen.getByText('test')).toBeInTheDocument());
    expect(apiFetch).toHaveBeenCalledWith('/auth/profile');
  });
});
