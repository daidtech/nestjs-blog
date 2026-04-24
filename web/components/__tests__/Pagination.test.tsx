import { fireEvent, render, screen } from '@testing-library/react';
import Pagination from '../Pagination';

describe('Pagination', () => {
  it('returns null when there is only one page', () => {
    const { container } = render(
      <Pagination meta={{ page: 1, totalPages: 1, total: 1 }} onPageChange={jest.fn()} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders page buttons and handles changes', () => {
    const onPageChange = jest.fn();
    render(<Pagination meta={{ page: 2, totalPages: 5, total: 50 }} onPageChange={onPageChange} />);

    expect(screen.getByText('50 results')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Prev' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Next' })).toBeEnabled();
    expect(screen.getByRole('button', { name: '2' })).toHaveClass('bg-indigo-600');

    fireEvent.click(screen.getByRole('button', { name: '3' }));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('disables Prev and Next at boundaries', () => {
    const onPageChange = jest.fn();
    const { rerender } = render(<Pagination meta={{ page: 1, totalPages: 3, total: 30 }} onPageChange={onPageChange} />);

    expect(screen.getByRole('button', { name: 'Prev' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next' })).toBeEnabled();

    rerender(<Pagination meta={{ page: 3, totalPages: 3, total: 30 }} onPageChange={onPageChange} />);
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
  });
});
