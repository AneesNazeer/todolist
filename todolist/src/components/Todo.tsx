import React,{ useEffect, useState } from 'react'
import  "./Todo.css"


interface TodoItem {
    id: number;
    text: string;
    completed: boolean;
  }

export const Todo: React.FC = () => {
    const [todos, setTodos] = useState<TodoItem[]>([]);
    const [inputValue, setInputValue] = useState<string>('');
  
    useEffect(() => {
      const storedTodos = localStorage.getItem('todos');
      if (storedTodos) {
        setTodos(JSON.parse(storedTodos));
      }
    }, []);
  
    useEffect(() => {
      localStorage.setItem('todos', JSON.stringify(todos));
    }, [todos]);
  
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(event.target.value);
    };
  
    const addTodoItem = () => {
      if (inputValue.trim() !== '') {
        const newTodo: TodoItem = {
          id: Date.now(),
          text: inputValue.trim(),
          completed: false,
        };
        setTodos([...todos, newTodo]);
        setInputValue('');
      }
    };
  
    const toggleTodoCompletion = (id: number) => {
      setTodos(todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      ));
    };
  
    const removeCompletedTodos = () => {
      setTodos(todos.filter(todo => !todo.completed));
    };
  
    const deleteTodoItem = (id: number) => {
      const itemToRemove = document.getElementById(`todo-${id}`);
      if (itemToRemove) {
        itemToRemove.classList.add('remove-animation');
        setTimeout(() => {
          setTodos(todos.filter(todo => todo.id !== id));
        }, 300); 
      }
    };
  
    const incompleteTasksCount = todos.filter(todo => !todo.completed).length;
  
    return (
      <div className="todo-app">
        <h2>My To-Do List</h2>
        <p>Incomplete Tasks: {incompleteTasksCount}</p>
  
        <div className="input-section">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="What needs to be done?"
          />
          <button style={{backgroundColor:"blue"}} onClick={addTodoItem}>Add</button>
          <button onClick={removeCompletedTodos} className="remove-btn">
            Remove Completed
          </button>
        </div>
  
        <ul>
          {todos.map((todo) => (
            <li key={todo.id} id={`todo-${todo.id}`} className="todo-item add-animation">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodoCompletion(todo.id)}
              />
              <span className={todo.completed ? 'completed' : ''}>
                {todo.text}
              </span>
              <button onClick={() => deleteTodoItem(todo.id)} className="delete-btn">
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  };