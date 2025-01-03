import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Import the CSS file

function App() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState('');

  // Fetch todos on initial render
  useEffect(() => {
    axios.get('http://localhost:5000/api/todos')
      .then((response) => setTodos(response.data))
      .catch((err) => console.log(err));
  }, []);

  // Add a new todo
  const addTodo = () => {
    if (task) {
      axios.post('http://localhost:5000/api/todos', { task })
        .then((response) => {
          setTodos([...todos, response.data]);
          setTask('');
        })
        .catch((err) => console.log(err));
    }
  };

  // Toggle the completion status of a todo
  const toggleComplete = (id, completed) => {
    axios.put(`http://localhost:5000/api/todos/${id}`, { completed: !completed })
      .then((response) => {
        setTodos(todos.map(todo => todo._id === id ? response.data : todo));
      })
      .catch((err) => console.log(err));
  };

  // Delete a todo
  const deleteTodo = (id) => {
    axios.delete(`http://localhost:5000/api/todos/${id}`)
      .then(() => {
        setTodos(todos.filter(todo => todo._id !== id));
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="todo-container">
      <h1>Todo List</h1>
      <div className="input-container">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Enter a task"
        />
        <button onClick={addTodo} disabled={!task}>Add Todo</button>
      </div>
      <ul>
        {todos.map((todo) => (
          <li key={todo._id} className={todo.completed ? 'completed' : ''}>
            <span onClick={() => toggleComplete(todo._id, todo.completed)}>
              {todo.task}
            </span>
            <button className="delete-btn" onClick={() => deleteTodo(todo._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
