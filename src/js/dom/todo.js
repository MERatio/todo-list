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
import { handleShowModalBtnClick } from './shared.js';

const todoFormModalHeading = document.querySelector('.jsTodoFormModalHeading');
const todoForm = document.querySelector('.jsTodoForm');
const todoIdInput = document.querySelector('#todo-id');
const todoProjectIdInput = todoForm.querySelector('#todo-project-id');
const todoTitleInput = todoForm.querySelector('#todo-title');
const todoDescriptionInput = todoForm.querySelector('#todo-description');
const todoDueDateInput = todoForm.querySelector('#todo-due-date');
const todoPriorityInput = todoForm.querySelector('#todo-priority');
const todoFormSubmitBtn = todoForm.querySelector('.jsTodoFormSubmitBtn');

function renderTodos(todos) {
  const todoListEl = document.querySelector('.jsTodoList');
  todoListEl.replaceChildren();

  function createTodo(todo) {
    function handleTodoClick(e) {
      const todoModal = document.querySelector('.jsTodoModal');
      const todoInfoTitleEl = todoModal.querySelector('.jsTodoInfoTitle');
      const todoInfoDescriptionEl = todoModal.querySelector(
        '.jsTodoInfoDescription'
      );
      const todoInfoDueDateEl = todoModal.querySelector('.jsTodoInfoDueDate');
      const todoInfoPriorityEl = todoModal.querySelector('.jsTodoInfoPriority');
      todoInfoTitleEl.textContent = todo.title;
      todoInfoDescriptionEl.textContent = todo.description;
      todoInfoDueDateEl.textContent = todo.dueDate;
      todoInfoPriorityEl.textContent = todo.priority;
      todoModal.showModal();
    }

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
          return 'fill-black';
      }
    }

    function handleCompleteTodoBtnClick(e) {
      e.stopPropagation();
      PubSub.publish('todo:delete', { todo });
    }

    function handleTodoEditBtnClick() {
      todoFormModalHeading.textContent = 'Edit Todo';
      todoForm.dataset.submitOperation = 'update';
      todoFormSubmitBtn.textContent = 'Update Todo';
      PubSub.publish('todo:edit', { todoId: todo.id });
    }

    const todoEl = document.createElement('li');
    todoEl.classList.add('todo');

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

    const titleEl = document.createElement('p');
    titleEl.classList.add('todo-title');
    titleEl.textContent = todo.title;
    todoEl.appendChild(titleEl);

    const dueDateEl = getDueDateEl(todo.dueDate);
    dueDateEl.classList.add('todo-due-date');
    todoEl.appendChild(dueDateEl);

    const todoShowDetailsBtn = document.createElement('button');
    todoShowDetailsBtn.setAttribute('type', 'button');
    todoShowDetailsBtn.setAttribute('aria-label', 'Show todo details');
    todoShowDetailsBtn.classList.add('todo-show-details-btn');
    todoShowDetailsBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
        <path
          d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"
        />
      </svg>`;
    todoShowDetailsBtn.addEventListener('click', handleTodoClick);
    todoEl.appendChild(todoShowDetailsBtn);

    const todoEditBtn = document.createElement('button');
    todoEditBtn.setAttribute('type', 'button');
    todoEditBtn.setAttribute('aria-label', 'Edit todo');
    todoEditBtn.classList.add('todo-edit-btn');
    todoEditBtn.dataset.targetModal = 'todoFormModal';
    todoEditBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
        <path
          d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h357l-80 80H200v560h560v-278l80-80v358q0 33-23.5 56.5T760-120H200Zm280-360ZM360-360v-170l367-367q12-12 27-18t30-6q16 0 30.5 6t26.5 18l56 57q11 12 17 26.5t6 29.5q0 15-5.5 29.5T897-728L530-360H360Zm481-424-56-56 56 56ZM440-440h56l232-232-28-28-29-28-231 231v57Zm260-260-29-28 29 28 28 28-28-28Z"
        />
      </svg>`;
    todoEditBtn.addEventListener('click', handleShowModalBtnClick);
    todoEditBtn.addEventListener('click', handleTodoEditBtnClick);
    todoEl.appendChild(todoEditBtn);

    return todoEl;
  }

  for (const todo of todos) {
    const todoEl = createTodo(todo);
    todoListEl.appendChild(todoEl);
  }
}

function populateTodoForm(todo) {
  todoIdInput.value = todo.id;
  todoProjectIdInput.value = todo.projectId;
  todoTitleInput.value = todo.title;
  todoDescriptionInput.value = todo.description;
  todoDueDateInput.value = todo.dueDate;
  todoPriorityInput.value = todo.priority;
}

function attachTodosEventListeners() {
  const todoNewBtn = document.querySelector('.jsTodoNewBtn');

  function handleTodoNewBtnClick() {
    const activeProjectEl = document.querySelector('[data-project-id].active');
    const activeProjectId = activeProjectEl.dataset.projectId;
    const today = new Date().toISOString().split('T')[0];
    const todoDueDateInput = document.querySelector('#todo-due-date');

    todoFormModalHeading.textContent = 'Create New Todo';
    todoForm.dataset.submitOperation = 'create';
    todoFormSubmitBtn.textContent = 'Create Todo';

    todoProjectIdInput.value = activeProjectId;

    // Set todo due date input's min and value to today
    todoDueDateInput.setAttribute('min', today);
    todoDueDateInput.value = today;
  }

  function handleTodoFormSubmit() {
    const submitOperation = todoForm.dataset.submitOperation;
    const title = todoTitleInput.value;
    const description = todoDescriptionInput.value;
    const dueDate = todoDueDateInput.value;
    const priority = todoPriorityInput.value;

    switch (submitOperation) {
      case 'create':
        PubSub.publish('todo:create', {
          form: todoForm,
          projectId: todoProjectIdInput.value,
          title,
          description,
          dueDate,
          priority,
        });
        break;
      case 'update':
        PubSub.publish('todo:update', {
          form: todoForm,
          todoId: todoIdInput.value,
          title,
          description,
          dueDate,
          priority,
        });
        break;
    }
  }

  todoNewBtn.addEventListener('click', handleTodoNewBtnClick);
  todoForm.addEventListener('submit', handleTodoFormSubmit);
}

export { renderTodos, populateTodoForm, attachTodosEventListeners };
