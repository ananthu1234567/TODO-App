import { useState, useEffect } from 'react'
import './ui.css'

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [inputText, setInputText] = useState('');
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const addTodo = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    const newTodo = {
      id: Date.now(),
      text: inputText,
      completed: false
    };
    setTodos([...todos, newTodo]);
    setInputText('');
  };

  const deleteTodo = (id) => {
    const todoElement = document.querySelector(`[data-todo-id="${id}"]`);
    todoElement.style.animation = 'slideOut 0.3s ease-out';
    
    setTimeout(() => {
      setTodos(todos.filter(todo => todo.id !== id));
    }, 300);
  };

  const toggleComplete = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const saveEdit = (id) => {
    if (!editText.trim()) return;
    
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, text: editText.trim() } : todo
    ));
    setEditingId(null);
    setEditText('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  return (
    <>
      {/* Title section at the top */}
      <div className="header-section">
        <div className="app-title text-center">
          <h1 className="mb-0">
            <span className="title-word">Task</span>
            <span className="title-word">Master</span>
          </h1>
          <p className={`mb-0`}>Stay organized, get things done.</p>
        </div>
      </div>

      <div className={`container mt-4 ${darkMode ? 'dark-mode' : ''}`}>
        {/* Theme toggle button */}
        <div className="theme-toggle-wrapper">
          <button
            className={`btn theme-toggle-btn ${darkMode ? 'btn-light' : 'btn-dark'}`}
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>

        <form onSubmit={addTodo} className="mb-3 d-flex gap-2">
          <input
            type="text"
            className={`form-control ${darkMode ? 'dark-mode-input' : ''}`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter a new task"
          />
          <button type="submit" className="btn btn-primary">Add</button>
        </form>

        {todos.length === 0 ? (
          <p className={darkMode ? 'text-light' : 'text-muted'}>No tasks yet. Add one above!</p>
        ) : (
          <ul className="list-group">
            {todos.map((todo) => (
              <li 
                key={todo.id} 
                data-todo-id={todo.id}
                className={`list-group-item d-flex justify-content-between align-items-center ${
                  darkMode ? 'dark-mode-item' : ''
                }`}
              >
                <div className="d-flex align-items-center flex-grow-1">
                  <input
                    className="form-check-input me-2"
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleComplete(todo.id)}
                  />
                  {editingId === todo.id ? (
                    <input
                      type="text"
                      className={`form-control ${darkMode ? 'dark-mode-input' : ''}`}
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveEdit(todo.id);
                        if (e.key === 'Escape') cancelEdit();
                      }}
                      autoFocus
                    />
                  ) : (
                    <span style={{ 
                      textDecoration: todo.completed ? 'line-through' : 'none',
                      color: todo.completed ? '#6c757d' : 'inherit'
                    }}>
                      {todo.text}
                    </span>
                  )}
                </div>
                <div className="d-flex gap-2">
                  {editingId === todo.id ? (
                    <>
                      <button 
                        className="btn btn-success btn-sm"
                        onClick={() => saveEdit(todo.id)}
                      >
                        Save
                      </button>
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={cancelEdit}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        className="btn btn-primary btn-sm"
                        onClick={() => startEdit(todo)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={() => deleteTodo(todo.id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
        
        {todos.length > 0 && (
          <div className={`mt-3 ${darkMode ? 'text-light' : 'text-muted'}`}>
            Total tasks: {todos.length} | Completed: {todos.filter(t => t.completed).length}
          </div>
        )}
      </div>
    </>
  )
}

export default TodoList