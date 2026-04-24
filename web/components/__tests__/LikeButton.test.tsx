import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import LikeButton from '../LikeButton';

jest.mock('@/lib/auth', () => ({ useAuth: jest.fn() }));
jest.mock('@/lib/api', () => ({ apiFetch: jest.fn() }));
jest.mock('@/lib/navigation', () => ({ redirectToLogin: jest.fn() }));

const { useAuth } = jest.requireMock('@/lib/auth');
const { apiFetch } = jest.requireMock('@/lib/api');
const { redirectToLogin } = jest.requireMock('@/lib/navigation');

describe('LikeButton', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it('redirects to login when not authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({ token: null });
    render(<LikeButton postId={1} />);
    fireEvent.click(screen.getByRole('button'));
    expect(redirectToLogin).toHaveBeenCalled();
  });

  it('increments the like count when authenticated', async () => {
    (useAuth as jest.Mock).mockReturnValue({ token: 'token' });
    (apiFetch as jest.Mock).mockResolvedValue({});

    render(<LikeButton postId={1} initialLiked={false} initialCount={0} />);
    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => expect(apiFetch).toHaveBeenCalledWith('/posts/1/like', { method: 'POST' }));
    expect(screen.getByRole('button')).toHaveTextContent('1');
  });
});
