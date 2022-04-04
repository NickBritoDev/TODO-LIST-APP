const taskIpunt = document.querySelector(".task-input input"),
filters = document.querySelectorAll(".filters span"),
clearAll = document.querySelector(".clear-btn"),
taskBox = document.querySelector(".task-box");

let editId;
let isEditedTask = false;
// getting localstorage todo-list
let todos = JSON.parse(localStorage.getItem("todo-list"));

filters.forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector("span.active").classList.remove("active");
    btn.classList.add("active");
    showTodo(btn.id);
  });
});

function showTodo(filter){
  let li = "";
  if(todos) {
    todos.forEach((todo, id) => {
      // if todo status is completed, set the isCompleted value to checked
      let isCompleted = todo.status == "completed" ? "checked" : ""; 
      if (filter  == todo.status || filter == "all"){
        li +=`<li class="task">
               <label for="${id}">
                 <input onclick="uptadeStatus(this)" type="checkbox" id="${id}" ${isCompleted}>
                 <p class="${isCompleted}" >${todo.name}</p>
               </label>
               <div class="settings">
                 <ion-icon onclick="showMenu(this)" name="ellipsis-horizontal-sharp"></ion-icon>
                 <ul class="task-menu">
                   <li onclick="editTask(${id}, '${todo.name}')"><ion-icon name="pencil-outline"></ion-icon>Edit</li>
                   <li onclick="deleteTask(${id})"><ion-icon name="trash-outline"></ion-icon>Deleted</li>
                 </ul>
               </div>
             </li>`;
      }
    });
  }
  taskBox.innerHTML = li || `<span>You don't have any task here</span>`;
}
showTodo("all");

function showMenu(selectedTask){
  let taskMenu = selectedTask.parentElement.lastElementChild;
  taskMenu.classList.add("show");
  document.addEventListener("click", e => {
    //removing show class from the task menu on the document click
    if(e.target.tagName != "ION-ICON" || e.target != selectedTask){
      taskMenu.classList.remove("show");
    }
  });
}

function editTask(taskId, taskName){
  editId = taskId;
  isEditedTask = true;
  taskIpunt.value = taskName;
}

function deleteTask(deleteId){
  // removing selected task from array/todos
  todos.splice(deleteId, 1);
  localStorage.setItem("todo-list", JSON.stringify(todos));
  showTodo();
}

clearAll.addEventListener("click", () =>{
  // removing all items od array/todos
  todos.splice(0, todos.length);
  localStorage.setItem("todo-list", JSON.stringify(todos));
  showTodo("all");
});

function uptadeStatus(selectedTask){
  // getting paragraph that contains task name
  let taskName = selectedTask.parentElement.lastElementChild;
  if(selectedTask.checked) {
    taskName.classList.add("checked");
    //uptading the status of selected task to completed
    todos[selectedTask.id].status = "completed";
  }else{
    taskName.classList.remove("checked");
        //uptading the status of selected task to pending
    todos[selectedTask.id].status = "pending";
  }
  localStorage.setItem("todo-list", JSON.stringify(todos));
}

taskIpunt.addEventListener("keyup", e => {
  let userTask = taskIpunt.value.trim();
  if(e.key == "Enter" && userTask){
    if (!isEditedTask){// if isEditedTask isn't true
      if(!todos){ //if todos isn't exist, pass an empyt array to todos
        todos = [];
      }
      let taskInfo = {name: userTask, status: "pending"};
      todos.push(taskInfo); //adding new task to todos
    }else{
      isEditedTask = false;
      todos[editId].name = userTask;
    }
    taskIpunt.value ="";
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo("all");
  }
});