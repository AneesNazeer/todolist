import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Todo } from './Todo';

describe('Todo', () => {
  test('renders todo input field and buttons', () => {
    render(<Todo />);
    expect(screen.getByPlaceholderText('What needs to be done?')).toBeInTheDocument();
    expect(screen.getByText('Add')).toBeInTheDocument();
    expect(screen.getByText('Remove Completed')).toBeInTheDocument();
  });

  test('adds a new todo item', () => {
    render(<Todo />);
    fireEvent.change(screen.getByPlaceholderText('What needs to be done?'), { target: { value: 'New Todo' } });
    fireEvent.click(screen.getByText('Add'));
    expect(screen.getByText('New Todo')).toBeInTheDocument();
  });

  test('marks a todo item as completed', () => {
    render(<Todo />);
    fireEvent.change(screen.getByPlaceholderText('What needs to be done?'), { target: { value: 'Another Todo' } });
    fireEvent.click(screen.getByText('Add'));
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    expect(screen.getByText('Another Todo')).toHaveClass('completed');
  });

  test('removes a todo item', () => {
    render(<Todo />);
    fireEvent.change(screen.getByPlaceholderText('What needs to be done?'), { target: { value: 'Todo to Remove' } });
    fireEvent.click(screen.getByText('Add'));
    fireEvent.click(screen.getByText('Delete'));
    expect(screen.queryByText('Todo to Remove')).not.toBeInTheDocument();
  });

  test('removes completed todos', () => {
    render(<Todo />);
    fireEvent.change(screen.getByPlaceholderText('What needs to be done?'), { target: { value: 'Todo 1' } });
    fireEvent.click(screen.getByText('Add'));
    fireEvent.change(screen.getByPlaceholderText('What needs to be done?'), { target: { value: 'Todo 2' } });
    fireEvent.click(screen.getByText('Add'));

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]); 

    fireEvent.click(screen.getByText('Remove Completed'));
    expect(screen.queryByText('Todo 1')).not.toBeInTheDocument();
    expect(screen.getByText('Todo 2')).toBeInTheDocument();
  });

  test('displays the correct count of incomplete tasks', () => {
    render(<Todo />);
    fireEvent.change(screen.getByPlaceholderText('What needs to be done?'), { target: { value: 'Todo 1' } });
    fireEvent.click(screen.getByText('Add'));
    fireEvent.change(screen.getByPlaceholderText('What needs to be done?'), { target: { value: 'Todo 2' } });
    fireEvent.click(screen.getByText('Add'));

    expect(screen.getByText('Incomplete Tasks: 2')).toBeInTheDocument();
    
    fireEvent.click(screen.getAllByRole('checkbox')[0]); 

    expect(screen.getByText('Incomplete Tasks: 1')).toBeInTheDocument();
  });
});