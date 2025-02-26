// Get DOM elements
const addTaskBtn = document.getElementById('add-task-btn');
const newTaskInput = document.getElementById('new-task-input');
const taskList = document.getElementById('task-list');
const clearAllBtn = document.getElementById('clear-all-btn');

// Add a new task to the list
addTaskBtn.addEventListener('click', () => {
  const taskText = newTaskInput.value.trim();
  
  // Prevent adding empty or whitespace-only tasks
  if (taskText === '') {
    alert('Task cannot be empty or whitespace only');
    return;
  }
  
  const taskItem = createTaskItem(taskText);
  taskList.appendChild(taskItem);
  newTaskInput.value = ''; // Clear the input field
});

// Create a task item with editing and deleting functionality
function createTaskItem(text) {
  const li = document.createElement('li');
  
  const taskText = document.createElement('span');
  taskText.textContent = text;
  li.appendChild(taskText);

  // Edit button
  const editBtn = document.createElement('button');
  editBtn.textContent = 'Edit';
  editBtn.addEventListener('click', () => {
    const newText = prompt('Edit your task:', taskText.textContent).trim();
    
    // Prevent empty or whitespace-only updates
    if (newText === '') {
      alert('Task cannot be empty or whitespace only');
      return;
    }
    
    taskText.textContent = newText;
  });
  li.appendChild(editBtn);

  // Delete button
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.addEventListener('click', () => {
    taskList.removeChild(li);
  });
  li.appendChild(deleteBtn);

  return li;
}

// Clear all tasks
clearAllBtn.addEventListener('click', () => {
  taskList.innerHTML = ''; // Clear the entire list
});
