import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import BookmarkButton from '../BookmarkButton';

jest.mock('@/lib/auth', () => ({ useAuth: jest.fn() }));
jest.mock('@/lib/api', () => ({ apiFetch: jest.fn() }));
jest.mock('@/lib/navigation', () => ({ redirectToLogin: jest.fn() }));

const { useAuth } = jest.requireMock('@/lib/auth');
const { apiFetch } = jest.requireMock('@/lib/api');
const { redirectToLogin } = jest.requireMock('@/lib/navigation');

describe('BookmarkButton', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('redirects to login when user is not authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({ token: null });
    render(<BookmarkButton postId={1} />);

    fireEvent.click(screen.getByRole('button'));
    expect(redirectToLogin).toHaveBeenCalled();
  });

  it('toggles the bookmarked state when authenticated', async () => {
    (useAuth as jest.Mock).mockReturnValue({ token: 'token' });
    (apiFetch as jest.Mock).mockResolvedValue({});

    render(<BookmarkButton postId={1} initialBookmarked={false} />);

    fireEvent.click(screen.getByRole('button'));
    await waitFor(() => expect(apiFetch).toHaveBeenCalledWith('/posts/1/bookmark', { method: 'POST' }));
    expect(screen.getByText('Saved')).toBeInTheDocument();
  });
});
