const todoApp = document.querySelector(".todo-app");
const headerImg = document.querySelectorAll("header img");
const input = document.querySelector(".input-field input");
const todoListUl = document.querySelector(".todo-list ul");
const controls = document.querySelector(".controls");
const filterBtns = document.querySelectorAll(".controls .filters li");
const leftItemsNumberCount = document.querySelector(".left-items .number");
const clearCompleted = document.querySelector(".controls .clear-completed");


if (localStorage.length !== 0) {
  
  let numberOfSavedTodos = 0;
  let arrKeys = [];
  for (let [key, val] of Object.entries(localStorage)) {
    if (key.startsWith("todo-")) {
      numberOfSavedTodos += 1;
      arrKeys.push(key);
    }
  }


  if (numberOfSavedTodos > 0) {
    
    for (let i = 1; i <= arrKeys.length; i++) {
      let data = JSON.parse(localStorage.getItem(`todo-${i}`));

      
      addTodo(data.text, data.class);
    }
  }
}

if (localStorage.getItem("data-theme")) { 
  

  if (todoApp.classList.item(1) !== localStorage.getItem("data-theme")) { 
    let savedTheme = localStorage.getItem("data-theme");

    
    applyTheme(savedTheme);
  }
}

headerImg.forEach(img => {
  img.onclick = function () {
    localStorage.setItem("data-theme", this.dataset.theme); // Save clicked data-theme in Local Storage


    applyTheme(this.dataset.theme);
  };
});

input.onfocus = function () {
  this.placeholder = ""; 
  this.parentElement.classList.add("focused"); 
};
input.onblur = function () {
  if (this.value.trim() !== "") { 
    addTodo(this.value);
    
    updateLocalStorage();
  }
  this.value = ""; 
  this.placeholder = this.dataset.placeholder;
  this.parentElement.classList.remove("focused"); 
};

todoListUl.addEventListener("click", function (e) {
  if (e.target.className === "icon" || e.target.tagName === "P") {
    e.target.parentElement.classList.toggle("active");
    e.target.parentElement.classList.toggle("completed");
    
    updateLeftItemsNumber();
    
    updateFilter();

    updateLocalStorage();
  }
  if (e.target.className === "delete") {
    e.target.parentElement.remove();

    localStorage.removeItem(`${e.target.parentElement.id}`);

    updateLeftItemsNumber();
    updateFilter();
    numberingTodos();
    updateLocalStorage();
  }
});

filterBtns.forEach(btn => {
  btn.onclick = function () {
    
    filterBtns.forEach(btn => {
      btn.classList.remove("selected");
    });
    
    this.classList.add("selected");
    makeFilter(this.dataset.filter);
  };
});

clearCompleted.onclick = function () {
  document.querySelectorAll(".todo-list .todo").forEach(todo => {
    if (todo.classList.contains("completed")) {
      todo.remove();
      localStorage.removeItem(`${todo.id}`);

      
      numberingTodos();
      updateLocalStorage();
    }
  });
};

function applyTheme(newTheme) {
  let lastTheme = todoApp.classList.item(1);
  todoApp.classList.remove(lastTheme); 
  todoApp.classList.add(newTheme); 
  document.querySelector(`[data-theme="${newTheme}"]`).classList.remove("available"); // Remove Class "available" from the img of new theme
  document.querySelector(`[data-theme="${lastTheme}"]`).classList.add("available"); // Add Class "available" to the img of last theme
}

function addTodo(textParam, classParam) {
  const li = document.createElement("li"); 
  li.id = `todo-${document.querySelectorAll(".todo").length + 1}`;
  li.className = classParam || "todo active"; 
  
  li.innerHTML = `
    <span class="icon"><img class="check" src="images/icon-check.svg" alt="icon-check"></span>
    <p>${textParam}</p>
    <img class="delete" src="images/icon-cross.svg" alt="icon-cross">
  `;

  
  li.setAttribute("draggable", true);
  li.lastElementChild.setAttribute("draggable", false); 
  
  li.ondragstart = dragStart;
  
  li.ondragover = dragOver;

  li.ondrop = drop;
  
  todoListUl.appendChild(li);
  updateLeftItemsNumber();
  numberingTodos();
}


function updateLeftItemsNumber() {
  leftItemsNumberCount.innerHTML = document.querySelectorAll(".todo.active").length; // Get Number of li.todo has Class "active"
}

updateLeftItemsNumber();


function makeFilter(filtered) {
  document.querySelectorAll(".todo-list .todo").forEach(todo => {
    if (!todo.classList.contains(filtered)) {
      todo.classList.add("hidden"); 
    } else {
      todo.classList.remove("hidden"); 
    }
  });
}

function updateFilter() {
  for (btn of filterBtns) {
    if(btn.classList.contains("selected")) { 
      makeFilter(btn.dataset.filter); 
    }
  }
}

function dragStart(e) {
  e.dataTransfer.setData("number", e.target.dataset.number); 
  e.dataTransfer.setData("text", e.target.id); 
  e.dataTransfer.effectAllowed = "move"; 
}
function dragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move"; 
}
function drop(e) {
  e.preventDefault();
  const number = e.dataTransfer.getData("number");
  const data = e.dataTransfer.getData("text");
  if (number > e.currentTarget.dataset.number) { 
    e.currentTarget.before(document.getElementById(data)); 
  } else {
    e.currentTarget.after(document.getElementById(data)); 
  }
  
  numberingTodos();

  updateLocalStorage();
}

function numberingTodos() {
  document.querySelectorAll(".todo-list .todo").forEach((todo, i) => {
    todo.setAttribute("data-number", i + 1);
    todo.id = `todo-${i + 1}`;
  });
}
numberingTodos();

function updateLocalStorage() {
  
  for (let [key, val] of Object.entries(localStorage)) {
    if (key.startsWith("todo-")) {
      localStorage.removeItem(key);
    }
  }

  document.querySelectorAll(".todo-list .todo").forEach(todo => {
    let data = {
      "class": todo.className,
      "text": todo.textContent.trim()
    }
    localStorage.setItem(todo.id, JSON.stringify(data));
  });
}
