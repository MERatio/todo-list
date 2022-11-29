import Project from './Project';
import eventEmitter from './eventEmitter';

const Dom = (function () {
  const _menuBtn = document.querySelector('.js-menu-btn');
  const _menuBtnIcon = _menuBtn.querySelector('.js-menu-btn-icon');
  const _projectsNav = document.querySelector('.js-projects-nav');
  const _newProjectBtn = document.querySelector('.js-new-project-btn');
  const _projectList = document.querySelector('.js-project-list');
  const _todosProject = document.querySelector('.js-todos-project');

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

  function _createProject(data) {
    const project = document.createElement('li');
    project.dataset.id = data.id;
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

    const title = document.createElement('span');
    title.textContent = data.title;
    project.appendChild(title);

    const deleteBtn = document.createElement('button');
    deleteBtn.setAttribute('type', 'button');
    deleteBtn.classList.add(
      'flex',
      'cursor-pointer',
      'items-center',
      'hover:text-red-800'
    );
    deleteBtn.setAttribute('title', 'Delete project');
    deleteBtn.setAttribute('aria-label', 'Delete projects');
    const closeIcon = document.createElement('ion-icon');
    closeIcon.setAttribute('name', 'close-outline');
    deleteBtn.appendChild(closeIcon);
    project.appendChild(deleteBtn);

    return project;
  }

  function _createProjectForm() {
    const projectForm = document.createElement('form');
    projectForm.classList.add('js-project-form');
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
    projectForm.addEventListener('submit', _handleFinishedProjectCreation);
    const projectTitleInput = projectForm.querySelector('.js-project-input');
    projectTitleInput.focus();

    window.addEventListener('click', _handleFinishedProjectCreation);
  }

  function _handleMenuClick() {
    const menuBtnIconName = _projectsNav.classList.contains('hidden')
      ? 'close-outline'
      : 'menu-outline';
    _menuBtnIcon.setAttribute('name', menuBtnIconName);

    _projectsNav.classList.toggle('hidden');
    _projectsNav.classList.toggle('block');
  }

  function attachEvents() {
    _menuBtn.addEventListener('click', _handleMenuClick);
    _newProjectBtn.addEventListener('click', _handleNewProjectBtnClick);
  }

  function setNewActiveProject(projectId) {
    const prevActiveProject = document.querySelector('.active-project');
    const activeProject = document.querySelector(`[data-id="${projectId}"]`);

    if (prevActiveProject) {
      prevActiveProject.classList.remove('active-project');
    }

    activeProject.classList.add('active-project');
  }

  function addProject(data) {
    const project = _createProject(data);
    _projectList.appendChild(project);
    _todosProject.textContent = data.title;
    eventEmitter.emit('project-render', project);
  }

  return { attachEvents, setNewActiveProject, addProject };
})();

export default Dom;
