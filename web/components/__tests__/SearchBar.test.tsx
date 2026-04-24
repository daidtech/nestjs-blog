import { fireEvent, render, screen } from '@testing-library/react';
import SearchBar from '../SearchBar';

describe('SearchBar', () => {
  it('renders with default placeholder and calls onSearch on submit', () => {
    const onSearch = jest.fn();
    render(<SearchBar onSearch={onSearch} />);

    const input = screen.getByPlaceholderText('Search...');
    fireEvent.change(input, { target: { value: '  test query  ' } });
    fireEvent.submit(screen.getByRole('button', { name: /search/i }));

    expect(onSearch).toHaveBeenCalledWith('test query');
  });

  it('clears the query when the clear button is clicked', () => {
    const onSearch = jest.fn();
    render(<SearchBar onSearch={onSearch} defaultValue="hello" />);

    const buttons = screen.getAllByRole('button');
    const clearButton = buttons.find((button) => button.textContent === '');
    expect(clearButton).toBeDefined();
    fireEvent.click(clearButton!);

    expect(onSearch).toHaveBeenCalledWith('');
    expect((screen.getByPlaceholderText('Search...') as HTMLInputElement).value).toBe('');
  });
});
