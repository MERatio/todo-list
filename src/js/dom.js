import sanitizeHtml from 'sanitize-html';
import formatDate from 'date-fns/format';
import { EE } from './events';

const barsBtn = document.getElementById('barsBtn');
const projectForm = document.getElementById('projectForm');
const todoForm = document.getElementById('todoForm');
const projectSection = document.getElementById('projectSection');
const openDialogBtns = document.querySelectorAll('.openDialogBtn');
const closeDialogBtns = document.querySelectorAll('.closeDialogBtn');
const dialogs = document.querySelectorAll('.dialog');
const projectList = document.getElementById('projectList');
const todosProjectTitle = document.getElementById('todosProjectTitle');
const todoList = document.getElementById('todoList');
const addTodoBtn = document.getElementById('addTodoBtn');

function addFormValidations() {
	const todoForm = document.getElementById('todoForm');
	const todoDueDateInput = todoForm.querySelector('#todoDueDate');
	todoDueDateInput.setAttribute('min', new Date().toISOString().split('T')[0]);
}

function handleBarsBtnClick() {
	if (projectSection.classList.contains('w-0')) {
		projectSection.classList.remove('w-0', 'p-0', 'sm:w-0', 'sm:p-0');
		projectSection.classList.add('w-full', 'p-2', 'sm:w-6/12', 'sm:p-3');
	} else {
		projectSection.classList.remove('w-full', 'p-2', 'sm:w-6/12', 'sm:p-3');
		projectSection.classList.add('w-0', 'p-0', 'sm:w-0', 'sm:p-0');
	}
}

function populateForm(form, resource, resourceId) {
	switch (resource) {
		case 'project':
			const titleInput = form.querySelector('#projectTitle');
			const projectLi = projectList.querySelector(
				`[data-project-id="${resourceId}"]`,
			);
			const switchProjectBtn = projectLi.querySelector('.switchProjectBtn');
			titleInput.value = switchProjectBtn.textContent.trim();
			break;
	}
}

function handleOpenDialogBtnClick(e) {
	const btn = e.currentTarget;
	const dialog = document.getElementById(btn.dataset.dialogId);
	const form = dialog.querySelector('form');
	const formOperation = btn.dataset.formOperation;
	const submitBtn = form.querySelector('button[type="submit"]');
	form.dataset.formOperation = formOperation;
	if (formOperation === 'edit') {
		const resource = btn.dataset.resource;
		const resourceId = btn.dataset[resource + 'Id'];
		form.dataset[resource + 'Id'] = resourceId;
		populateForm(form, resource, resourceId);
	}
	submitBtn.textContent = btn.dataset.submitBtnText;
	dialog.showModal();
}

function handleCloseDialogBtnClick(e) {
	const dialog = document.getElementById(e.currentTarget.dataset.dialogId);
	dialog.close();
}

function handleDialogClosed(e) {
	const dialog = e.currentTarget;
	const form = dialog.querySelector('form');
	form.reset();
}

function handleProjectFormSubmit() {
	const formOperation = projectForm.dataset.formOperation;
	const projectId = projectForm.dataset.projectId;
	const titleInput = projectForm.querySelector('#projectTitle');

	switch (formOperation) {
		case 'new':
			return EE.emit('will-create-project', titleInput.value);
		case 'edit':
			delete projectForm.dataset.projectId;
			return EE.emit('will-update-project', projectId, titleInput.value);
	}

	delete projectForm.dataset.formOperation;
}

function handleTodoFormSubmit() {
	const formOperation = todoForm.dataset.formOperation;
	const activeProjectId = projectList.querySelector('[data-active-project]')
		.dataset.projectId;
	const title = todoForm.querySelector('#todoTitle').value;
	const description = todoForm.querySelector('#todoDescription').value;
	const dueDate = new Date(todoForm.querySelector('#todoDueDate').value);
	const priority = Number(todoForm.querySelector('#todoPriority').value);

	switch (formOperation) {
		case 'new':
			return EE.emit(
				'will-create-todo',
				activeProjectId,
				title,
				description,
				dueDate,
				priority,
			);
	}

	delete todoForm.dataset.formOperation;
}

function addEventListeners() {
	barsBtn.addEventListener('click', handleBarsBtnClick);
	for (const openDialogBtn of openDialogBtns) {
		openDialogBtn.addEventListener('click', handleOpenDialogBtnClick);
	}
	for (const closeDialogBtn of closeDialogBtns) {
		closeDialogBtn.addEventListener('click', handleCloseDialogBtnClick);
	}
	for (const dialog of dialogs) {
		dialog.addEventListener('close', handleDialogClosed);
	}
	projectForm.addEventListener('submit', handleProjectFormSubmit);
	todoForm.addEventListener('submit', handleTodoFormSubmit);
}

function handleSwitchProjectBtnClick(e) {
	const oldActiveProjectLi = projectList.querySelector(`[data-active-project]`);
	const oldActiveProjectId = oldActiveProjectLi.dataset.projectId;
	const newActiveProjectId = e.currentTarget.dataset.projectId;

	if (oldActiveProjectId === newActiveProjectId) {
		return;
	}

	EE.emit('will-switch-project', newActiveProjectId);
}

function handleDeleteProjectBtnClick(e) {
	const projectId = e.currentTarget.dataset.projectId;
	EE.emit('will-delete-project', projectId);
}

function createProjectLi(project) {
	const projectLi = document.createElement('li');
	projectLi.classList.add(
		'flex',
		'border-b-2',
		'border-solid',
		'border-transparent',
		'hover:border-red-600',
	);
	projectLi.dataset.projectId = project.id;

	projectLi.innerHTML = `
		<button
			type="button"
			class="switchProjectBtn grow text-left sm:text-lg"
			data-project-id="${project.id}"
		>
			${sanitizeHtml(project.title)}
		</button>
		<button
			type="button"
			class="editProjectBtn fill-main"
			title="Edit project"
			data-dialog-id="projectDialog"
			data-submit-btn-text="Update"
			data-form-operation="edit"
			data-resource="project"
			data-project-id="${project.id}"
		>
			<svg
				class="h-4"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 512 512"
			>
				<path
					d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152V424c0 48.6 39.4 88 88 88H360c48.6 0 88-39.4 88-88V312c0-13.3-10.7-24-24-24s-24 10.7-24 24V424c0 22.1-17.9 40-40 40H88c-22.1 0-40-17.9-40-40V152c0-22.1 17.9-40 40-40H200c13.3 0 24-10.7 24-24s-10.7-24-24-24H88z"
				/>
			</svg>
		</button>
		<button
			type="button"
			class="deleteProjectBtn fill-main ml-2"
			title="Delete project"
			data-project-id="${project.id}"
		>
			<svg
				class="h-4"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 384 512"
			>
				<path
					d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
				/>
			</svg>
		</button>
	`;

	const switchProjectBtn = projectLi.querySelector('.switchProjectBtn');
	switchProjectBtn.addEventListener('click', handleSwitchProjectBtnClick);

	const editProjectBtn = projectLi.querySelector('.editProjectBtn');
	editProjectBtn.addEventListener('click', handleOpenDialogBtnClick);

	const deleteProjectBtn = projectLi.querySelector('.deleteProjectBtn');
	deleteProjectBtn.addEventListener('click', handleDeleteProjectBtnClick);

	return projectLi;
}

function renderProject(project) {
	const projectLi = createProjectLi(project);
	projectList.append(projectLi);
}

function updateProject(updatedProject) {
	const projectLi = projectList.querySelector(
		`[data-project-id="${updatedProject.id}"]`,
	);
	const switchProjectBtn = projectLi.querySelector('.switchProjectBtn');
	switchProjectBtn.textContent = updatedProject.title;
	if (projectLi.dataset.hasOwnProperty('activeProject')) {
		todosProjectTitle.textContent = updatedProject.title;
	}
}

function determineAddTodoDisplay() {
	if (projectList.children.length === 0) {
		addTodoBtn.classList.add('hidden');
	} else {
		if (addTodoBtn.classList.contains('hidden')) {
			addTodoBtn.classList.remove('hidden');
		}
	}
}

function removeProject(projectId) {
	const projectLi = projectList.querySelector(
		`[data-project-id="${projectId}"]`,
	);

	const switchProjectBtn = projectLi.querySelector('.switchProjectBtn');
	switchProjectBtn.removeEventListener('click', handleSwitchProjectBtnClick);

	const editProjectBtn = projectLi.querySelector('.editProjectBtn');
	editProjectBtn.removeEventListener('click', handleOpenDialogBtnClick);

	const deleteProjectBtn = projectLi.querySelector('.deleteProjectBtn');
	deleteProjectBtn.removeEventListener('click', handleDeleteProjectBtnClick);

	projectLi.remove();

	if (projectLi.dataset.hasOwnProperty('activeProject')) {
		EE.emit('deleted-active-project-li');
	}
}

function removeTodo(todoId) {
	const todoLi = todoList.querySelector(`[data-todo-id="${todoId}"]`);
	const editTodoBtn = todoLi.querySelector('.editTodoBtn');
	editTodoBtn.removeEventListener('click', handleOpenDialogBtnClick);
	todoLi.remove();
}

function setTodosTitle(todosTitle) {
	todosProjectTitle.textContent = todosTitle;
}

function clearTodoList() {
	while (todoList.children.length > 0) {
		removeTodo(todoList.children[0].dataset.todoId);
	}
}

function getTodoCircleColor(priority) {
	// I can't use string concatenation because tailwindcss doesnt generate dynamic class names.
	switch (priority) {
		case 1:
			return 'fill-red-600 hover:fill-red-700';
		case 2:
			return 'fill-amber-600 hover:fill-amber-700';
		case 3:
			return 'fill-blue-600 hover:fill-blue-700';
		case 4:
			return 'fill-neutral-600 hover:fill-neutral-700';
	}
}

function createTodoLi(todo) {
	const todoLi = document.createElement('li');
	todoLi.classList.add(
		'relative',
		'py-2',
		'pl-8',
		'pr-14',
		'shadow',
		'sm:py-3',
	);
	todoLi.dataset.todoId = todo.id;

	const circleFill = getTodoCircleColor(todo.priority);

	todoLi.innerHTML = `
		<button
			type="button"
			class="absolute left-2 top-4 ${circleFill}"
			title="Complete/uncomplete todo"
		>
			<svg
				class="h-4"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 512 512"
			>
				<path
					d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z"
				/>
			</svg>
		</button>
		<details class="w-full">
			<summary
				class="inline-flex w-full cursor-pointer items-center border-b border-solid border-gray-200 hover:border-gray-300"
			>
				<p>${sanitizeHtml(todo.title)}</p>
				<p class="ml-5 text-sm text-neutral-600">${formatDate(todo.dueDate, 'PPPP')}</p>
			</summary>
			<p class="pt-2 text-sm">
				${sanitizeHtml(todo.description)}
			</p>
		</details>
		<button
			type="button"
			class="editTodoBtn fill-main absolute right-8 top-4 text-2xl"
			title="Edit todo"
			data-dialog-id="todoDialog"
			data-submit-btn-text="Update"
		>
			<svg
				class="h-4"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 512 512"
			>
				<path
					d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152V424c0 48.6 39.4 88 88 88H360c48.6 0 88-39.4 88-88V312c0-13.3-10.7-24-24-24s-24 10.7-24 24V424c0 22.1-17.9 40-40 40H88c-22.1 0-40-17.9-40-40V152c0-22.1 17.9-40 40-40H200c13.3 0 24-10.7 24-24s-10.7-24-24-24H88z"
				/>
			</svg>
		</button>
		<button
			type="button"
			class="fill-main absolute right-3 top-4"
			title="Delete todo"
		>
			<svg
				class="h-4"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 384 512"
			>
				<path
					d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
				/>
			</svg>
		</button>
	`;

	const editTodoBtn = todoLi.querySelector('.editTodoBtn');
	editTodoBtn.addEventListener('click', handleOpenDialogBtnClick);

	return todoLi;
}

function renderTodo(todo) {
	const todoLi = createTodoLi(todo);
	todoList.append(todoLi);
}

function renderTodos(todos) {
	for (const todo of todos) {
		renderTodo(todo);
	}
}

function switchProject(project, todos) {
	const oldActiveProjectLi = projectList.querySelector(`[data-active-project`);
	const newActiveProjectLi = projectList.querySelector(
		`[data-project-id="${project.id}"]`,
	);

	if (oldActiveProjectLi) {
		delete oldActiveProjectLi.dataset.activeProject;
		oldActiveProjectLi.classList.remove(
			'font-medium',
			'text-red-600',
			'border-red-600',
			'cursor-default',
		);
		oldActiveProjectLi.classList.add('border-transparent');
		const oldActiveProjectLiBtn =
			oldActiveProjectLi.querySelector('.switchProjectBtn');
		oldActiveProjectLiBtn.classList.remove('cursor-default');
	}

	newActiveProjectLi.dataset.activeProject = '';
	newActiveProjectLi.classList.add(
		'font-medium',
		'text-red-600',
		'border-red-600',
		'cursor-default',
	);
	newActiveProjectLi.classList.remove('border-transparent');
	const newActiveProjectLiBtn =
		newActiveProjectLi.querySelector('.switchProjectBtn');
	newActiveProjectLiBtn.classList.add('cursor-default');

	setTodosTitle(project.title);
	clearTodoList();
	renderTodos(todos);
}

export {
	addFormValidations,
	addEventListeners,
	renderProject,
	updateProject,
	removeProject,
	determineAddTodoDisplay,
	setTodosTitle,
	clearTodoList,
	renderTodo,
	switchProject,
};
