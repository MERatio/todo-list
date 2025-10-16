import PubSub from 'pubsub-js';
import { handleShowFormModalBtnClick } from './shared.js';

const projectList = document.querySelector('.jsProjectList');
const projectIdInput = document.querySelector('#project-id');

function handleProjectFormSubmit(e) {
  const form = e.currentTarget;
  const operation = form.dataset.operation;
  const title = form.querySelector('#project-title').value;

  switch (operation) {
    case 'create':
      PubSub.publish('project:create', { form, title });
      break;
    case 'edit':
      PubSub.publish('project:edit', {
        form,
        projectId: projectIdInput.value,
        title,
      });
  }
}

function renderProjects(projects) {
  function createProject(project) {
    function handleProjectBtnClick(e) {
      const activeProjectEl = projectList.querySelector(
        '[data-project-id].active'
      );
      const projectEl = e.currentTarget.closest('li[data-project-id]');
      const projectId = projectEl.dataset.projectId;

      if (activeProjectEl.dataset.projectId === projectId) {
        return;
      }

      PubSub.publish('project:switch', { project });
    }

    function handleProjectEditBtnClick() {
      projectIdInput.value = project.id;
    }

    function handleProjectDeleteBtnClick() {
      PubSub.publish('project:delete', { projectId: project.id });
    }

    const projectEl = document.createElement('li');
    projectEl.classList.add('project-list-item');
    projectEl.dataset.projectId = project.id;

    const button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.classList.add('project-btn');
    button.textContent = project.title;
    button.addEventListener('click', handleProjectBtnClick);
    projectEl.appendChild(button);

    const projectEditBtn = document.createElement('button');
    projectEditBtn.setAttribute('type', 'button');
    projectEditBtn.setAttribute('aria-label', 'Edit project');
    projectEditBtn.classList.add('project-edit-btn');
    projectEditBtn.dataset.targetModal = 'projectFormModal';
    projectEditBtn.dataset.operation = 'edit';
    projectEditBtn.innerHTML = `
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 -960 960 960"
      >
        <path
          d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"
        />
      </svg>`;
    projectEditBtn.addEventListener('click', handleShowFormModalBtnClick);
    projectEditBtn.addEventListener('click', handleProjectEditBtnClick);
    projectEl.appendChild(projectEditBtn);

    const projectDeleteBtn = document.createElement('button');
    projectDeleteBtn.setAttribute('type', 'button');
    projectDeleteBtn.classList.add('project-delete-btn');
    projectDeleteBtn.innerHTML = '<span aria-hidden="true">&times;</span>';
    projectDeleteBtn.addEventListener('click', handleProjectDeleteBtnClick);
    projectEl.appendChild(projectDeleteBtn);

    return projectEl;
  }

  projectList.replaceChildren();
  for (const project of projects) {
    const projectEl = createProject(project);
    projectList.appendChild(projectEl);
  }
}

function switchProject(project) {
  const todosSectionHeading = document.querySelector('.jsTodosSectionHeading');

  if (project === null) {
    todosSectionHeading.textContent = '';
  } else {
    const activeProjectEl = projectList.querySelector(
      '[data-project-id].active'
    );

    if (activeProjectEl) {
      activeProjectEl.classList.remove('active');
    }

    const newActiveProjectEl = projectList.querySelector(
      `[data-project-id="${project.id}"]`
    );

    newActiveProjectEl.classList.add('active');
    todosSectionHeading.textContent = `${project.title}'s Todos`;
  }
}

function attachProjectsEventListeners() {
  const projectForm = document.querySelector('.jsProjectForm');

  projectForm.addEventListener('submit', handleProjectFormSubmit);
}

export { renderProjects, switchProject, attachProjectsEventListeners };
