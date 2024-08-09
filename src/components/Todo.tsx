import React, { useEffect, useState } from "react";
import "./Todo.css";

interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
  date: number;
}

export const Todo: React.FC = () => {
  const storedTodos = localStorage.getItem("todos");
  const [todos, setTodos] = useState<TodoItem[]>(
    storedTodos ? JSON.parse(storedTodos) : []
  );
  const [inputValue, setInputValue] = useState<string>("");
  const [filter, setFilter] = useState<string>("All");
  const [sort, setSort] = useState<string>("Newest");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState<string>("");

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const addTodoItem = () => {
    if (inputValue.trim() !== "") {
      const newTodo: TodoItem = {
        id: Date.now(),
        text: inputValue.trim(),
        completed: false,
        date: Date.now(),
      };
      setTodos([...todos, newTodo]);
      setInputValue("");
    }
  };

  const toggleTodoCompletion = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const removeCompletedTodos = () => {
    setTodos(todos.filter((todo) => !todo.completed));
  };

  const deleteTodoItem = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const startEditing = (id: number, text: string) => {
    setEditingId(id);
    setEditingValue(text);
  };

  const handleEditChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditingValue(event.target.value);
  };

  const saveEdit = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, text: editingValue } : todo
      )
    );
    setEditingId(null);
    setEditingValue("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingValue("");
  };

  const incompleteTasksCount = todos.filter((todo) => !todo.completed).length;
  const completedTasksExist = todos.some((todo) => todo.completed);

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(event.target.value);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSort(event.target.value);
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "Completed") return todo.completed;
    if (filter === "Incomplete") return !todo.completed;
    return true;
  });

  const sortedTodos = filteredTodos.sort((a, b) => {
    if (sort === "Newest") return b.date - a.date;
    return a.date - b.date;
  });

  return (
    <div className="todo-app">
      <h2>My To-Do List</h2>
      <p>Active Tasks: {incompleteTasksCount}</p>

      <div className="input-section">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="What needs to be done?"
        />
        <button style={{ backgroundColor: "blue" }} onClick={addTodoItem}>
          Add
        </button>
       
      </div>

      <div className="filter-sort-section">
        <select value={filter} onChange={handleFilterChange}>
          <option value="All">All</option>
          <option value="Completed">Completed</option>
          <option value="Incomplete">Active</option>
        </select>

        <select value={sort} onChange={handleSortChange}>
          <option value="Newest">Newest First</option>
          <option value="Oldest">Oldest First</option>
        </select>
      </div>

      <ul>
        {sortedTodos.map((todo) => (
          <li
            key={todo.id}
            id={`todo-${todo.id}`}
            className="todo-item add-animation"
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodoCompletion(todo.id)}
            />
            {editingId === todo.id ? (
              <>
                <input
                  type="text"
                  value={editingValue}
                  onChange={handleEditChange}
                  className="edit-input"
                />
                <button onClick={() => saveEdit(todo.id)} className="save-btn">
                  Save
                </button>
                <button onClick={cancelEdit} className="cancel-btn">
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span className={todo.completed ? "completed" : ""}>
                  {todo.text}
                </span>
                <button
                  onClick={() => startEditing(todo.id, todo.text)}
                  className="edit-btn"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTodoItem(todo.id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
      <div> {completedTasksExist && (
          <button onClick={removeCompletedTodos} style={{backgroundColor:"#c82333",color:"white"}} className="remove-btn">
            Remove Completed
          </button>
        )}</div>
    </div>
  );
};
