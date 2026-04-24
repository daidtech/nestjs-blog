import { render, screen, waitFor } from '@testing-library/react';
import Sidebar from '../Sidebar';

jest.mock('@/lib/api', () => ({ apiFetch: jest.fn() }));

const { apiFetch } = jest.requireMock('@/lib/api');

describe('Sidebar', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('renders categories and tags from apiFetch', async () => {
    (apiFetch as jest.Mock).mockImplementation((path: string) => {
      if (path === '/categories') {
        return Promise.resolve([{ id: 1, name: 'News', _count: { posts: 5 } }]);
      }
      if (path === '/tags') {
        return Promise.resolve([{ id: 1, name: 'React', _count: { taggings: 8 } }]);
      }
      return Promise.resolve([]);
    });

    render(<Sidebar />);

    await waitFor(() => expect(screen.getByText('News')).toBeInTheDocument());
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
  });

  it('shows empty state when no categories or tags are available', async () => {
    (apiFetch as jest.Mock).mockResolvedValue([]);
    render(<Sidebar />);

    expect(await screen.findByText('No categories yet')).toBeInTheDocument();
    expect(await screen.findByText('No tags yet')).toBeInTheDocument();
  });
});
