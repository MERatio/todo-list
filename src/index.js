import './style.css';
import { addEvents } from './js/events';
import addDummyInitialElements from './js/addDummyInitialElements';
import addInitialElements from './js/addInitialElements';
import * as dom from './js/dom';

document.addEventListener('DOMContentLoaded', () => {
	addEvents();
	if (localStorage.getItem('projects') === null) {
		addDummyInitialElements();
	} else {
		addInitialElements();
	}
	dom.determineAddTodoDisplay();
	dom.addFormValidations();
	dom.addEventListeners();
});
