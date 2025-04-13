let tasks = [];
let filter = "all";

document.addEventListener("DOMContentLoaded", () => {
  loadTasks();
  renderTasks();

  document.getElementById("themeToggle").addEventListener("change", toggleTheme);
  document.querySelectorAll(".filter-btn").forEach(btn =>
    btn.addEventListener("click", (e) => {
      filter = e.target.dataset.filter;
      document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      e.target.classList.add("active");
      renderTasks();
      document.querySelector(".filter-btn[data-filter='all']").classList.add("active");
    })
  );
  

  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    document.getElementById("themeToggle").checked = true;
  }
});

function addTask() {
  const input = document.getElementById("taskInput");
  const text = input.value.trim();
  if (text === "") return;

  const task = { id: Date.now(), text, completed: false };
  tasks.push(task);
  saveTasks();
  renderTasks();

  input.value = "";
}

function renderTasks() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  let filteredTasks = tasks;
  if (filter === "active") {
    filteredTasks = tasks.filter(t => !t.completed);
  } else if (filter === "completed") {
    filteredTasks = tasks.filter(t => t.completed);
  }

  filteredTasks.forEach(task => {
    const li = document.createElement("li");
    li.setAttribute("data-id", task.id);

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.onchange = () => toggleComplete(task.id);

    const span = document.createElement("span");
    span.textContent = task.text;
    if (task.completed) {
      span.style.textDecoration = "line-through";
      span.style.opacity = "0.6";
    }

    const delBtn = document.createElement("button");
    delBtn.textContent = "Удалить";
    delBtn.onclick = () => deleteTask(task.id);

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(delBtn);

    list.appendChild(li);
    updateCounter();
  });
}
function updateCounter() {
    const total = tasks.length;
    const active = tasks.filter(t => !t.completed).length;
    const completed = total - active;
  
    const counter = document.getElementById("taskCounter");
    counter.textContent = `Всего: ${total} | Активные: ${active} | Завершённые: ${completed}`;
  }  
function toggleComplete(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.completed = !task.completed;
    saveTasks();
    renderTasks();
  }
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const stored = localStorage.getItem("tasks");
  if (stored) {
    tasks = JSON.parse(stored);
  }
}

function toggleTheme(e) {
  if (e.target.checked) {
    document.body.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.body.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
}
