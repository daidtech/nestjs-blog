import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import CommentSection from '../CommentSection';

jest.mock('@/lib/auth', () => ({ useAuth: jest.fn() }));
jest.mock('@/lib/api', () => ({ apiFetch: jest.fn() }));

const { useAuth } = jest.requireMock('@/lib/auth');
const { apiFetch } = jest.requireMock('@/lib/api');

describe('CommentSection', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    (useAuth as jest.Mock).mockReturnValue({ user: null, token: null });
    (apiFetch as jest.Mock).mockResolvedValue([]);
  });

  it('renders sign-in prompt when unauthenticated', async () => {
    render(<CommentSection postId={1} />);

    expect(await screen.findByText('Sign in')).toBeInTheDocument();
    expect(await screen.findByText('No comments yet. Be the first!')).toBeInTheDocument();
  });

  it('allows posting a comment when authenticated', async () => {
    (useAuth as jest.Mock).mockReturnValue({ user: { id: 1, username: 'test', role: 'USER' }, token: 'token' });
    (apiFetch as jest.Mock).mockResolvedValueOnce([]).mockResolvedValueOnce([]);

    render(<CommentSection postId={1} />);

    await screen.findByPlaceholderText('Write a comment...');
    fireEvent.change(screen.getByPlaceholderText('Write a comment...'), { target: { value: 'Hello world' } });
    fireEvent.click(screen.getByRole('button', { name: /post comment/i }));

    await waitFor(() => expect(apiFetch).toHaveBeenCalledWith('/posts/1/comments', expect.any(Object)));
    expect((screen.getByPlaceholderText('Write a comment...') as HTMLTextAreaElement).value).toBe('');
  });
});
