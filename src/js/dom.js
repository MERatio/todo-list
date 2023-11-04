import sanitizeHtml from 'sanitize-html';
import formatDate from 'date-fns/format';
import { EE } from './events';

const barsBtn = document.getElementById('barsBtn');
const projectSection = document.getElementById('projectSection');
const openDialogBtns = document.querySelectorAll('.openDialogBtn');
const closeDialogBtns = document.querySelectorAll('.closeDialogBtn');
const dialogs = document.querySelectorAll('.dialog');
const projectList = document.getElementById('projectList');
const projectForm = document.getElementById('projectForm');
const todosProjectTitle = document.getElementById('todosProjectTitle');
const todoList = document.getElementById('todoList');

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

function handleOpenDialogBtnClick(e) {
	const btn = e.currentTarget;
	const dialog = document.getElementById(btn.dataset.dialogId);
	const form = dialog.querySelector('form');
	const formOperation = btn.dataset.formOperation;
	const submitBtn = form.querySelector('button[type="submit"]');
	form.dataset.formOperation = formOperation;
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
	const titleInput = projectForm.querySelector('#projectTitle');
	if (projectForm.dataset.formOperation === 'new') {
		delete projectForm.dataset.formOperation;
		EE.emit('new-project', titleInput.value);
	}
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
}

function handleProjectLiClick(e) {
	const oldActiveProjectLi = projectList.querySelector(`[data-active-project]`);
	const oldActiveProjectId = oldActiveProjectLi.dataset.projectId;
	const newActiveProjectId = e.currentTarget.dataset.projectId;

	if (oldActiveProjectId === newActiveProjectId) {
		return;
	}

	EE.emit('project-switch', newActiveProjectId);
}

function createProjectLi(project) {
	const projectLi = document.createElement('li');
	projectLi.dataset.projectId = project.id;
	projectLi.addEventListener('click', handleProjectLiClick);
	projectLi.innerHTML = `
		<button
			type="button"
			class="w-full rounded px-2 py-1 text-left hover:bg-slate-100 sm:text-lg md:px-3"
		>
			${sanitizeHtml(project.title)}
		</button>
	`;
	return projectLi;
}

function renderProject(project) {
	const projectLi = createProjectLi(project);
	projectList.append(projectLi);
}

function removeTodo(todoId) {
	const todoLi = todoList.querySelector(`[data-todo-id="${todoId}"]`);
	const editTodoBtn = todoLi.querySelector('.editTodoBtn');
	editTodoBtn.removeEventListener('click', handleOpenDialogBtnClick);
	todoLi.remove();
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
			class="editTodoBtn fill-main absolute right-8 top-4 flex items-center text-2xl"
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

function switchProject(project, todos) {
	const oldActiveProjectLi = projectList.querySelector(`[data-active-project`);
	const newActiveProjectLi = projectList.querySelector(
		`[data-project-id="${project.id}"]`,
	);

	if (oldActiveProjectLi) {
		delete oldActiveProjectLi.dataset.activeProject;
		const oldActiveProjectLiBtn = oldActiveProjectLi.querySelector('button');
		oldActiveProjectLiBtn.classList.remove(
			'font-medium',
			'text-red-600',
			'bg-slate-200',
			'cursor-default',
		);
		oldActiveProjectLiBtn.classList.add('hover:bg-slate-100');
	}

	newActiveProjectLi.dataset.activeProject = '';
	const oldActiveProjectLiBtn = newActiveProjectLi.querySelector('button');
	oldActiveProjectLiBtn.classList.add(
		'font-medium',
		'text-red-600',
		'bg-slate-200',
		'cursor-default',
	);
	oldActiveProjectLiBtn.classList.remove('hover:bg-slate-100');

	todosProjectTitle.textContent = project.title;

	clearTodoList();
	for (const todo of todos) {
		const todoLi = createTodoLi(todo);
		todoList.append(todoLi);
	}
}

export { addFormValidations, addEventListeners, renderProject, switchProject };
