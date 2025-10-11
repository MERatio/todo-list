import PubSub from 'pubsub-js';

const projectList = document.querySelector('.jsProjectList');

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

      switchProject(project);
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

    return projectEl;
  }

  projectList.replaceChildren();
  for (const project of projects) {
    const projectEl = createProject(project);
    projectList.appendChild(projectEl);
  }
}

function switchProject(project) {
  const activeProjectEl = projectList.querySelector('[data-project-id].active');
  const todosSectionHeading = document.querySelector('.jsTodosSectionHeading');

  if (activeProjectEl) {
    activeProjectEl.classList.remove('active');
  }

  const newActiveProjectEl = projectList.querySelector(
    `[data-project-id="${project.id}"]`
  );

  newActiveProjectEl.classList.add('active');
  todosSectionHeading.textContent = `${project.title}'s Todos`;
}

function attachProjectsEventListeners() {
  const projectForm = document.querySelector('.jsProjectForm');

  projectForm.addEventListener('submit', handleProjectFormSubmit);
}

export { renderProjects, switchProject, attachProjectsEventListeners };
