import { render, screen } from '@testing-library/react';
import PostCard from '../PostCard';

describe('PostCard', () => {
  const post = {
    id: 1,
    title: 'Hello World',
    excerpt: 'This is a test post.',
    createdAt: '2024-01-02T00:00:00.000Z',
    author: { firstName: 'Jane', lastName: 'Doe', username: 'jdoe' },
    tags: [{ id: 1, name: 'react' }, { id: 2, name: 'testing' }],
    featuredImage: null,
    published: true,
  };

  it('renders default card variant with title, author, date and tags', () => {
    render(<PostCard post={post} />);

    expect(screen.getByText('Hello World')).toBeInTheDocument();
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('Jan 2, 2024')).toBeInTheDocument();
    expect(screen.getByText('react')).toBeInTheDocument();
    expect(screen.getByText('testing')).toBeInTheDocument();
  });

  it('renders featured variant with draft badge when unpublished', () => {
    render(<PostCard post={{ ...post, variant: undefined, published: false, featuredImage: 'image.png' }} variant="featured" />);

    expect(screen.getByText('Draft')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/posts/1');
  });
});
