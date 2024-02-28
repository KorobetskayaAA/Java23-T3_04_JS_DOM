function Todo(text, created, done) {
  this.text = text;
  this.created = created || new Date();
  this.done = !!done;
}

const todos = {
  data: [
    new Todo(
      "Подготовить лекцию по Java Script",
      new Date(2024, 1, 18, 14),
      true
    ),
    new Todo("Починить ноутбук", new Date(2024, 1, 13, 16, 26), true),
    new Todo("Подготовить лекцию по Spring Framework", new Date(), false),
  ],

  setData(newTodos) {
    if (
      newTodos !== this.todos &&
      (newTodos.length != this.data.length ||
        !newTodos.every((todo, i) => this.data[i] === todo)) // поэлементное сравнение
    ) {
      this.data = newTodos;
      console.debug(this.data);
    }
  },

  add(todo) {
    this.data.push(todo);
    console.debug(this.data);
  },

  remove(todo) {
    this.setData(this.data.filter((td) => td !== todo));
  },

  swap(todo1, todo2) {
    const indexofTodo1 = getIndexOf(todo1);
    if (indexofTodo1 < 0 || indexofTodo1 >= this.data.length) return;

    const indexofTodo2 = getIndexOf(todo2);
    if (indexofTodo2 < 0 || indexofTodo2 >= this.data.length) return;

    todo1 = this.data[indexofTodo1];
    todo2 = this.data[indexofTodo2];
    this.data[indexofTodo1] = todo2;
    this.data[indexofTodo2] = todo1;
    console.debug(this.data);

    function getIndexOf(todo) {
      if (typeof todo == "number") return todo;
      if (todo instanceof Todo) return this.data.indexOf(todo);
    }
  },

  moveUp(todo) {
    const indexofTodo = this.data.indexOf(todo);
    this.swap(indexofTodo, indexofTodo - 1);
  },

  moveDown(todo) {
    const indexofTodo = this.data.indexOf(todo);
    this.swap(indexofTodo, indexofTodo + 1);
  },

  moveTo(movingTodo, toIndex) {
    const fromIndex = this.data.indexOf(movingTodo);
    if (fromIndex == toIndex) return;
    if (toIndex > fromIndex) {
      toIndex--;
    }
    const dataRemovedTodo = this.data.filter((todo) => todo !== movingTodo);
    if (toIndex == 0) {
      this.setData([movingTodo, ...dataRemovedTodo]);
      return;
    }
    if (toIndex == dataRemovedTodo.length) {
      this.setData([...dataRemovedTodo, movingTodo]);
      return;
    }
    this.setData([
      ...dataRemovedTodo.slice(0, toIndex),
      movingTodo,
      ...dataRemovedTodo.slice(toIndex),
    ]);
  },

  moveBefore(movingTodo, beforeTodo) {
    const toIndex = this.data.indexOf(beforeTodo);
    this.moveTo(movingTodo, toIndex);
  },

  moveAfter(movingTodo, afterTodo) {
    const toIndex = this.data.indexOf(afterTodo) + 1;
    this.moveTo(movingTodo, toIndex);
  },
};

window.addEventListener("load", () => {
  let todoAddForm = document.getElementById("todoList-form");
  todoAddForm.addEventListener("submit", (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    const form = ev.target;
    const newItem = new Todo(form.elements.text.value);
    todos.add(newItem);
    let todoList = document.getElementById("todoList");
    withDisablingUpDownButtons(todoList, () =>
      todoList.append(createTodoListItem(newItem))
    );
    form.reset();
  });

  let todoListContainer = document.getElementById("todoList-container");
  todoListContainer.replaceChildren(createTodoList());

  function createTodoList() {
    let todoList = document.createElement("ol");
    todoList.id = "todoList";
    todoList.classList.add("list-group");
    todoList.classList.add("list-group-numbered");

    fillTodoListItems(todoList);

    return todoList;
  }

  function fillTodoListItems(todoList) {
    if (!todoList) todoList = document.getElementById("todoList");
    for (let todo of todos.data) {
      todoList.append(createTodoListItem(todo));
    }
    if (todoList.children.length > 0) {
      todoList.firstChild.querySelector(".todo-button-up").disabled = true;
      todoList.lastChild.querySelector(".todo-button-down").disabled = true;
    }
  }

  function createTodoListItem(todo) {
    let todoListItem = document.createElement("li");
    todoListItem.classList.add("todo");
    todoListItem.classList.add("list-group-item");

    todoListItem.append(createTodoListItemDone());
    todoListItem.append(createTodoListItemText());
    todoListItem.append(createTodoListItemsControls(todoListItem));
    todoListItem.append(createTodoListItemDate());

    todoListItem.todo = todo;

    makeListItemDraggable();

    return todoListItem;

    function createTodoListItemDate() {
      let todoDate = document.createElement("small");
      todoDate.classList.add("todo-created");
      todoDate.innerText = "Создано: " + todo.created.toLocaleString();
      return todoDate;
    }

    function createTodoListItemsControls(todoListItem) {
      let todoControls = document.createElement("div");
      todoControls.classList.add("todo-controls");
      todoControls.append(
        createIconButton("todo-button-up", "caret-up", "secondary", () =>
          moveupTodoListItem(todo, todoListItem)
        )
      );
      todoControls.append(
        createIconButton("todo-button-down", "caret-down", "secondary", () =>
          movedownTodoListItem(todo, todoListItem)
        )
      );
      todoControls.append(
        createIconButton("todo-button-remove", "trash-fill", "danger", () =>
          removeTodoListItem(todo, todoListItem)
        )
      );
      return todoControls;
    }

    function createTodoListItemDone() {
      let todoCheckbox = document.createElement("input");
      todoCheckbox.classList.add("todo-done");
      todoCheckbox.type = "checkbox";
      todoCheckbox.checked = todo.done;
      todoCheckbox.addEventListener(
        "change",
        (ev) => (todo.done = ev.target.checked)
      );
      return todoCheckbox;
    }

    function createTodoListItemText() {
      let todoText = document.createElement("p");
      todoText.classList.add("todo-text");
      todoText.innerText = todo.text;
      return todoText;
    }

    function createIconButton(className, iconName, color, onClick) {
      let button = document.createElement("button");
      button.classList.add(className);
      button.classList.add("btn");
      button.classList.add("btn-outline-" + color);
      button.classList.add("btn-sm");
      button.classList.add("bi");
      button.classList.add("bi-" + iconName);
      button.addEventListener("click", onClick);
      return button;
    }

    function makeListItemDraggable() {
      todoListItem.draggable = true;

      todoListItem.addEventListener("dragstart", (evt) => {
        evt.target.classList.add("dragging");
      });
      todoListItem.addEventListener("dragend", (evt) => {
        evt.target.classList.remove("dragging");
      });
      todoListItem.addEventListener("dragover", (evt) => {
        evt.preventDefault();
        const draggingElement = todoList.querySelector(".dragging");
        const dragTarget = evt.target;
        // нельзя бросить на себя и можно перетаскивать только задачи
        if (
          draggingElement === dragTarget ||
          !dragTarget.classList.contains("todo")
        ) {
          return;
        }
        const dragTargetRect = dragTarget.getBoundingClientRect();
        const dragTargetMiddle =
          (dragTargetRect.top + dragTargetRect.bottom) / 2;
        if (evt.clientY > dragTargetMiddle) {
          withDisablingUpDownButtons(todoList, () =>
            dragTarget.after(draggingElement)
          );
          todos.moveAfter(draggingElement.todo, dragTarget.todo);
        } else {
          withDisablingUpDownButtons(todoList, () =>
            dragTarget.before(draggingElement)
          );

          todos.moveBefore(draggingElement.todo, dragTarget.todo);
        }
      });
    }
  }

  function removeTodoListItem(todo, todoListItem) {
    todos.remove(todo);
    withDisablingUpDownButtons(todoListItem.parentNode, () =>
      todoListItem.remove()
    );
  }

  function moveupTodoListItem(todo, todoListItem) {
    todos.moveUp(todo);
    withDisablingUpDownButtons(todoListItem.parentNode, () =>
      todoListItem.previousSibling.before(todoListItem)
    );
  }

  function movedownTodoListItem(todo, todoListItem) {
    todos.moveDown(todo);
    withDisablingUpDownButtons(todoListItem.parentNode, () =>
      todoListItem.nextSibling.after(todoListItem)
    );
  }

  function withDisablingUpDownButtons(todoList, callback) {
    if (todoList.firstChild) {
      todoList.firstChild.querySelector(".todo-button-up").disabled = false;
      todoList.lastChild.querySelector(".todo-button-down").disabled = false;
    }

    callback();

    if (todoList.firstChild) {
      todoList.firstChild.querySelector(".todo-button-up").disabled = true;
      todoList.lastChild.querySelector(".todo-button-down").disabled = true;
    }
  }
});
