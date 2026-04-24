import { fireEvent, render, screen } from '@testing-library/react';
import Badge from '../Badge';

describe('Badge', () => {
  it('renders a button by default and shows count', () => {
    const onClick = jest.fn();

    render(<Badge label="New" count={3} onClick={onClick} />);

    expect(screen.getByRole('button')).toHaveTextContent('New');
    expect(screen.getByText('(3)')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalled();
  });

  it('renders a link when href is provided', () => {
    render(<Badge label="Category" href="/categories/1" />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/categories/1');
    expect(link).toHaveTextContent('Category');
  });

  it('applies active styles when active is true', () => {
    render(<Badge label="Active" active />);

    expect(screen.getByRole('button')).toHaveClass('bg-indigo-600');
  });
});
