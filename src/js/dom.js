import sanitizeHtml from 'sanitize-html';
import { format as formatDate, formatRFC3339 } from 'date-fns';
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

function populateProjectForm(project) {
	const titleInput = projectForm.querySelector('#projectTitle');
	titleInput.value = project.title;
}

function populateTodoForm(todo) {
	todoForm.querySelector('#todoTitle').value = todo.title;
	todoForm.querySelector('#todoDescription').value = todo.description;
	todoForm.querySelector('#todoDueDate').value = formatDate(
		todo.dueDate,
		'yyyy-MM-dd',
	);
	todoForm.querySelector('#todoPriority').value = todo.priority;
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
		switch (resource) {
			case 'project':
				EE.emit('will-populate-project-form', resourceId);
				break;
			case 'todo':
				EE.emit('will-populate-todo-form', resourceId);
				break;
		}
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
			return EE.emit('will-create-project', { title: titleInput.value });
		case 'edit':
			delete projectForm.dataset.projectId;
			return EE.emit('will-update-project', projectId, {
				title: titleInput.value,
			});
	}

	delete projectForm.dataset.formOperation;
}

function handleTodoFormSubmit() {
	const formOperation = todoForm.dataset.formOperation;
	const activeProjectId = projectList.querySelector('[data-active-project]')
		.dataset.projectId;
	const todoId = todoForm.dataset.todoId;
	const title = todoForm.querySelector('#todoTitle').value;
	const description = todoForm.querySelector('#todoDescription').value;
	const dueDate = new Date(todoForm.querySelector('#todoDueDate').value);
	const priority = Number(todoForm.querySelector('#todoPriority').value);

	switch (formOperation) {
		case 'new':
			return EE.emit('will-create-todo', {
				projectId: activeProjectId,
				title,
				description,
				dueDate,
				priority,
			});
		case 'edit':
			delete todoForm.dataset.todoId;
			return EE.emit('will-update-todo', todoId, {
				title,
				description,
				dueDate,
				priority,
			});
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
				<use href="#pen-to-square-symbol" />
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
				<use href="#xmark-symbol" />
			</svg>
		</button>
	`;

	const switchProjectBtn = projectLi.querySelector('.switchProjectBtn');
	const editProjectBtn = projectLi.querySelector('.editProjectBtn');
	const deleteProjectBtn = projectLi.querySelector('.deleteProjectBtn');

	switchProjectBtn.addEventListener('click', handleSwitchProjectBtnClick);
	editProjectBtn.addEventListener('click', handleOpenDialogBtnClick);
	deleteProjectBtn.addEventListener('click', handleDeleteProjectBtnClick);

	return projectLi;
}

function renderProject(project) {
	const projectLi = createProjectLi(project);
	projectList.append(projectLi);
}

function removeOldActiveProjectLiStyle(oldActiveProjectLi) {
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

function addActiveProjectLiStyle(newActiveProjectLi) {
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
}

function setTodosTitle(todosTitle) {
	todosProjectTitle.textContent = todosTitle;
}

function updateProject(updatedProject) {
	const oldProjectLi = projectList.querySelector(
		`[data-project-id="${updatedProject.id}"]`,
	);
	const isProjectLiActive =
		oldProjectLi.dataset.hasOwnProperty('activeProject');
	const newProjectLi = createProjectLi(updatedProject);
	if (isProjectLiActive) {
		addActiveProjectLiStyle(newProjectLi);
		newProjectLi.dataset.activeProject = '';
		setTodosTitle(sanitizeHtml(updatedProject.title));
	}
	projectList.replaceChild(newProjectLi, oldProjectLi);
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

function handleTodoCircleBtnClick(e) {
	const todoId = e.currentTarget.dataset.todoId;
	EE.emit('will-complete/uncomplete-todo', todoId);
}

function handleDeleteTodoBtn(e) {
	const todoId = e.currentTarget.dataset.todoId;
	EE.emit('will-delete-todo', todoId);
}

function removeTodo(todoId) {
	const todoLi = todoList.querySelector(`[data-todo-id="${todoId}"]`);
	const todoCircleBtn = todoLi.querySelector('.todoCircleBtn');
	const editTodoBtn = todoLi.querySelector('.editTodoBtn');
	const deleteTodoBtn = todoLi.querySelector('.deleteTodoBtn');
	todoCircleBtn.removeEventListener('click', handleTodoCircleBtnClick);
	editTodoBtn.removeEventListener('click', handleOpenDialogBtnClick);
	deleteTodoBtn.removeEventListener('click', handleDeleteTodoBtn);
	todoLi.remove();
}

function clearTodoList() {
	while (todoList.children.length > 0) {
		removeTodo(todoList.children[0].dataset.todoId);
	}
}

function getTodoLiCSSClass(complete) {
	let todoLiCSSClass = 'relative py-2 pl-8 pr-14 shadow sm:py-3';
	if (complete) {
		todoLiCSSClass += ' opacity-80';
	}
	return todoLiCSSClass;
}

function getTodoCircleBtnCSSClass(priority) {
	let todoCircleBtnCSSClass = 'todoCircleBtn absolute left-2 top-4';
	// I can't use string concatenation because tailwindcss doesnt generate dynamic class names.
	switch (priority) {
		case 1:
			todoCircleBtnCSSClass += ' fill-red-600 hover:fill-red-700';
			break;
		case 2:
			todoCircleBtnCSSClass += ' fill-amber-600 hover:fill-amber-700';
			break;
		case 3:
			todoCircleBtnCSSClass += ' fill-blue-600 hover:fill-blue-700';
			break;
		case 4:
			todoCircleBtnCSSClass += ' fill-neutral-600 hover:fill-neutral-700';
			break;
	}
	return todoCircleBtnCSSClass;
}

function getTodoCircleBtnIcon(complete) {
	if (complete) {
		return `
			<svg 
				class="h-4"
				xmlns="http://www.w3.org/2000/svg" 
				viewBox="0 0 512 512"
			>
				<use href="#solid-circle-symbol" />
			</svg>
		`;
	} else {
		return `
			<svg
				class="h-4"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 512 512"
			>
				<use href="#regular-circle-symbol" />
			</svg>
	`;
	}
}

function getTodoTitleCSSClass(complete) {
	let todoTitleCSSClass = 'todoTitle';
	if (complete) {
		todoTitleCSSClass += ' line-through';
	}
	return todoTitleCSSClass;
}

function formatTodoDueDate(dueDate) {
	return formatDate(dueDate, 'PPPP');
}

function createTodoLi(todo) {
	const todoLi = document.createElement('li');
	const todoLiCSSClass = getTodoLiCSSClass(todo.complete);
	todoLi.setAttribute('class', todoLiCSSClass);
	todoLi.dataset.todoId = todo.id;

	const todoCircleBtnCSSClass = getTodoCircleBtnCSSClass(todo.priority);
	const todoCircleBtnIcon = getTodoCircleBtnIcon(todo.complete);
	const todoTitleCSSClass = getTodoTitleCSSClass(todo.complete);

	todoLi.innerHTML = `
		<button
			type="button"
			class="${todoCircleBtnCSSClass}"
			title="Complete/uncomplete todo"
			data-todo-id="${todo.id}"
		>
			${todoCircleBtnIcon}
		</button>
		<details class="w-full">
			<summary
				class="inline-flex w-full cursor-pointer items-center border-b border-solid border-gray-200 hover:border-gray-300"
			>
				<p class="${todoTitleCSSClass}">${sanitizeHtml(todo.title)}</p>
				<p class="todoDueDate ml-5 text-sm text-neutral-600">${formatTodoDueDate(
					todo.dueDate,
				)}</p>
			</summary>
			<p class="todoDescription pt-2 text-sm">
				${sanitizeHtml(todo.description)}
			</p>
		</details>
		<button
			type="button"
			class="editTodoBtn fill-main absolute right-8 top-4 text-2xl"
			title="Edit todo"
			data-dialog-id="todoDialog"
			data-submit-btn-text="Update"
			data-form-operation="edit"
			data-resource="todo"
			data-todo-id="${todo.id}"
		>
			<svg
				class="h-4"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 512 512"
			>
				<use href="#pen-to-square-symbol" />
			</svg>
		</button>
		<button
			type="button"
			class="deleteTodoBtn fill-main absolute right-3 top-4"
			title="Delete todo"
			data-todo-id="${todo.id}"
		>
			<svg
				class="h-4"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 384 512"
			>
				<use href="#xmark-symbol" />
			</svg>
		</button>
	`;

	const todoCircleBtn = todoLi.querySelector('.todoCircleBtn');
	todoCircleBtn.addEventListener('click', handleTodoCircleBtnClick);

	const editTodoBtn = todoLi.querySelector('.editTodoBtn');
	editTodoBtn.addEventListener('click', handleOpenDialogBtnClick);

	const deleteTodoBtn = todoLi.querySelector('.deleteTodoBtn');
	deleteTodoBtn.addEventListener('click', handleDeleteTodoBtn);

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

function updateTodo(todo) {
	const oldTodoLi = todoList.querySelector(`[data-todo-id="${todo.id}"]`);
	const newTodoLi = createTodoLi(todo);
	todoList.replaceChild(newTodoLi, oldTodoLi);
}

function switchProject(project, todos) {
	const oldActiveProjectLi = projectList.querySelector(`[data-active-project`);
	const newActiveProjectLi = projectList.querySelector(
		`[data-project-id="${project.id}"]`,
	);
	if (oldActiveProjectLi) {
		removeOldActiveProjectLiStyle(oldActiveProjectLi);
		delete oldActiveProjectLi.dataset.activeProject;
	}
	addActiveProjectLiStyle(newActiveProjectLi);
	newActiveProjectLi.dataset.activeProject = '';
	setTodosTitle(sanitizeHtml(project.title));
	clearTodoList();
	renderTodos(todos);
}

export {
	addFormValidations,
	populateProjectForm,
	populateTodoForm,
	addEventListeners,
	renderProject,
	updateProject,
	removeProject,
	removeTodo,
	determineAddTodoDisplay,
	setTodosTitle,
	clearTodoList,
	renderTodo,
	updateTodo,
	switchProject,
};
