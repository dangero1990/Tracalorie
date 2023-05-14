import '@fortawesome/fontawesome-free/js/all';
import { Modal, Collapse } from 'bootstrap';
import CarlorieTracker from './Tracker';
import { Meal, Workout } from './Item';

import './css/bootstrap.css';
import './css/style.css';

class App {
    constructor() {
        this._tracker = new CarlorieTracker();
        this._loadEventListeners();
        this._tracker.loadItems();
    }

    _loadEventListeners() {
        document.getElementById('meal-form').addEventListener('submit', this._newItem.bind(this, 'meal'))
        document.getElementById('workout-form').addEventListener('submit', this._newItem.bind(this, 'workout'))
        document.getElementById('meal-items').addEventListener('click',this._removeItems.bind(this, 'meal'))
        document.getElementById('workout-items').addEventListener('click',this._removeItems.bind(this, 'workout'))
        document.getElementById('filter-meals').addEventListener('keyup', this._filerItems.bind(this, 'meal'))
        document.getElementById('filter-workouts').addEventListener('keyup', this._filerItems.bind(this, 'workout'))
        document.getElementById('reset').addEventListener('click', this._reset.bind(this))
        document.getElementById('limit-form').addEventListener('submit', this._setLimit.bind(this))
    }

    _newItem(type, e) {
        e.preventDefault();

        const name = document.getElementById(`${type}-name`);
        const calories = document.getElementById(`${type}-calories`);

        //Validate inputs
        if(name.value === '' || calories.value === '') {
            alert('Please fill in all fields');
            return
        }

        if(type === 'meal') {
            const meal = new Meal(name.value, +calories.value);
            this._tracker.addMeal(meal);
        } else {
            const workout = new Workout(name.value, +calories.value);
            this._tracker.addWorkout(workout);
        }

        name.value = '';
        calories.value = '';

        const collapseItem = document.getElementById(`collapse-${type}`);
        const bsCollapse = new Collapse(collapseItem, {toggle:true});
    }

    _removeItems(type, e) {
        if(e.target.classList.contains('delete') || e.target.classList.contains('fa-xmark')) {
            if(confirm('Are you sure?')) {
                const id = e.target.closest('.card').getAttribute('data-id');
                
                type === 'meal'
                    ? this._tracker.removeMeal(id)
                    : this._tracker.removeWorkout(id);

                e.target.closest('.card').remove();
            }
        }
    }

    _filerItems(type, e) {
        const text = e.target.value.toLowerCase()
        document.querySelectorAll(`#${type}-items .card`).forEach(item => {
            const name = item.firstElementChild.firstElementChild.textContent;

            if(name.toLocaleLowerCase().indexOf(text) !== -1) {
                item.style.display = 'block'
            } else {
                item.style.display ='none'
            }
        });
    }

    _reset() {
        this._tracker.reset();
        document.getElementById('meal-items').innerText = '';
        document.getElementById('workout-items').innerText = '';
        document.getElementById('filter-meals').value = '';
        document.getElementById('filter-workouts').value = '';
    }

    _setLimit(e) {
        e.preventDefault();
        const limit = document.getElementById('limit');

        if(limit.value === '') {
            alert('Please add a limit');
            return
        }

        this._tracker.setLimit(+limit.value);
        limit.value = '';

        const modalEl = document.getElementById('limit-modal');
        const modal = Modal.getInstance(modalEl);
        modal.hide();
    }
}

const app = new App()