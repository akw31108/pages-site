import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { useState, useEffect } from 'react';
import './index.css';
import { openDB, deleteDB } from 'idb';

async function upgradeToV1(db) {
  await db.createObjectStore("todos", { 
    keyPath: "id",
  autoIncrement: true,
  });
}
async function getDbPromise() {
  // await deleteDB("to-do-app-db");
  return await openDB("to-do-app-db", 1, {upgrade: upgradeToV1});
}
const DB_PROM = getDbPromise();
const db = {
  async add(todo) {
    const db = await DB_PROM;
    const tx = db.transaction("todos", "readwrite");
    const store = tx.objectStore("todos");
    store.add(todo);
    await tx.done;
  },
  async getAll() {
    const db = await DB_PROM;
    const tx = db.transaction("todos", "readonly");
    const store = tx.objectStore("todos");
    return store.getAll();
  },
  async remove(id) {  
    const db = await DB_PROM;
    const tx = db.transaction("todos", "readwrite");
    const store = tx.objectStore("todos");
    store.delete(id);
    await tx.done;
  },
  async update(todo) {
    const db = await DB_PROM;
    const tx = db.transaction("todos", "readwrite");
    const store = tx.objectStore("todos");
    store.put(todo);
    await tx.done;
  },
  async clear() {
    const db = await DB_PROM;
    const tx = db.transaction("todos", "readwrite");
    const store = tx.objectStore("todos");
    store.clear();
    await tx.done;
  }
}



function App() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    db.getAll().then(setTodos);
  }
  , []);
  function handleSubmit(e) {
    e.preventDefault();
    const newTodo = {
      id: Date.now(),
      text: new FormData(e.target).get("todo-text"),
    };
    db.add(newTodo).then(db.getAll).then(setTodos);
  }
  const todoremover = (todo) => () =>  {
    const setter = (todo) => (prevTodos) => 
      prevTodos.filter((prevTodo) => prevTodo.id !== todo.id);
    setTodos(setter(todo));
    db.remove(todo.id).then(db.getAll).then(setTodos);
  };
  const todoUpdater = (todo) => () => {
    db.update(todo).then(db.getAll).then(setTodos);
  };
  const clearTodos = () => db.clear().then(db.getAll).then(setTodos); 
  return (
    <main>
      <h1>To Do App</h1>
      <SingleTextInputForm
      onSubmit={handleSubmit}
      inputName="todo-text"
      buttonText="Add"
      />
      <button onClick={clearTodos}>Clear All To Do Items</button>

      <h2>To Do List</h2>
      <ul>
        {todos.map((todo) => (
          <ToDoListItem key={todo.id} {...{ todo, todoremover, todoUpdater }} />
        ))}
      </ul>
    </main>
  );
}

function ToDoListItem({ todo, todoremover, todoUpdater }) {
  const { id, text } = todo;
  const [editing, setEditing] = useState(false);
  const inputName = "updater-todo-text";
  const buttonText = "Update";
  const placeholder = text;
  const defaultValue = text;
  function onSubmit(e) {
    e.preventDefault();
    const text = new FormData(e.target).get(inputName);
    const newTodo = { id, text: newText };
      todoUpdater(newTodo)(); 
      setEditing(false);
  }
  if (editing) {
    return <SingleTextInputForm {...( onSubmit, inputName, buttonText, placeholder )} />;
  }
  return (
    <li>
      <span>{text}</span>
        <button onClick={todoremover({ id, text })}>Delete</button>
        <button onClick={() => setEditing(true)}>Edit</button>
    </li>
  );
}

function SingleTextInputForm({ 
  onSubmit,
  inputName,
  buttonText,
  placeholder = "",
  defaultValue = "",
}) {
  return(
    <form {...{ onSubmit }}>
      <input type="text" name={inputName} {...{placeholder, defaultValue}}
      required
      autoComplete="off"
      pattern="^\S+$"
      />
      <button type="submit">{buttonText}</button>
    </form>
  );
}

createRoot(document.querySelector("body")).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
