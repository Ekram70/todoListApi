const url = "http://localhost:3000/task";
let todoItems = [];
let editMode = false;
let editableTodo = null;

const todoList = document.getElementById("todo-list");
const completedList = document.getElementById("completed-list");
const todoInput = document.getElementById("todo-input");
const btn = document.getElementById("btn");

function getTodoItem() {
  fetch(url)
    .then((res) => res.json())
    .then((tasks) => {
      todoItems = tasks;
      showTask();
    })
    .catch(() => console.log("no tasks found"));
}

getTodoItem();

btn.addEventListener("click", () => {
  const text = todoInput.value.trim();

  if (!editMode) {
    if (text) {
      addTask(text);
    } else {
      alert("Please enter valid text");
    }
  } else {
    if (text != editableTodo.text) {
      if (text) {
        updateTask(editableTodo.id, text);
        btn.innerText = "Add";
        editMode = false;
      } else {
        alert("Please enter valid text");
      }
    } else {
      alert("Please enter different text");
    }
  }

  todoInput.value = "";
});

function addTask(text) {
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: text.trim(),
      isCompleted: false,
      time: new Date().valueOf(),
      id: new Date().valueOf(),
    }),
  }).then(() => getTodoItem());
}

function updateTask(id, text) {
  fetch(`${url}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: text,
      isCompleted: false,
    }),
  }).then(() => getTodoItem());
}

function completedTask(id, text) {
  fetch(`${url}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: text,
      isCompleted: true,
      time: new Date().valueOf(),
    }),
  }).then(() => getTodoItem());
}

function notCompletedTask(id, text) {
  fetch(`${url}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: text,
      isCompleted: false,
      time: new Date().valueOf(),
    }),
  }).then(() => getTodoItem());
}

function removeTask(id) {
  fetch(`${url}/${id}`, {
    method: "DELETE",
  }).then(() => getTodoItem());
}

function showTask() {
  todoList.innerHTML = "";
  completedList.innerHTML = "";

  const sortedTodo = todoItems.sort((a, b) => a.time - b.time);

  sortedTodo.forEach((task) => {
    const li = document.createElement("li");
    li.setAttribute("class", "item");

    const spanOne = document.createElement("span");
    spanOne.classList.add("text");
    spanOne.innerText = task.text;

    const spanTwo = document.createElement("span");
    const spanThree = document.createElement("span");

    if (!task.isCompleted) {
      spanTwo.classList.add("edit");
      spanTwo.innerHTML = `<i class="fa-solid fa-pencil"></i>`;

      spanTwo.addEventListener("click", () => {
        if (editMode) {
          todoInput.value = "";
          spanTwo.innerHTML = `<i class="fa-solid fa-pencil"></i>`;
          btn.innerText = "Add";
          editMode = false;
        } else {
          todoInput.value = task.text;
          spanTwo.innerHTML = `<i class="fa-solid fa-ban"></i>`;
          btn.innerText = "Update";
          editableTodo = task;
          editMode = true;
        }
      });

      spanThree.classList.add("complete");
      spanThree.innerHTML = `<i class="fa-solid fa-check"></i>`;

      spanThree.addEventListener("click", () => {
        completedTask(task.id, task.text);
      });
    } else {
      spanTwo.classList.add("undo");
      spanTwo.innerHTML = `<i class="fa-solid fa-hand-point-up"></i>`;

      spanTwo.addEventListener("click", () => {
        notCompletedTask(task.id, task.text);
      });

      spanThree.classList.add("delete");
      spanThree.innerHTML = `<i class="fa-solid fa-trash"></i>`;

      spanThree.addEventListener("click", () => {
        removeTask(task.id);
      });
    }

    li.appendChild(spanOne);
    li.appendChild(spanTwo);
    li.appendChild(spanThree);

    if (!task.isCompleted) {
      todoList.appendChild(li);
    } else {
      completedList.appendChild(li);
    }
  });
}
