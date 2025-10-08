import PubSub from 'pubsub-js';

const projectList = document.querySelector('.jsProjectList');
const projectForm = document.querySelector('.jsProjectForm');
const todosSectionHeading = document.querySelector('.jsTodosSectionHeading');

function handleShowFormModalBtnClick(e) {
  const showModalBtn = e.currentTarget;
  const targetModalName = showModalBtn.dataset.targetModal;
  const modal = document.querySelector(`[data-modal="${targetModalName}"]`);
  const operation = showModalBtn.dataset.operation;
  const form = modal.querySelector('form');
  form.dataset.operation = operation;
  modal.showModal();
}

function handleCloseDialogBtnClick(e) {
  const dialog = e.target.closest('dialog');
  dialog.close();
}

function handleProjectFormSubmit(e) {
  const form = e.currentTarget;
  const operation = form.dataset.operation;
  const title = form.querySelector('#project-title').value;

  switch (operation) {
    case 'create':
      PubSub.publish('project:create', { form, title });
      break;
  }
}

function createProject(project) {
  function handleProjectBtnClick(e) {
    const activeProjectLi = projectList.querySelector(
      '[data-project-id].active'
    );
    const projectLi = e.currentTarget.closest('li[data-project-id]');
    const projectId = projectLi.dataset.projectId;

    if (activeProjectLi.dataset.projectId === projectId) {
      return;
    }

    switchProject(project);
  }

  const projectLi = document.createElement('li');
  projectLi.classList.add('project-list-item');
  projectLi.dataset.projectId = project.id;

  const button = document.createElement('button');
  button.setAttribute('type', 'button');
  button.classList.add('project-btn');
  button.textContent = project.title;
  button.addEventListener('click', handleProjectBtnClick);

  projectLi.appendChild(button);

  return projectLi;
}

function renderProjects(projects) {
  projectList.replaceChildren();
  for (const project of projects) {
    const projectLi = createProject(project);
    projectList.appendChild(projectLi);
  }
}

function resetForm(form) {
  form.reset();
}

function switchProject(project) {
  const activeProjectLi = projectList.querySelector('[data-project-id].active');
  if (activeProjectLi) {
    activeProjectLi.classList.remove('active');
  }

  const newActiveProjectLi = projectList.querySelector(
    `[data-project-id="${project.id}"]`
  );

  newActiveProjectLi.classList.add('active');
  todosSectionHeading.textContent = `${project.title}'s Todos`;
}

function attachEventListeners() {
  const showModalBtns = document.querySelectorAll('.jsShowModalBtn');
  const closeDialogBtns = document.querySelectorAll('.jsCloseDialogBtn');

  for (const showModalBtn of showModalBtns) {
    showModalBtn.addEventListener('click', handleShowFormModalBtnClick);
  }

  for (const closeDialogBtn of closeDialogBtns) {
    closeDialogBtn.addEventListener('click', handleCloseDialogBtnClick);
  }

  projectForm.addEventListener('submit', handleProjectFormSubmit);
}

export { renderProjects, resetForm, switchProject, attachEventListeners };
