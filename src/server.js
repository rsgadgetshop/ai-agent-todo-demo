const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// In-memory todo store (simple for demo)
let todos = [
  { id: 1, text: 'Buy groceries',           done: true  },
  { id: 2, text: 'Prepare demo for seniors', done: false },
  { id: 3, text: 'Review pull requests',     done: false }
];
let nextId = 4;

// GET all todos
app.get('/todos', (req, res) => {
  res.json(todos);
});

// POST add todo
app.post('/todos', (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'text is required' });
  const todo = { id: nextId++, text, done: false };
  todos.push(todo);
  res.status(201).json(todo);
});

// PATCH toggle done
app.patch('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find(t => t.id === id);
  if (!todo) return res.status(404).json({ error: 'todo not found' });
  todo.done = req.body.done;
  res.json(todo);
});

// DELETE todo
app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todoIndex = todos.findIndex(t => t.id === id);
  if (todoIndex === -1) return res.status(404).json({ error: 'todo not found' });
  todos.splice(todoIndex, 1);
  res.status(204).send();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Todo app running at http://localhost:${PORT}`);
});

module.exports = app;