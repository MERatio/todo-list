import PubSub from 'pubsub-js';
import {
  parseISO,
  isToday,
  isTomorrow,
  isYesterday,
  isPast,
  isThisWeek,
  format,
} from 'date-fns';

function renderTodos(todos) {
  const todoListEl = document.querySelector('.jsTodoList');
  todoListEl.replaceChildren();

  function createTodo(todo) {
    function getDueDateEl(dateStr) {
      const dueDateEl = document.createElement('p');
      const date = parseISO(dateStr);

      if (isToday(date)) {
        dueDateEl.classList.add('red');
        dueDateEl.textContent = 'Today';
      } else if (isTomorrow(date)) {
        dueDateEl.classList.add('orange');
        dueDateEl.textContent = 'Tomorrow';
      } else if (isYesterday(date)) {
        dueDateEl.classList.add('red');
        dueDateEl.textContent = 'Yesterday';
      } else if (isPast(date)) {
        dueDateEl.classList.add('red');
        dueDateEl.textContent = 'Overdue';
      } else if (isThisWeek(date)) {
        dueDateEl.textContent = format(date, 'EEEE'); // e.g., "Thursday"
      } else {
        dueDateEl.textContent = format(date, 'MMM d'); // e.g., "Oct 15"
      }

      return dueDateEl;
    }

    function getCircleSvgClass(priority) {
      switch (priority) {
        case 'urgent':
          return 'fill-red';
        case 'high':
          return 'fill-orange';
        case 'medium':
          return 'fill-blue';
        default:
          return '';
      }
    }

    function handleCompleteTodoBtnClick(e) {
      const todoEl = e.currentTarget.closest('li[data-todo-id]');
      const todoId = todoEl.dataset.todoId;
      PubSub.publish('todo:delete', { todoId });
    }

    const todoEl = document.createElement('li');
    todoEl.classList.add('todo');
    todoEl.dataset.todoId = todo.id;

    const completeBtn = document.createElement('button');
    completeBtn.setAttribute('type', 'button');
    completeBtn.classList.add('jsTodoCompleteBtn', 'todo-complete-btn');
    completeBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" class=${getCircleSvgClass(
        todo.priority
      )}>
        <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
      </svg>`;
    completeBtn.addEventListener('click', handleCompleteTodoBtnClick);
    todoEl.appendChild(completeBtn);

    const textsEl = document.createElement('div');
    textsEl.classList.add('todo-texts');
    textsEl.setAttribute('tabindex', '0');
    todoEl.appendChild(textsEl);

    const titleEl = document.createElement('p');
    titleEl.classList.add('todo-title');
    titleEl.textContent = todo.title;
    textsEl.appendChild(titleEl);

    const dueDateEl = getDueDateEl(todo.dueDate);
    textsEl.appendChild(dueDateEl);

    return todoEl;
  }

  for (const todo of todos) {
    const todoEl = createTodo(todo);
    todoListEl.appendChild(todoEl);
  }
}

function attachTodosEventListeners() {
  const todoProjectIdInput = document.querySelector('#todo-project-id');
  const showTodoFormModalBtn = document.querySelector(
    '.jsShowTodoFormModalBtn'
  );
  const todoForm = document.querySelector('.jsTodoForm');

  function handleShowTodoFormModalBtnClick() {
    const activeProjectEl = document.querySelector('[data-project-id].active');
    const activeProjectId = activeProjectEl.dataset.projectId;
    const today = new Date().toISOString().split('T')[0];
    const todoDueDateInput = document.querySelector('#todo-due-date');

    todoProjectIdInput.value = activeProjectId;
    // Set todo due date input's min and value to today
    todoDueDateInput.setAttribute('min', today);
    todoDueDateInput.value = today;
  }

  function handleTodoFormSubmit(e) {
    const form = e.currentTarget;
    const operation = form.dataset.operation;
    const projectId = todoProjectIdInput.value;
    const title = form.querySelector('#todo-title').value;
    const description = form.querySelector('#todo-description').value;
    const dueDate = form.querySelector('#todo-due-date').value;
    const priority = form.querySelector('#todo-priority').value;

    switch (operation) {
      case 'create':
        PubSub.publish('todo:create', {
          form,
          projectId,
          title,
          description,
          dueDate,
          priority,
        });
        break;
    }
  }

  showTodoFormModalBtn.addEventListener(
    'click',
    handleShowTodoFormModalBtnClick
  );
  todoForm.addEventListener('submit', handleTodoFormSubmit);
}

export { renderTodos, attachTodosEventListeners };
