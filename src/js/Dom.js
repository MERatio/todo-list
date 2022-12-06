import format from 'date-fns/format';
import Project from './Project';
import Todo from './Todo';
import eventEmitter from './eventEmitter';

const _menuBtn = document.querySelector('.js-menu-btn');
const _menuBtnIcon = _menuBtn.querySelector('.js-menu-btn-icon');
const _projectsNav = document.querySelector('.js-projects-nav');
const _newProjectBtn = document.querySelector('.js-new-project-btn');
const _projectList = document.querySelector('.js-project-list');
const _todosProject = document.querySelector('.js-todos-project');
const _todoList = document.querySelector('.js-todo-list');

function _handleDeleteTodoBtnClick(event) {
  const todoId = event.target.dataset.todoId;
  Todo.delete(todoId);
}

function _handleCompleteTodoBtnClick(event) {
  const todoId = event.target.dataset.todoId;
  const todoData = Todo.findById(todoId);
  Todo.update(todoId, { ...todoData, isComplete: !todoData.isComplete });
}

function _createTodo(todoData) {
  const priorityColors = {
    1: 'bg-orange-200',
    2: 'bg-orange-300',
    3: 'bg-orange-400',
    4: 'bg-orange-500',
  };

  const todo = document.createElement('li');
  todo.classList.add(`${priorityColors[todoData.priority]}`, 'p-2');
  todo.dataset.todoId = todoData.id;

  const topDiv = document.createElement('div');
  topDiv.classList.add('flex', 'items-center');
  todo.appendChild(topDiv);

  const completeBtn = document.createElement('button');
  completeBtn.setAttribute('type', 'button');
  completeBtn.classList.add(
    'flex',
    'cursor-pointer',
    'items-center',
    'hover:text-slate-700'
  );
  completeBtn.setAttribute('title', 'Mark as complete');
  completeBtn.setAttribute('aria-label', 'Mark as complete');
  completeBtn.dataset.todoId = todoData.id;
  completeBtn.addEventListener('click', _handleCompleteTodoBtnClick);
  topDiv.appendChild(completeBtn);

  const completeBtnIcon = document.createElement('ion-icon');
  completeBtnIcon.setAttribute(
    'name',
    `${todoData.isComplete ? 'ellipse' : 'ellipse-outline'}`
  );
  completeBtn.appendChild(completeBtnIcon);

  const title = document.createElement('p');
  title.classList.add(
    `${todoData.isComplete ? 'line-through' : 'no-underline'}`,
    'ml-1',
    'mr-auto'
  );
  title.textContent = todoData.title;
  topDiv.appendChild(title);

  const editBtn = document.createElement('button');
  editBtn.setAttribute('type', 'button');
  editBtn.classList.add(
    'flex',
    'cursor-pointer',
    'items-center',
    'hover:text-slate-700'
  );
  editBtn.setAttribute('title', 'Edit todo');
  editBtn.setAttribute('aria-label', 'Edit todo');
  topDiv.appendChild(editBtn);

  const editBtnIcon = document.createElement('ion-icon');
  editBtnIcon.setAttribute('name', 'create-outline');
  editBtn.appendChild(editBtnIcon);

  const deleteBtn = document.createElement('button');
  deleteBtn.setAttribute('type', 'button');
  deleteBtn.classList.add(
    'js-delete-todo-btn',
    'ml-2',
    'flex',
    'cursor-pointer',
    'items-center',
    'hover:text-red-800'
  );
  deleteBtn.setAttribute('title', 'Delete todo');
  deleteBtn.setAttribute('aria-label', 'Delete todo');
  deleteBtn.dataset.todoId = todoData.id;
  deleteBtn.addEventListener('click', _handleDeleteTodoBtnClick);
  topDiv.appendChild(deleteBtn);

  const deleteBtnIcon = document.createElement('ion-icon');
  deleteBtnIcon.setAttribute('name', 'trash-outline');
  deleteBtn.appendChild(deleteBtnIcon);

  const date = document.createElement('p');
  date.classList.add('ml-[30px]', 'text-xs');
  date.textContent = format(todoData.dueDate, 'MM/dd/yyyy');
  todo.appendChild(date);

  return todo;
}

function _handleDeleteProjectBtnClick(event) {
  event.stopPropagation();

  const projectId = event.target.dataset.projectId;
  Project.delete(projectId);
}

function _handleProjectClick(event) {
  let projectId = event.target.dataset.projectId;

  while (!projectId) {
    projectId = event.target.parentNode.dataset.projectId;
  }

  setActiveProject(projectId);
}

function _createProject(projectData) {
  const project = document.createElement('li');
  project.dataset.projectId = projectData.id;
  project.classList.add(
    'js-project',
    'active-project',
    'flex',
    'cursor-pointer',
    'justify-between',
    'p-1',
    'pl-4',
    'hover:bg-gray-50'
  );
  project.addEventListener('click', _handleProjectClick);

  const title = document.createElement('span');
  title.textContent = projectData.title;
  project.appendChild(title);

  const deleteBtn = document.createElement('button');
  deleteBtn.setAttribute('type', 'button');
  deleteBtn.classList.add(
    'js-delete-project-btn',
    'flex',
    'cursor-pointer',
    'items-center',
    'hover:text-red-800'
  );
  deleteBtn.setAttribute('title', 'Delete project');
  deleteBtn.setAttribute('aria-label', 'Delete projects');
  deleteBtn.dataset.projectId = projectData.id;
  deleteBtn.addEventListener('click', _handleDeleteProjectBtnClick);
  const closeIcon = document.createElement('ion-icon');
  closeIcon.setAttribute('name', 'close-outline');
  deleteBtn.appendChild(closeIcon);
  project.appendChild(deleteBtn);

  return project;
}

function _handleFinishedProjectCreation(event) {
  event.preventDefault();

  const projectForm = document.querySelector('.js-project-form');
  const projectTitleInput = projectForm.querySelector('.js-project-input');

  if (projectForm && event.target !== projectTitleInput) {
    const title = projectTitleInput.value;
    if (title) {
      Project.create({ title });
    }
    _newProjectBtn.removeAttribute('disabled');
    projectForm.removeEventListener('submit', _handleFinishedProjectCreation);
    projectForm.remove();
    window.removeEventListener('click', _handleFinishedProjectCreation);
  }
}

function _createProjectForm() {
  const projectForm = document.createElement('form');
  projectForm.classList.add('js-project-form');
  projectForm.addEventListener('submit', _handleFinishedProjectCreation);
  _projectList.appendChild(projectForm);

  const projectTitleInput = document.createElement('input');
  projectTitleInput.setAttribute('type', 'text');
  projectTitleInput.classList.add(
    'js-project-input',
    'w-full',
    'bg-gray-50',
    'p-1',
    'pl-4'
  );
  projectForm.appendChild(projectTitleInput);

  return projectForm;
}

function _handleNewProjectBtnClick(event) {
  event.stopPropagation();

  _newProjectBtn.setAttribute('disabled', '');

  const projectForm = _createProjectForm();
  const projectTitleInput = projectForm.querySelector('.js-project-input');
  projectTitleInput.focus();

  window.addEventListener('click', _handleFinishedProjectCreation);
}

function _handleMenuClick() {
  const _menuBtnIconName = _projectsNav.classList.contains('hidden')
    ? 'close-outline'
    : 'menu-outline';
  _menuBtnIcon.setAttribute('name', _menuBtnIconName);

  _projectsNav.classList.toggle('hidden');
  _projectsNav.classList.toggle('block');
}

function deleteTodo(todoId) {
  const todo = _todoList.querySelector(`[data-todo-id="${todoId}"]`);

  if (!todo) {
    return;
  }

  const deleteTodoBtn = todo.querySelector('.js-delete-todo-btn');
  deleteTodoBtn.removeEventListener('click', _handleDeleteTodoBtnClick);
  todo.remove();
}

function updateTodo(todoId, todoData) {
  const todo = _todoList.querySelector(`[data-todo-id="${todoId}"]`);
  const newTodo = _createTodo(todoData);
  todo.parentNode.replaceChild(newTodo, todo);
}

function addTodo(todoData) {
  const todo = _createTodo(todoData);
  _todoList.appendChild(todo);
}

function deleteProject(projectId) {
  const project = _projectList.querySelector(
    `[data-project-id="${projectId}"]`
  );

  if (!project) {
    return;
  }

  const deleteProjectBtn = project.querySelector('.js-delete-project-btn');
  project.removeEventListener('click', _handleProjectClick);
  deleteProjectBtn.removeEventListener('click', _handleDeleteProjectBtnClick);
  project.remove();

  eventEmitter.emit('project-dom-delete');
}

function setActiveProject(projectId) {
  if (projectId === null) {
    _todosProject.textContent = '';
    return;
  }

  const prevActiveProject = document.querySelector('.active-project');
  const activeProject = document.querySelector(
    `[data-project-id="${projectId}"]`
  );
  const todos = Todo.findByProjectId(projectId);

  if (prevActiveProject) {
    prevActiveProject.classList.remove('active-project');
  }

  activeProject.classList.add('active-project');

  _todosProject.textContent = activeProject.textContent;

  _todoList.innerHTML = '';

  for (let todo of todos) {
    addTodo(todo);
  }
}

function addProject(projectData) {
  const project = _createProject(projectData);
  _projectList.appendChild(project);
  eventEmitter.emit('project-render', project);
}

function attachEvents() {
  _menuBtn.addEventListener('click', _handleMenuClick);
  _newProjectBtn.addEventListener('click', _handleNewProjectBtnClick);
}

export {
  deleteTodo,
  updateTodo,
  addTodo,
  deleteProject,
  setActiveProject,
  addProject,
  attachEvents,
};
